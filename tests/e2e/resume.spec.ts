import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { LEGACY_RESUME_PATH, RESUME_PATH } from '../../lib/site'

const PDF = readFileSync(`public${RESUME_PATH}`)

test('the hero button downloads the current resume', async ({ page }) => {
  await page.goto('/')
  const downloading = page.waitForEvent('download')
  await page.locator('#home').getByRole('link', { name: 'Download resume (PDF)' }).click()
  const download = await downloading
  expect(download.suggestedFilename()).toBe('Shriraj-Naik-QA-Automation-Engineer-Resume.pdf')
  expect(readFileSync((await download.path())!).equals(PDF)).toBe(true)
})

test('every resume link on the page points at the current PDF', async ({ page }) => {
  await page.goto('/')
  const hrefs = await page.locator('a[download]').evaluateAll((links) => links.map((a) => a.getAttribute('href')))
  expect(hrefs.length).toBeGreaterThan(0)
  expect(new Set(hrefs)).toEqual(new Set([RESUME_PATH]))
})

test('the PDF is served as a PDF', async ({ request }) => {
  const res = await request.get(RESUME_PATH)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toBe('application/pdf')
  expect((await res.body()).equals(PDF)).toBe(true)
})

for (const alias of ['/resume', encodeURI(LEGACY_RESUME_PATH)]) {
  test(`${alias} delivers the current resume`, async ({ request, baseURL }) => {
    const res = await request.get(alias)
    expect(res.url()).toBe(new URL(RESUME_PATH, baseURL).href)
    expect((await res.body()).equals(PDF)).toBe(true)
  })
}
