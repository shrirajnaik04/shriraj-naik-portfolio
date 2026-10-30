import { expect, test } from '@playwright/test'
import { NAV, REPO_URL, RESUME_PATH } from '../../lib/site'
import { themeSwitch } from './theme'

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
  await expect(footer).toContainText('Vibe engineered with AI agents. Human-reviewed, test-gated.')
  expect(await footer.innerText()).not.toContain('·')
})

for (const width of [390, 768, 1280]) {
  test(`one resume button on the page at ${width}px, in the header`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const visible = await page
      .locator('a[download]')
      .evaluateAll((links) => links.filter((a) => (a as HTMLElement).checkVisibility()).map((a) => a.closest('header') !== null))
    expect(visible).toEqual([true])
  })
}

test('exactly one main landmark', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('main')).toHaveCount(1)
})

test('light by default even when the system prefers dark; dark is a remembered choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme ?? 'light')
  const background = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--paper').trim())
  expect(await theme()).toBe('light')
  const light = await background()
  let toggle = await themeSwitch(page)
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  expect(await theme()).toBe('dark')
  expect(await background()).not.toBe(light)
  // Remembered across loads, and already applied when the document has been parsed (no flash).
  await page.addInitScript(() =>
    document.addEventListener('DOMContentLoaded', () => {
      ;(window as unknown as { themeAtParse?: string }).themeAtParse = document.documentElement.dataset.theme
    }),
  )
  await page.reload()
  expect(await page.evaluate(() => (window as unknown as { themeAtParse?: string }).themeAtParse)).toBe('dark')
  toggle = await themeSwitch(page)
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.click()
  expect(await theme()).toBe('light')
})

for (const width of [320, 390, 768, 1024, 1280, 1920]) {
  test(`at ${width}px the name in the header returns to the very top, from anywhere`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    const name = page.getByRole('link', { name: 'Shriraj Naik, home' })
    await page.goto('/')
    for (const at of [0.5, 1]) {
      await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), at)
      await name.click()
      await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0)
    }
    await page.goto('/work/gym-daddy')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await name.click()
    await expect(page).toHaveURL(/\/#top$/)
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0)
  })
}

test('the phone menu closes on any navigation: its links, the header name, a tap outside', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.locator('details[data-mobile-nav]')
  const open = async () => {
    await menu.locator('summary').click()
    await expect(menu).toHaveAttribute('open', '')
  }
  await open()
  await page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: 'Skills' }).click()
  await expect(menu).not.toHaveAttribute('open', '')
  await open()
  await page.getByRole('link', { name: 'Shriraj Naik, home' }).click()
  await expect(menu).not.toHaveAttribute('open', '')
  await open()
  await page.mouse.click(200, 800)
  await expect(menu).not.toHaveAttribute('open', '')
})
