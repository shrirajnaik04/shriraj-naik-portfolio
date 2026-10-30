import { readFileSync, statSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file)
  expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE), `${file} is a PNG`).toBe(true)
  expect(bytes.toString('ascii', 12, 16)).toBe('IHDR')
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

describe('generated images (pnpm assets:build)', () => {
  test('the social image is a 1200×630 PNG of at most 150 KB', () => {
    expect(pngSize('public/og.png')).toEqual({ width: 1200, height: 630 })
    expect(statSync('public/og.png').size).toBeLessThanOrEqual(150 * 1024)
  })

  test('the Apple touch icon is a 180×180 PNG of at most 20 KB', () => {
    expect(pngSize('app/apple-icon.png')).toEqual({ width: 180, height: 180 })
    expect(statSync('app/apple-icon.png').size).toBeLessThanOrEqual(20 * 1024)
  })
})

describe('the mark', () => {
  test('app/icon.svg draws the shared mark: paths only, no font, brand colours', async () => {
    const { MARK } = await import('@/lib/brand-mark')
    const svg = readFileSync('app/icon.svg', 'utf8')
    for (const value of [MARK.viewBox, MARK.s, MARK.n, MARK.stem, MARK.ink, MARK.paper, MARK.tick, String(MARK.strokeWidth)])
      expect(svg, value).toContain(value)
    expect(svg).not.toMatch(/<text|font-family/)
  })
})
