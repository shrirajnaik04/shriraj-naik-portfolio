import nodemailer, { type Transporter } from 'nodemailer'

export class MailConfigError extends Error {
  constructor() {
    super('Mail transport is not configured')
    this.name = 'MailConfigError'
  }
}

export interface OutgoingMail {
  to: string
  from?: string
  replyTo: string
  subject: string
  html: string
  text: string
}

/**
 * SMTP mailer configured from the environment (EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER,
 * EMAIL_PASS). Configuration is resolved on first send, so a missing variable fails one request
 * with MailConfigError instead of crashing the function at import. CONTACT_TRANSPORT=stream swaps
 * in nodemailer's stream transport for end-to-end tests, and says so in the log.
 */
export function createMailer(env: NodeJS.ProcessEnv = process.env, log: (event: string) => void = console.info) {
  let transporter: Transporter | null = null
  const resolve = (): Transporter => {
    if (transporter) return transporter
    if (env.CONTACT_TRANSPORT === 'stream') {
      log('contact:test_transport')
      transporter = nodemailer.createTransport({ streamTransport: true, buffer: true })
      return transporter
    }
    const { EMAIL_HOST: host, EMAIL_USER: user, EMAIL_PASS: pass } = env
    if (!host || !user || !pass) throw new MailConfigError()
    transporter = nodemailer.createTransport({
      host,
      port: Number(env.EMAIL_PORT ?? 587),
      secure: env.EMAIL_SECURE === 'true',
      auth: { user, pass },
    })
    return transporter
  }
  return {
    async send(mail: OutgoingMail): Promise<void> {
      await resolve().sendMail(mail)
    },
  }
}
