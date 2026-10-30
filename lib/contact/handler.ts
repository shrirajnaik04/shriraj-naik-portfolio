import { buildEnquiryEmail } from './email'
import { MailConfigError, type OutgoingMail } from './mailer'
import type { RateLimiter } from './rate-limit'
import { validateContactFields } from './schema'

export const MAX_BODY_BYTES = 8192
/** Sooner after the page opened than a person writes a message: refused with a retryable error. */
export const MIN_FILL_MS = 3000
/** Older than a day: the page should be reloaded. */
export const MAX_AGE_MS = 86_400_000

export type ContactErrorCode =
  | 'unsupported_media_type'
  | 'payload_too_large'
  | 'forbidden_origin'
  | 'rate_limited'
  | 'invalid_json'
  | 'validation'
  | 'expired'
  | 'too_fast'
  | 'send_failed'

export interface ContactDeps {
  send(mail: OutgoingMail): Promise<void>
  limiter: RateLimiter
  recipient: string
  from?: string
  /** One event per request, never personal data. */
  log(event: string): void
  now?: () => number
}

function reply(status: number, body: object, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

function fail(status: number, error: ContactErrorCode, extra: object = {}, headers: Record<string, string> = {}) {
  return reply(status, { ok: false, error, ...extra }, headers)
}

/** Reads the body as text, refusing (null) as soon as it passes `max` bytes, so it is never fully buffered. */
async function readBodyLimited(req: Request, max: number): Promise<string | null> {
  const declared = Number(req.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > max) return null
  if (!req.body) return ''
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > max) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const host = req.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function clientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function errorCode(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code
  return typeof code === 'string' && /^[A-Z0-9_]{1,32}$/.test(code) ? code : 'unknown'
}

/** POST /api/contact. Guards run in order; the first failure returns. */
export async function handleContact(req: Request, deps: ContactDeps): Promise<Response> {
  const now = deps.now ?? Date.now

  if (!/^application\/json\s*(;|$)/i.test(req.headers.get('content-type') ?? '')) {
    deps.log('contact:unsupported_media_type')
    return fail(415, 'unsupported_media_type')
  }

  const raw = await readBodyLimited(req, MAX_BODY_BYTES)
  if (raw === null) {
    deps.log('contact:payload_too_large')
    return fail(413, 'payload_too_large')
  }

  if (!sameOrigin(req)) {
    deps.log('contact:forbidden_origin')
    return fail(403, 'forbidden_origin')
  }

  const limit = deps.limiter.check(clientKey(req))
  if (!limit.allowed) {
    deps.log('contact:rate_limited')
    return fail(429, 'rate_limited', {}, { 'retry-after': String(limit.retryAfterSec) })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = null
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    deps.log('contact:invalid_json')
    return fail(400, 'invalid_json')
  }
  const input = parsed as Record<string, unknown>

  // Bots: a filled hidden field, which no person can reach. Answer as if sent, so they learn nothing.
  // A browser always sends the hidden field as a string, so any other non-null value is a script.
  const company = input.company
  const honeypot = typeof company === 'string' ? company.trim() !== '' : company != null
  if (honeypot) {
    deps.log('contact:honeypot')
    return reply(200, { ok: true })
  }
  const elapsed = input.elapsedMs
  if (typeof elapsed !== 'number' || !Number.isFinite(elapsed) || elapsed > MAX_AGE_MS) {
    deps.log('contact:expired')
    return fail(400, 'expired')
  }
  // Too soon after the page opened: usually a script, but a person can do it too (a form restored by
  // a reload and sent at once). Say so, so they can send again; never pretend it was sent.
  if (elapsed < MIN_FILL_MS) {
    deps.log('contact:too_fast')
    return fail(400, 'too_fast')
  }

  const result = validateContactFields(input)
  if (!result.ok) {
    deps.log('contact:validation')
    return fail(400, 'validation', { fields: result.fields })
  }

  try {
    await deps.send({
      to: deps.recipient,
      from: deps.from,
      replyTo: result.data.email,
      ...buildEnquiryEmail(result.data, new Date(now())),
    })
  } catch (error) {
    deps.log(error instanceof MailConfigError ? 'contact:mail_config_missing' : `contact:send_failed:${errorCode(error)}`)
    return fail(500, 'send_failed')
  }

  deps.log('contact:sent')
  return reply(200, { ok: true })
}
