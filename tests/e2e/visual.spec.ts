import { expect, test } from '@playwright/test'

/**
 * Screenshot baselines (project "visual", desktop Chromium). Baselines are platform-specific and
 * committed for win32 only; update them deliberately with `pnpm test:visual --update-snapshots`.
 * The portrait is served by Cloudinary, so it is masked; deferred sections are rendered in full.
 */
const WIDTHS = [360, 768, 1280, 1920]
const OPTIONS = {
  fullPage: true,
  animations: 'disabled',
  stylePath: 'tests/e2e/visual.css',
  maxDiffPixelRatio: 0.001,
} as const

for (const colorScheme of ['light', 'dark'] as const) {
  for (const width of WIDTHS) {
    test(`home at ${width}px in ${colorScheme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
      if (colorScheme === 'dark') await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
      await page.goto('/')
      await expect(page).toHaveScreenshot(`home-${width}-${colorScheme}.png`, {
        ...OPTIONS,
        mask: [page.locator('#home img')],
      })
    })
  }

  test(`Gym Daddy case study at 1280px in ${colorScheme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
    if (colorScheme === 'dark') await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
    await page.goto('/work/gym-daddy')
    await expect(page).toHaveScreenshot(`gym-daddy-1280-${colorScheme}.png`, OPTIONS)
  })
}
