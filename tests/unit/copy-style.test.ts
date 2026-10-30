import { describe, expect, test } from 'vitest'
import * as content from '@/content'
import { resumeTextLines } from '@/content/resume'
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

  test('never "vibe coder"; "vibe coding" only once, as what the definition is the opposite of', () => {
    expect(walkStrings(content).filter(({ value }) => /vibe coder/i.test(value))).toEqual([])
    const coding = walkStrings(content).filter(({ value }) => /vibe coding/i.test(value))
    expect(coding.map((m) => m.path)).toEqual(['profile.vibeDefinition'])
    expect(content.profile.vibeDefinition).toMatch(/opposite of unguided .vibe coding/)
  })

  test('Vibe Engineer is defined once, in the profile, with V and E capitalised', () => {
    expect(content.profile.vibeDefinition).toMatch(/^Vibe Engineer \(n\.\)/)
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

describe('copy style: the resume', () => {
  const lines = resumeTextLines()

  test('no banned phrases, middle dots or bare status labels', () => {
    const hits = lines.flatMap((line) => {
      const found = BANNED.filter((re) => re.test(line)).map(String)
      if (line.includes('·')) found.push('middle dot')
      if (STATUS_WORDS.includes(line.trim().toLowerCase())) found.push('status label')
      return found.map((hit) => `${line.slice(0, 48)}: ${hit}`)
    })
    expect(hits).toEqual([])
  })

  test('counts never carry a tool list, sentence by sentence', () => {
    const sentences = lines.flatMap((line) => line.split(/(?<=\.)\s+/))
    const hits = sentences.filter(
      (s) => /1,000\+/.test(s) && /\b(using|with) (Playwright|JMeter|Postman|TestSigma)/.test(s),
    )
    expect(hits).toEqual([])
  })
})
