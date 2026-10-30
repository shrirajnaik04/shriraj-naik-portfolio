import { escapeHtml, toHeaderSafe } from './escape'
import type { ContactFields } from './schema'

/** The enquiry email: every submitted value is escaped in the HTML part; a plain-text part mirrors it. */
export function buildEnquiryEmail(f: ContactFields, receivedAt: Date): { subject: string; html: string; text: string } {
  const received = receivedAt.toUTCString()
  const subject = `Portfolio enquiry: ${toHeaderSafe(f.subject)}`
  const html = [
    '<!doctype html><html><body style="margin:0;padding:24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55;color:#18233a;background:#f1efe9">',
    '<div style="max-width:560px;margin:0 auto;background:#faf9f5;border:1px solid #d3cfc4;padding:24px">',
    '<p style="margin:0 0 16px;font-size:13px;color:#4a5568">New message from shrirajnaik.com</p>',
    `<p style="margin:0 0 4px"><strong>From:</strong> ${escapeHtml(f.name)} &lt;${escapeHtml(f.email)}&gt;</p>`,
    `<p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(f.subject)}</p>`,
    `<div style="white-space:pre-wrap;border-top:1px solid #d3cfc4;padding-top:16px">${escapeHtml(f.message)}</div>`,
    `<p style="margin:24px 0 0;font-size:12px;color:#4a5568">Received ${escapeHtml(received)}. Reply to this email to answer the sender.</p>`,
    '</div></body></html>',
  ].join('')
  const text = [
    'New message from shrirajnaik.com',
    '',
    `From: ${f.name} <${f.email}>`,
    `Subject: ${f.subject}`,
    '',
    f.message,
    '',
    `Received ${received}. Reply to this email to answer the sender.`,
  ].join('\n')
  return { subject, html, text }
}
