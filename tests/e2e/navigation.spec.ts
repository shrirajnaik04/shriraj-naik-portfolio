import { expect, test, type Page } from '@playwright/test'
import { NAV } from '../../lib/site'

/**
 * Section links land on their section, as a visitor sees it: a fresh load, motion allowed (smooth
 * scrolling on), nothing pre-rendered. A section's top must end up just below the sticky header
 * (the 5.5rem scroll padding), not somewhere above or below it.
 */
test.use({ reducedMotion: 'no-preference' })

/** The target's top once scrolling has stopped. */
async function settledTop(page: Page, id: string): Promise<number> {
  let last = Number.NaN
  for (let i = 0; i < 40; i += 1) {
    await page.waitForTimeout(150)
    const y = await page.evaluate(() => window.scrollY)
    if (y === last) break
    last = y
  }
  return page.evaluate((target) => Math.round(document.getElementById(target)!.getBoundingClientRect().top), id)
}

const LANDING = { min: 60, max: 120 }

for (const { label, hash } of NAV) {
  test(`the ${label} link lands on its section`, async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) await page.locator('[data-mobile-nav] summary').click()
    const nav = isMobile ? page.locator('[data-mobile-nav] nav') : page.locator('header nav').first()
    await nav.getByRole('link', { name: label, exact: true }).click()
    const top = await settledTop(page, hash)
    expect(top, `#${hash} top after the click`).toBeGreaterThanOrEqual(LANDING.min)
    expect(top, `#${hash} top after the click`).toBeLessThanOrEqual(LANDING.max)
  })

  test(`opening /#${hash} directly lands on its section`, async ({ page }) => {
    await page.goto(`/#${hash}`)
    const top = await settledTop(page, hash)
    expect(top, `#${hash} top after loading`).toBeGreaterThanOrEqual(LANDING.min)
    expect(top, `#${hash} top after loading`).toBeLessThanOrEqual(LANDING.max)
  })
}
