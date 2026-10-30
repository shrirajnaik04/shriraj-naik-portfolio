import { profile } from '@/content'
import { handleContact } from '@/lib/contact/handler'
import { createMailer } from '@/lib/contact/mailer'
import { createRateLimiter } from '@/lib/contact/rate-limit'

export const runtime = 'nodejs'

/** 5 messages per IP per 10 minutes, per function instance (best effort; see HARNESS.md). */
const limiter = createRateLimiter({ limit: 5, windowMs: 600_000 })
const log = (event: string) => console.info(event)
const mailer = createMailer(process.env, log)

export async function POST(req: Request): Promise<Response> {
  return handleContact(req, {
    send: (mail) => mailer.send(mail),
    limiter,
    recipient: process.env.RECIPIENT_EMAIL ?? profile.email,
    from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
    log,
  })
}
