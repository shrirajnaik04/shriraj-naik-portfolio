import { expect, test } from '@playwright/test'
import { RESUME_PATH, SITE_URL } from '../../lib/site'
import { themeSwitch } from './theme'

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

test('each case study shares its own title and URL, with the social image', async ({ page }) => {
  for (const path of ROUTES.slice(1)) {
    await page.goto(path)
    const title = await page.title()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${path}`)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE_URL}${path}`)
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${SITE_URL}/og.png`)
  }
})

test('the site and Apple touch icons are served', async ({ page, request }) => {
  await page.goto('/')
  for (const rel of ['icon', 'apple-touch-icon']) {
    const href = await page.locator(`link[rel="${rel}"]`).first().getAttribute('href')
    expect(href, rel).toBeTruthy()
    expect((await request.get(href!)).status(), rel).toBe(200)
  }
})

test('every manifest icon is served with its declared type', async ({ request }) => {
  const manifest = (await (await request.get('/site.webmanifest')).json()) as { icons: { src: string; type: string }[] }
  expect(manifest.icons.length).toBeGreaterThan(0)
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src)
    expect(res.status(), icon.src).toBe(200)
    expect(res.headers()['content-type'], icon.src).toContain(icon.type)
  }
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

test('theme colour is the light paper, and follows a chosen dark theme', async ({ page }) => {
  const colours = () => page.locator('meta[name="theme-color"]').evaluateAll((all) => [...new Set(all.map((m) => m.getAttribute('content')))])
  await page.goto('/')
  expect(await colours()).toEqual(['#f1efe9'])
  await (await themeSwitch(page)).click()
  expect(await colours()).toEqual(['#101827'])
  await page.reload()
  await expect.poll(colours).toEqual(['#101827'])
})
