import type { Locator, Page } from '@playwright/test'

/** The theme switch: in the header from 1024 px, in the menu panel below (the menu is opened). */
export async function themeSwitch(page: Page): Promise<Locator> {
  const header = page.locator('header').getByRole('button', { name: 'Dark theme' })
  if (await header.isVisible()) return header
  const menu = page.locator('details[data-mobile-nav]')
  if ((await menu.getAttribute('open')) === null) await menu.locator('summary').click()
  return page.getByRole('navigation', { name: 'Menu' }).getByRole('button', { name: 'Dark theme' })
}
