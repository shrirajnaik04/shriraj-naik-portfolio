import type { Page } from '@playwright/test'

/**
 * Below-the-fold sections use content-visibility: auto, so `innerText` of a section that has not
 * been scrolled near yet is empty. Render everything first, as a reader who scrolls would see it.
 */
export async function renderAll(page: Page) {
  await page.addStyleTag({ content: '* { content-visibility: visible !important; }' })
}
