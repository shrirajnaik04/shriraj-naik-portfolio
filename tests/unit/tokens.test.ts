import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

type Tokens = Record<string, string>

/** Reads `--name: #hex` declarations from the light `:root` block and the dark `[data-theme='dark']` block. */
function parseTokens(css: string): { light: Tokens; dark: Tokens } {
  const read = (block: string): Tokens =>
    Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((m) => [m[1], m[2]]))
  const darkStart = css.indexOf(":root[data-theme='dark']")
  if (darkStart === -1) throw new Error('no dark block')
  return { light: read(css.slice(0, darkStart)), dark: read(css.slice(darkStart)) }
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const TOKENS = [
  'paper',
  'paper-deep',
  'card',
  'ink',
  'ink-soft',
  'rule',
  'signal',
  'signal-bright',
  'evidence',
  'on-signal',
  'band',
  'on-band',
  'band-soft',
  'signal-on-band',
  'evidence-on-band',
]

const tokens = parseTokens(readFileSync('app/tokens.css', 'utf8'))

describe('colour tokens (Editorial Engineering)', () => {
  test('WCAG helper matches a known pair', () => {
    expect(ratio('#000000', '#ffffff')).toBeCloseTo(21, 5)
  })

  for (const mode of ['light', 'dark'] as const) {
    const t = tokens[mode]

    test(`${mode}: every token is defined as a hex colour`, () => {
      expect(Object.keys(t).sort()).toEqual([...TOKENS].sort())
    })

    test(`${mode}: text on paper surfaces meets WCAG AA`, () => {
      for (const surface of ['paper', 'paper-deep', 'card']) {
        expect(ratio(t.ink, t[surface]), `ink/${surface}`).toBeGreaterThanOrEqual(7)
        for (const fg of ['ink-soft', 'signal', 'evidence']) {
          expect(ratio(t[fg], t[surface]), `${fg}/${surface}`).toBeGreaterThanOrEqual(4.5)
        }
      }
      expect(ratio(t['on-signal'], t.signal), 'on-signal/signal').toBeGreaterThanOrEqual(4.5)
    })

    test(`${mode}: focus ring and large graphics reach 3:1 (WCAG 1.4.11)`, () => {
      expect(ratio(t.signal, t.paper), 'focus ring on paper').toBeGreaterThanOrEqual(3)
      expect(ratio(t['signal-bright'], t.paper), 'signal-bright/paper').toBeGreaterThanOrEqual(3)
    })

    test(`${mode}: text on the ink-blue band meets WCAG AA`, () => {
      expect(ratio(t['on-band'], t.band), 'on-band/band').toBeGreaterThanOrEqual(7)
      for (const fg of ['band-soft', 'signal-on-band', 'evidence-on-band']) {
        expect(ratio(t[fg], t.band), `${fg}/band`).toBeGreaterThanOrEqual(4.5)
      }
    })

    test(`${mode}: the band stays visibly distinct from the page`, () => {
      expect(ratio(t.band, t.paper), 'band/paper').toBeGreaterThanOrEqual(1.3)
    })
  }
})
