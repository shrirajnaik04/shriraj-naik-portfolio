import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { projects } from '@/content'
import { RESUME_PATH } from '@/lib/site'
import { BUDGETS } from '@/scripts/perf/measure'

/**
 * The "shrirajnaik.com" project describes this repository. Every sentence it publishes is traced
 * here to the code, test or measurement that makes it true; the project stays unpublished otherwise.
 */
const project = projects.find((p) => p.slug === 'this-portfolio')!
const read = (file: string) => readFileSync(file, 'utf8')
const pkg = JSON.parse(read('package.json')) as {
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}
const AFTER = 'docs/evidence/2026-10-29/after.json'

/** Test titles in a spec or test file, so a claim can point at the cases that prove it. */
const titles = (file: string) => [...read(file).matchAll(/test\(\s*[`'"](.+?)[`'"]/g)].map((m) => m[1])

describe('the "shrirajnaik.com" project', () => {
  test('is published', () => {
    expect(project.publish).toBe(true)
  })

  test('“Next.js 16 App Router with Server Components; only the menu, the theme switch, the contact form, the testimonial carousel and the drawings’ motion gate run in the browser”', () => {
    expect(project.built[0]).toMatch(/^Next\.js 16 App Router/)
    expect(pkg.dependencies.next).toMatch(/^16\./)
    expect(existsSync('app/layout.tsx')).toBe(true)
    const client = ['app', 'components', 'lib']
      .flatMap((dir) => readdirSync(dir, { recursive: true, encoding: 'utf8' }).map((f) => join(dir, f).replaceAll('\\', '/')))
      .filter((f) => /\.tsx?$/.test(f) && /^\s*['"]use client['"]/.test(read(f)))
    expect(client.sort()).toEqual([
      'components/contact/ContactForm.tsx',
      'components/sections/TestimonialCarousel.tsx',
      'components/site/MobileNav.tsx',
      'components/site/MotionGate.tsx',
      'components/site/ThemeToggle.tsx',
    ])
  })

  test('“Contact endpoint with origin checks, rate limiting, a honeypot and HTML escaping”', () => {
    const handler = titles('tests/unit/contact/handler.test.ts').join('\n')
    expect(handler).toMatch(/403 without an Origin/)
    expect(handler).toMatch(/429 with Retry-After/)
    expect(handler).toMatch(/honeypot/)
    expect(titles('tests/unit/contact/email.test.ts').join('\n')).toMatch(/escapes HTML in every field/)
  })

  test('“ATS resume PDF and social image generated from the same typed content as the pages”', () => {
    const build = read('scripts/assets/build.ts')
    expect(build).toContain("from '../../content/resume'")
    expect(build).toContain("from '../../content/profile'")
    expect(existsSync(`public${RESUME_PATH}`)).toBe(true)
    expect(existsSync('public/og.png')).toBe(true)
  })

  test('“Playwright end-to-end suite on Chromium, Firefox and WebKit, with automated axe checks (WCAG 2.2 AA rules) in light and dark”', () => {
    const config = read('playwright.config.ts')
    for (const device of ["devices['Desktop Chrome']", "devices['Desktop Firefox']", "devices['iPhone 14']"])
      expect(config).toContain(device)
    const a11y = read('tests/e2e/a11y.spec.ts')
    expect(a11y).toContain('AxeBuilder')
    expect(a11y).toContain("'wcag22aa'")
    expect(a11y).toContain("['light', 'dark']")
  })

  test('“Lighthouse and resource budgets: performance, accessibility, script size, idle CPU, and no motion running off-screen”, as measured', () => {
    const assertions = JSON.parse(read('lighthouserc.json')).ci.assert.assertions as Record<string, unknown>
    expect(Object.keys(assertions)).toEqual(expect.arrayContaining(['categories:performance', 'categories:accessibility']))
    const after = JSON.parse(read(AFTER)) as {
      lighthouse: Record<string, { performance: number; accessibility: number }>
      measure: { appScriptGzipBytes: number; idleTaskMs: number; infiniteAnimations: number }
    }
    const runs = Object.values(after.lighthouse)
    expect(runs.length).toBeGreaterThanOrEqual(2)
    for (const run of runs) {
      expect(run.performance).toBeGreaterThanOrEqual(0.95)
      expect(run.accessibility).toBe(1)
    }
    expect(after.measure.appScriptGzipBytes).toBeLessThanOrEqual(BUDGETS.appScriptGzipBytes)
    expect(after.measure.idleTaskMs).toBeLessThanOrEqual(BUDGETS.idleTaskMs)
    expect(after.measure.infiniteAnimations).toBe(0)
  })

  test('“Copy, confidentiality and resume checks on every commit”', () => {
    expect(read('.githooks/pre-commit')).toContain('pnpm verify')
    expect(pkg.scripts.prepare).toContain('core.hooksPath .githooks')
    expect(pkg.scripts.verify).toContain('pnpm test')
    for (const file of ['tests/unit/copy-style.test.ts', 'tests/unit/confidentiality.test.ts', 'tests/resume/resume.test.ts'])
      expect(existsSync(file), file).toBe(true)
    const ci = read('.github/workflows/ci.yml')
    expect(ci).toMatch(/pull_request/)
    expect(ci).toContain('pnpm verify')
  })

  test('the stack list matches package.json', () => {
    expect(project.stack).toEqual(['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Playwright', 'Vitest', 'Lighthouse CI'])
    const all = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(all.next).toMatch(/^16\./)
    expect(all.react).toMatch(/^19\./)
    expect(all.typescript).toBeTruthy()
    expect(all.tailwindcss).toMatch(/^4\./)
    expect(all['@playwright/test']).toBeTruthy()
    expect(all.vitest).toBeTruthy()
    expect(all['@lhci/cli']).toBeTruthy()
  })
})
