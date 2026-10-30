import { describe, expect, test, vi } from 'vitest'
import { handleContact, MAX_BODY_BYTES, type ContactDeps } from '@/lib/contact/handler'
import { MailConfigError, type OutgoingMail } from '@/lib/contact/mailer'
import { createRateLimiter } from '@/lib/contact/rate-limit'
import { FIELD_ERRORS } from '@/lib/contact/schema'

const fields = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Hello there', message: 'A message long enough.' }
const body = (over: Record<string, unknown> = {}) => JSON.stringify({ ...fields, company: '', elapsedMs: 15_000, ...over })

function request(raw: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3100/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:3100',
      host: 'localhost:3100',
      'x-forwarded-for': '203.0.113.7, 10.0.0.1',
      ...headers,
    },
    body: raw,
  })
}

function deps(over: Partial<ContactDeps> = {}) {
  const sent: OutgoingMail[] = []
  const logs: string[] = []
  const d: ContactDeps = {
    send: vi.fn(async (m: OutgoingMail) => {
      sent.push(m)
    }),
    limiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
    recipient: 'owner@example.com',
    from: 'site@example.com',
    log: (e) => logs.push(e),
    ...over,
  }
  return { d, sent, logs }
}

const json = async (res: Response) => ({ status: res.status, body: await res.json() })

describe('contact handler', () => {
  test('415 for non-JSON', async () => {
    const { d } = deps()
    expect(await json(await handleContact(request(body(), { 'content-type': 'text/plain' }), d))).toEqual({
      status: 415,
      body: { ok: false, error: 'unsupported_media_type' },
    })
  })

  test('413 above the body limit, without parsing it', async () => {
    const { d } = deps()
    const res = await handleContact(request('x'.repeat(MAX_BODY_BYTES + 1)), d)
    expect(await json(res)).toEqual({ status: 413, body: { ok: false, error: 'payload_too_large' } })
  })

  test('403 without an Origin, or when its host differs from Host', async () => {
    const { d } = deps()
    const noOrigin = request(body())
    noOrigin.headers.delete('origin')
    expect((await handleContact(noOrigin, d)).status).toBe(403)
    expect((await handleContact(request(body(), { origin: 'https://evil.example' }), d)).status).toBe(403)
  })

  test('429 with Retry-After on the 6th request from one IP; another IP is unaffected', async () => {
    const { d } = deps()
    for (let i = 0; i < 5; i++) expect((await handleContact(request(body()), d)).status).toBe(200)
    const limited = await handleContact(request(body()), d)
    expect(limited.status).toBe(429)
    expect(Number(limited.headers.get('retry-after'))).toBeGreaterThan(0)
    expect((await handleContact(request(body(), { 'x-forwarded-for': '198.51.100.9' }), d)).status).toBe(200)
  })

  test('400 invalid_json for malformed JSON or a non-object', async () => {
    const { d } = deps()
    expect(await json(await handleContact(request('{nope'), d))).toEqual({
      status: 400,
      body: { ok: false, error: 'invalid_json' },
    })
    expect((await handleContact(request('[1,2]'), d)).status).toBe(400)
  })

  test('a filled honeypot gets 200 and nothing is sent', async () => {
    const { d, sent, logs } = deps()
    expect(await json(await handleContact(request(body({ company: 'Acme' })), d))).toEqual({
      status: 200,
      body: { ok: true },
    })
    expect(sent).toHaveLength(0)
    expect(logs).toContain('contact:honeypot')
  })

  test('a non-string honeypot counts as filled and never throws', async () => {
    // A browser always sends the hidden field as a string; anything else is a script. `{"toString":1}`
    // used to make String() throw, so the request failed with a bare 500.
    for (const company of [{ toString: 1 }, 42, true, ['x'], {}]) {
      const { d, sent } = deps()
      const res = await json(await handleContact(request(body({ company })), d))
      expect(res, JSON.stringify(company)).toEqual({ status: 200, body: { ok: true } })
      expect(sent).toHaveLength(0)
    }
  })

  test('a send within 3 seconds of the page opening is refused with a retryable error, never a fake success', async () => {
    // A person can trip this too (a form restored by a reload, sent at once), so it must say so.
    const { d, sent, logs } = deps()
    expect(await json(await handleContact(request(body({ elapsedMs: 1200 })), d))).toEqual({
      status: 400,
      body: { ok: false, error: 'too_fast' },
    })
    expect(sent).toHaveLength(0)
    expect(logs).toContain('contact:too_fast')
  })

  test('a form open for more than 24 hours, or without a timer, is expired', async () => {
    const { d } = deps()
    expect(await json(await handleContact(request(body({ elapsedMs: 86_400_001 })), d))).toEqual({
      status: 400,
      body: { ok: false, error: 'expired' },
    })
    expect((await handleContact(request(body({ elapsedMs: 'soon' })), d)).status).toBe(400)
  })

  test('400 validation with per-field messages', async () => {
    const { d, sent } = deps()
    const res = await json(await handleContact(request(body({ name: '', email: 'x', subject: '', message: '' })), d))
    expect(res).toEqual({ status: 400, body: { ok: false, error: 'validation', fields: FIELD_ERRORS } })
    expect(sent).toHaveLength(0)
  })

  test('accepts non-ASCII names end to end', async () => {
    for (const name of ['José Ñúñez', 'शिवा नाइक', "O'Neil"]) {
      const { d, sent } = deps()
      expect((await handleContact(request(body({ name })), d)).status).toBe(200)
      expect(sent).toHaveLength(1)
    }
  })

  test('a missing mail config returns a generic 500 and is logged, leaking nothing', async () => {
    const { d, logs } = deps({
      send: async () => {
        throw new MailConfigError()
      },
    })
    const res = await handleContact(request(body()), d)
    const text = await res.text()
    expect(res.status).toBe(500)
    expect(JSON.parse(text)).toEqual({ ok: false, error: 'send_failed' })
    expect(text).not.toMatch(/stack|EMAIL_|config/i)
    expect(logs).toContain('contact:mail_config_missing')
  })

  test('a send failure returns a generic 500 and logs only the error code', async () => {
    const { d, logs } = deps({
      send: async () => {
        throw Object.assign(new Error('Invalid login: 535 secret details'), { code: 'EAUTH' })
      },
    })
    expect(await json(await handleContact(request(body()), d))).toEqual({
      status: 500,
      body: { ok: false, error: 'send_failed' },
    })
    expect(logs).toContain('contact:send_failed:EAUTH')
    expect(logs.join(' ')).not.toContain('secret')
  })

  test('success sends one escaped mail to the recipient, replying to the sender', async () => {
    const { d, sent, logs } = deps()
    const res = await handleContact(request(body({ message: 'Hello <b>there</b>, a real message.' })), d)
    expect(await json(res)).toEqual({ status: 200, body: { ok: true } })
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({
      to: 'owner@example.com',
      from: 'site@example.com',
      replyTo: 'ada@example.com',
      subject: 'Portfolio enquiry: Hello there',
    })
    expect(sent[0].html).toContain('Hello &lt;b&gt;there&lt;/b&gt;')
    expect(logs).toContain('contact:sent')
  })

  test('responses are never cached', async () => {
    const { d } = deps()
    expect((await handleContact(request(body()), d)).headers.get('cache-control')).toBe('no-store')
  })

  test('logs never contain submitted personal data', async () => {
    const { d, logs } = deps()
    await handleContact(request(body()), d)
    await handleContact(request(body({ email: 'bad' })), d)
    const all = logs.join(' ')
    for (const value of Object.values(fields)) expect(all).not.toContain(value)
  })
})
