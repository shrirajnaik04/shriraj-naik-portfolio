import { expect, test } from '@playwright/test'
import { NAV, REPO_URL, RESUME_PATH } from '../../lib/site'

test('first Tab reaches the skip link, which moves focus to main', async ({ page, browserName }) => {
  await page.goto('/')
  if (browserName === 'webkit') {
    // Safari's default setting does not Tab to links (Option+Tab, which Windows WebKit does not map),
    // so on WebKit we check the link's behaviour rather than the platform's tab order.
    await page.getByRole('link', { name: 'Skip to content' }).focus()
  } else {
    await page.keyboard.press('Tab')
  }
  await expect(page.locator(':focus')).toHaveText('Skip to content')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main')
})

test('primary nav links point at section anchors and the resume', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const hrefs = await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link')
    .evaluateAll((els) => els.map((e) => e.getAttribute('href')))
  expect(hrefs).toEqual([...NAV.map((n) => `/#${n.hash}`), RESUME_PATH])
})

test('the header keeps its own view-transition name, so it never slides with the page', async ({ page }) => {
  await page.goto('/')
  const name = await page.locator('header').first().evaluate((el) => getComputedStyle(el).viewTransitionName)
  expect(name).toBe('site-header')
})

test('mobile menu opens, closes on Escape, and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.locator('details[data-mobile-nav]')
  const toggle = menu.locator('summary')
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden()
  await expect(menu).not.toHaveAttribute('open', '')
  await toggle.click()
  await expect(menu).toHaveAttribute('open', '')
  await expect(page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Work' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).not.toHaveAttribute('open', '')
  await expect(toggle).toBeFocused()
})

test('choosing a mobile menu link closes the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.locator('details[data-mobile-nav] summary').click()
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.locator('details[data-mobile-nav]')).not.toHaveAttribute('open', '')
  await expect(page).toHaveURL(/#contact$/)
})

test('unknown route is a noindex 404 with a way home', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  await expect(page.getByRole('main').getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/')
})

test('footer links the public source, without middle-dot separators', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute('href', REPO_URL)
  await expect(footer).toContainText('AI-assisted, human-owned, test-gated')
  expect(await footer.innerText()).not.toContain('·')
})

test('exactly one main landmark', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('main')).toHaveCount(1)
})
