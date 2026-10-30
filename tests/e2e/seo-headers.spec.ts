import { expect, test } from '@playwright/test'
import { RESUME_PATH, SITE_URL } from '../../lib/site'

const ROUTES = ['/', '/work/gym-daddy', '/work/printsaathi']

test('security headers on every route, and no x-powered-by', async ({ request }) => {
  for (const path of [...ROUTES, '/sitemap.xml']) {
    const res = await request.get(path)
    const h = res.headers()
    expect(h['content-security-policy'], path).toContain("default-src 'self'")
    expect(h['content-security-policy'], path).toContain("frame-ancestors 'none'")
    expect(h['x-content-type-options'], path).toBe('nosniff')
    expect(h['x-frame-options'], path).toBe('DENY')
    expect(h['referrer-policy'], path).toBe('strict-origin-when-cross-origin')
    expect(h['permissions-policy'], path).toContain('camera=()')
    expect(h['cross-origin-opener-policy'], path).toBe('same-origin')
    expect(h['x-powered-by'], path).toBeUndefined()
  }
})

test('canonical URLs and titles use the live domain', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Shriraj Naik — QA Automation Engineer & AI Product Engineer')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', SITE_URL)
  for (const path of ROUTES) {
    await page.goto(path)
    expect(await page.content(), path).not.toContain('shrirajnaik.dev')
  }
})

test('social image is absolute and served', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${SITE_URL}/og.png`)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  const og = await request.get('/og.png')
  expect(og.status()).toBe(200)
  expect(og.headers()['content-type']).toBe('image/png')
})

test('the site icon is served', async ({ page, request }) => {
  await page.goto('/')
  const href = await page.locator('link[rel="icon"]').first().getAttribute('href')
  expect(href).toBeTruthy()
  expect((await request.get(href!)).status()).toBe(200)
})

test('legacy resume URL redirects permanently to the current PDF', async ({ request }) => {
  const res = await request.get('/SHRIRAJ%20NAIK%20-%20QA%20Analyst%20III.pdf', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
  expect(res.headers().location).toBe(RESUME_PATH)
})

test('/resume redirects temporarily to the current PDF', async ({ request }) => {
  const res = await request.get('/resume', { maxRedirects: 0 })
  expect(res.status()).toBe(307)
  expect(res.headers().location).toBe(RESUME_PATH)
})

test('robots.txt and sitemap.xml serve', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
  expect(robots).toMatch(/User-Agent: GPTBot\n(User-Agent: [^\n]+\n)*Disallow: \/\n/)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap.match(/<loc>/g)).toHaveLength(3)
})

test('JSON-LD parses on every route and never includes a telephone', async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path)
    for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(raw), path).not.toThrow()
      expect(raw, path).not.toMatch(/telephone|9764904641/)
    }
  }
})

test('theme colour follows the colour scheme', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]')).toHaveAttribute(
    'content',
    '#f1efe9',
  )
  await expect(page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]')).toHaveAttribute(
    'content',
    '#101827',
  )
})
