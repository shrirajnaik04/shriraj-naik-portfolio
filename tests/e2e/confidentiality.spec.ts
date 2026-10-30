import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { RESUME_PATH } from '../../lib/site'
import { findConfidentialTerms, loadConfidentialTerms } from '../helpers/confidential-terms'
import { renderAll } from './helpers'

/**
 * Everything the site publishes, checked for confidential and banned terms (local file or the
 * CONFIDENTIAL_TERMS secret), the phone number and per-project status labels. Content-level, so it
 * runs once, in desktop Chromium.
 */
const terms = loadConfidentialTerms()
const ROUTES = ['/', '/work/gym-daddy', '/work/printsaathi', '/missing']
const FILES = ['/sitemap.xml', '/robots.txt', '/site.webmanifest']
const STATUS_WORDS = ['live', 'in development', 'prototype', 'client work']
const PHONE_DIGITS = '9764904641'

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'content-level: checked once')
})

test('CI provides the terms', () => {
  if (process.env.CI) expect(terms?.length ?? 0).toBeGreaterThan(0)
})

test.describe('no confidential or banned term', () => {
  test.skip(!terms, 'no .confidential-terms file and no CONFIDENTIAL_TERMS env var')

  test('in any served page or file', async ({ request }) => {
    for (const path of [...ROUTES, ...FILES]) {
      const body = await (await request.get(path)).text()
      expect(findConfidentialTerms(body, terms!), path).toEqual([])
    }
  })

  test('in the rendered text or the JSON-LD of any page', async ({ page }) => {
    for (const path of ROUTES) {
      await page.goto(path)
      await renderAll(page)
      const text = await page.locator('body').innerText()
      const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n')
      expect(findConfidentialTerms(`${text}\n${jsonLd}`, terms!), path).toEqual([])
    }
  })

  test('in the README or the resume PDF text', async () => {
    expect(findConfidentialTerms(readFileSync('README.md', 'utf8'), terms!), 'README.md').toEqual([])
    // pdf.js is an ES module; Playwright compiles specs to CommonJS, so it is loaded dynamically.
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const task = getDocument({ data: new Uint8Array(readFileSync(`public${RESUME_PATH}`)), verbosity: 0 })
    const pdf = await task.promise
    let text = ''
    for (let n = 1; n <= pdf.numPages; n++) {
      const { items } = await (await pdf.getPage(n)).getTextContent({ disableNormalization: true })
      text += items.map((item) => ('str' in item ? `${item.str} ` : '')).join('')
    }
    await task.destroy()
    expect(text.length).toBeGreaterThan(1000)
    expect(findConfidentialTerms(text, terms!), 'resume').toEqual([])
  })
})

test('no page shows the phone number (it is on the resume only)', async ({ request }) => {
  // The digits as people write them: optionally separated by a space, dot or hyphen.
  const phone = new RegExp(PHONE_DIGITS.split('').join('[\\s.-]?'))
  for (const path of ROUTES) {
    expect(await (await request.get(path)).text(), path).not.toMatch(phone)
  }
})

test('no element on any page is a bare status label', async ({ page }) => {
  for (const path of ROUTES) {
    await page.goto(path)
    await renderAll(page)
    const labels = await page.evaluate((words) => {
      return [...document.querySelectorAll('body *')]
        .map((el) => (el as HTMLElement).innerText?.trim().toLowerCase())
        .filter((text) => text && words.includes(text))
    }, STATUS_WORDS)
    expect(labels, path).toEqual([])
  }
})
