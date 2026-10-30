import { describe, expect, test } from 'vitest'
import { buildEnquiryEmail } from '@/lib/contact/email'

const at = new Date('2026-10-30T10:00:00Z')

describe('enquiry email', () => {
  test('escapes HTML in every field', () => {
    const x = '<script>alert(1)</script>'
    const { html } = buildEnquiryEmail({ name: x, email: 'a@b.co', subject: x, message: x }, at)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  test('the subject cannot inject headers', () => {
    const { subject } = buildEnquiryEmail({ name: 'Ann', email: 'a@b.co', subject: 'Hi\r\nBcc: x@y.z', message: 'm' }, at)
    expect(subject).toBe('Portfolio enquiry: Hi Bcc: x@y.z')
    expect(subject).not.toMatch(/[\r\n]/)
  })

  test('a plain-text alternative carries the message and sender', () => {
    const { text } = buildEnquiryEmail(
      { name: 'Ann', email: 'a@b.co', subject: 'Hello', message: 'Line one\nLine two' },
      at,
    )
    expect(text).toContain('Line one\nLine two')
    expect(text).toContain('Ann <a@b.co>')
  })
})
