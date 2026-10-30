/**
 * Full-page screenshots for before/after evidence: every path × width × colour scheme.
 * Each page is scrolled to the bottom first so in-view effects and lazy images have run.
 *
 * Usage: tsx scripts/perf/screenshots.ts <baseUrl> <outDir> [--paths / /work/gym-daddy] [--widths 390,768]
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const DEFAULT_WIDTHS = [390, 768, 1280, 1920]
const SCHEMES = ['light', 'dark'] as const

async function main(argv: string[]) {
  const [baseUrl, outDir] = argv
  if (!baseUrl || !outDir) {
    console.error('usage: tsx scripts/perf/screenshots.ts <baseUrl> <outDir> [--paths / /x] [--widths 390,768]')
    process.exit(2)
  }
  const after = (flag: string) => {
    const i = argv.indexOf(flag)
    if (i === -1) return []
    const out: string[] = []
    for (const a of argv.slice(i + 1)) {
      if (a.startsWith('--')) break
      out.push(a)
    }
    return out
  }
  const paths = after('--paths').length ? after('--paths') : ['/']
  const widths = after('--widths').length ? after('--widths')[0].split(',').map(Number) : DEFAULT_WIDTHS
  mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  try {
    for (const scheme of SCHEMES) {
      for (const width of widths) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme })
        for (const path of paths) {
          await page.goto(new URL(path, baseUrl).href, { waitUntil: 'networkidle' })
          const height = await page.evaluate(() => document.documentElement.scrollHeight)
          for (let y = 0; y < height; y += 600) {
            await page.evaluate((top) => window.scrollTo(0, top), y)
            await page.waitForTimeout(120)
          }
          await page.evaluate(() => window.scrollTo(0, 0))
          await page.waitForTimeout(800)
          const name = `${path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '_')}-${width}-${scheme}.png`
          await page.screenshot({ path: join(outDir, name), fullPage: true })
          console.log(name)
        }
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

main(process.argv.slice(2)).catch((err) => {
  console.error(err)
  process.exit(1)
})
