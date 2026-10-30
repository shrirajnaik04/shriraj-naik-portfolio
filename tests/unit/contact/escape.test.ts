import { describe, expect, test } from 'vitest'
import { escapeHtml, toHeaderSafe } from '@/lib/contact/escape'

describe('escaping', () => {
  test('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    )
  })

  test('header values lose control characters and collapse whitespace', () => {
    expect(toHeaderSafe('Hi\r\nBcc: victim@example.com\t\u0000 there  ')).toBe('Hi Bcc: victim@example.com there')
    expect(toHeaderSafe('a\u007fb')).toBe('a b')
  })
})
