import { describe, expect, test } from 'vitest'
import * as content from '@/content'
import { findConfidentialTerms, loadConfidentialTerms } from '../helpers/confidential-terms'
import { walkStrings } from '../helpers/walk-strings'

const terms = loadConfidentialTerms()
const PHONE_DIGITS = '9764904641'

if (!terms && !process.env.CI) {
  console.warn(
    '\n⚠ CONFIDENTIALITY CHECK SKIPPED: no .confidential-terms file and no CONFIDENTIAL_TERMS env var.\n',
  )
}

describe('confidentiality and banned terms', () => {
  test('CI must provide the terms', () => {
    if (process.env.CI) expect(terms?.length ?? 0).toBeGreaterThan(0)
  })

  test.skipIf(!terms)('content contains no confidential or banned terms', () => {
    const hits = walkStrings(content).flatMap(({ path, value }) =>
      findConfidentialTerms(value, terms ?? []).map((t) => `${path} contains a listed term (${t.length} chars)`),
    )
    expect(hits).toEqual([])
  })

  test('the phone number appears only in profile.phone (resume use)', () => {
    const paths = walkStrings(content)
      .filter(({ value }) => value.replace(/\D/g, '').includes(PHONE_DIGITS))
      .map(({ path }) => path)
    expect(paths).toEqual(['profile.phone'])
  })
})
