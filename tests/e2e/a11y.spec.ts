import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'
import { renderAll } from './helpers'

const ROUTES = ['/', '/work/gym-daddy', '/work/printsaathi', '/missing']
/** WCAG 2.0, 2.1 and 2.2, levels A and AA. */
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/** Everything a reader could reveal: deferred sections rendered and every disclosure open. */
async function revealAll(page: Page) {
  await renderAll(page)
  await page.locator('details').evaluateAll((all) => all.forEach((d) => ((d as HTMLDetailsElement).open = true)))
}

for (const path of ROUTES) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`axe finds no WCAG 2.2 AA violations on ${path} in ${colorScheme}`, async ({ page }) => {
      // Reduced motion: contrast is measured on the settled page, not mid-animation.
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      await page.goto(path)
      await revealAll(page)
      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}

/** Running animations and transitions. Styles are flushed first, so a transition that a hover just triggered exists. */
const running = (page: Page) =>
  page.evaluate(() => {
    void getComputedStyle(document.documentElement).color
    return document
      .getAnimations()
      .filter((a) => a.playState === 'running')
      .map((a) => `${a.constructor.name} ${(a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty}`)
  })

test('with reduced motion nothing animates: not on load, hover, disclosure or scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await renderAll(page)
  await page.locator('#home .btn-secondary').hover()
  await page.locator('#projects details summary').first().click()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  expect(await running(page)).toEqual([])
})

test('without reduced motion the hero report animates once, hover feedback transitions, nothing loops (control)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const iterations = await page.evaluate(() => document.getAnimations().map((a) => a.effect?.getTiming().iterations ?? 1))
  expect(iterations.length).toBeGreaterThan(0)
  expect(iterations.filter((n) => n === Infinity)).toEqual([])
  // Each attempt moves away and hovers again, starting a fresh 150 ms transition to observe.
  const button = page.locator('#home .btn-secondary')
  await expect
    .poll(async () => {
      await page.mouse.move(0, 0)
      await button.hover()
      return (await running(page)).filter((a) => a.startsWith('CSSTransition')).length
    })
    .toBeGreaterThan(0)
})
