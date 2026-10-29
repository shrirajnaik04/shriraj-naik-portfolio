import { describe, expect, test } from 'vitest'
import { getProject } from '@/content'
import { articleJsonLd, personJsonLd, serializeJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { SITE_URL } from '@/lib/site'

describe('JSON-LD', () => {
  test('serialization cannot break out of the script element', () => {
    const out = serializeJsonLd({ a: '</script><b>', b: 'x & y', c: '\u2028' })
    expect(out).not.toContain('</script>')
    expect(out).not.toMatch(/[<>&\u2028]/)
    expect(out).toContain(String.raw`\u003c/script\u003e`)
    expect(JSON.parse(out)).toEqual({ a: '</script><b>', b: 'x & y', c: '\u2028' })
  })

  test('person describes the live site without a phone number', () => {
    expect(personJsonLd()).toMatchObject({ '@type': 'Person', url: `${SITE_URL}/`, jobTitle: 'QA Automation Engineer' })
    expect(JSON.stringify(personJsonLd())).not.toMatch(/telephone|9764904641/)
  })

  test('website points at the canonical domain', () => {
    expect(websiteJsonLd()).toMatchObject({ '@type': 'WebSite', url: `${SITE_URL}/` })
  })

  test('case-study article is authored by the person', () => {
    const p = getProject('gym-daddy')!
    expect(articleJsonLd(p)).toMatchObject({
      '@type': 'Article',
      url: `${SITE_URL}/work/gym-daddy`,
      author: { '@id': `${SITE_URL}/#person` },
    })
  })
})
