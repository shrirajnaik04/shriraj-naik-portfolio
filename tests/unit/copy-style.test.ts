import { describe, expect, test } from 'vitest'
import * as content from '@/content'
import { walkStrings } from '../helpers/walk-strings'

const BANNED = [
  /cutting-edge/i,
  /next-gen(eration)?/i,
  /revolutionary/i,
  /world-class/i,
  /passionate/i,
  /ninja/i,
  /rockstar/i,
  /guru/i,
  /synergy/i,
  /\bleverag/i,
  /seamless/i,
  /game-changer/i,
  /\bexpert\b/i,
  /\barchitect\b/i,
]

/** Per-project maturity labels are not used (2026-10-29 brief). Matched by equality, not substring. */
const STATUS_WORDS = ['live', 'in development', 'prototype', 'client work']

const isQuote = (path: string) => /^testimonials\.\d+\.quote$/.test(path)

describe('copy style', () => {
  test('no banned phrases outside testimonial quotes', () => {
    const hits = walkStrings(content, isQuote).flatMap(({ path, value }) =>
      BANNED.filter((re) => re.test(value)).map((re) => `${path}: ${re}`),
    )
    expect(hits).toEqual([])
  })

  test('never "vibe coder" or "vibe coding", anywhere', () => {
    expect(walkStrings(content).filter(({ value }) => /vibe cod/i.test(value))).toEqual([])
  })

  test('vibe engineer is defined once, in the profile', () => {
    expect(content.profile.vibeDefinition).toMatch(/^vibe engineer/i)
    const mentions = walkStrings(content).filter(({ value }) => /vibe engineer/i.test(value))
    expect(mentions.map((m) => m.path)).toEqual(['profile.vibeDefinition'])
  })

  test('no string is a bare status label', () => {
    const hits = walkStrings(content).filter(({ value }) => STATUS_WORDS.includes(value.trim().toLowerCase()))
    expect(hits).toEqual([])
  })

  test('no middle-dot meta strings ("A · B · C")', () => {
    expect(walkStrings(content).filter(({ value }) => value.includes('·'))).toEqual([])
  })

  test('counts never carry a tool list (they would credit the listed tools with all of them)', () => {
    const hits = walkStrings(content, isQuote).filter(
      ({ value }) => /1,000\+/.test(value) && /\b(using|with) (Playwright|JMeter|Postman|TestSigma)/.test(value),
    )
    expect(hits).toEqual([])
  })
})
