/**
 * Generates the committed static assets from content: the resume PDF, the 1200×630 social image
 * and the Apple touch icon. Run it after changing the resume or profile content, then commit the
 * outputs; `pnpm test` fails while the committed PDF and the content disagree. Chromium stamps the
 * PDF with its creation date, so its bytes change on every run: commit it only when its content or
 * template changed.
 *
 * Usage: pnpm assets:build   (writes only inside this repository)
 */
import { chromium, type Browser, type Page } from '@playwright/test'
import { mkdirSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { profile } from '../../content/profile'
import { resume } from '../../content/resume'
import { escapeHtml } from '../../lib/contact/escape'
import { RESUME_PATH, SITE_URL } from '../../lib/site'
import { type Face, fontFaceCss, instrumentSans, newsreader } from './fonts'
import { APPLE_ICON_CSS, AppleIconBody, OG_CSS, OgBody } from './og-template'
import { RESUME_CSS, ResumeBody } from './resume-template'

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const MAX_RESUME_PAGES = 2

/** A standalone HTML document. Its fonts are inlined: rendering never touches the network or system fonts. */
interface Doc {
  title?: string
  css: string
  faces: Face[]
  body: ReactElement
}

function documentHtml({ title, css, faces, body }: Doc): string {
  const head = `<meta charset="utf-8">${title ? `<title>${escapeHtml(title)}</title>` : ''}<style>${fontFaceCss(faces)}\n${css}</style>`
  return `<!DOCTYPE html><html lang="en"><head>${head}</head><body>${renderToStaticMarkup(body)}</body></html>`
}

/** Absolute path for a repository-relative output; refuses anything outside the repository. */
function output(path: string): string {
  const abs = resolve(ROOT, path)
  const rel = relative(ROOT, abs)
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error(`refusing to write outside the repository: ${abs}`)
  mkdirSync(dirname(abs), { recursive: true })
  return abs
}

/** Loads the document and waits until every declared face is loaded (never a silent fallback). */
async function open(page: Page, doc: Doc): Promise<void> {
  await page.setContent(documentHtml(doc), { waitUntil: 'load' })
  const failed = await page.evaluate(async (specs) => {
    await Promise.all(specs.map((spec) => document.fonts.load(spec)))
    await document.fonts.ready
    return [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => `${f.family} ${f.weight}: ${f.status}`)
  }, doc.faces.map((f) => `${f.weight} 16px "${f.family}"`))
  if (failed.length) throw new Error(`fonts did not load: ${failed.join(', ')}`)
}

async function buildResume(browser: Browser): Promise<void> {
  const page = await browser.newPage()
  await page.emulateMedia({ media: 'print' })
  await open(page, {
    title: resume.documentTitle,
    css: RESUME_CSS,
    faces: [instrumentSans(400), instrumentSans(600)],
    body: createElement(ResumeBody, { resume }),
  })
  const path = output(join('public', RESUME_PATH))
  await page.pdf({ path, format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
  await page.close()

  // Where each page's text ends, to see how a content change moved the page break.
  const task = getDocument({ url: path, verbosity: 0 })
  const pdf = await task.promise
  const fill: string[] = []
  for (let n = 1; n <= pdf.numPages; n++) {
    const pdfPage = await pdf.getPage(n)
    const { items } = await pdfPage.getTextContent()
    const lowest = Math.min(...items.map((item) => ('str' in item && item.str.trim() ? item.transform[5] : Infinity)))
    fill.push(`page ${n} text ends at ${(((pdfPage.view[3] - lowest) * 25.4) / 72).toFixed(0)} mm`)
  }
  const pages = pdf.numPages
  await task.destroy()
  console.log(`resume: ${relative(ROOT, path)} — ${fill.join(', ')} (of 297), ${(statSync(path).size / 1024).toFixed(1)} KB`)
  if (pages > MAX_RESUME_PAGES) throw new Error(`the resume runs to ${pages} pages (max ${MAX_RESUME_PAGES})`)
}

async function screenshot(browser: Browser, doc: Doc, [width, height]: [number, number], to: string): Promise<void> {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await open(page, doc)
  const path = output(to)
  await page.screenshot({ path, type: 'png' })
  await page.close()
  console.log(`image: ${relative(ROOT, path)} — ${width}×${height}, ${(statSync(path).size / 1024).toFixed(1)} KB`)
}

async function main() {
  const browser = await chromium.launch()
  try {
    await buildResume(browser)
    const site = SITE_URL.replace(/^https:\/\/(www\.)?/, '')
    await screenshot(
      browser,
      {
        css: OG_CSS,
        faces: [newsreader, instrumentSans(400), instrumentSans(500), instrumentSans(600)],
        body: createElement(OgBody, { profile, site }),
      },
      [1200, 630],
      'public/og.png',
    )
    await screenshot(
      browser,
      { css: APPLE_ICON_CSS, faces: [newsreader], body: createElement(AppleIconBody) },
      [180, 180],
      'app/apple-icon.png',
    )
  } finally {
    await browser.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
