import { spawnSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { getDocument, type PDFDocumentProxy, type PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { beforeAll, describe, expect, test } from 'vitest'
import { getProject, jobs, profile } from '@/content'
import { resume, resumeTextLines } from '@/content/resume'
import { RESUME_PATH } from '@/lib/site'
import { findConfidentialTerms, loadConfidentialTerms } from '../helpers/confidential-terms'

const PDF_FILE = `public${RESUME_PATH}`
const HEADINGS = [
  'PROFESSIONAL SUMMARY',
  'TECHNICAL SKILLS',
  'PROFESSIONAL EXPERIENCE',
  'PROJECTS',
  'ACHIEVEMENTS',
  'CERTIFICATIONS',
  'EDUCATION',
  'ADDITIONAL EXPERIENCE',
  'VOLUNTEER EXPERIENCE',
  'LANGUAGES',
]
const terms = loadConfidentialTerms()

/** What a parser keeps of a line: list bullets dropped, whitespace collapsed. */
const flat = (s: string) => s.replace(/•/g, ' ').replace(/\s+/g, ' ').trim()

/** Every line of the resume, found in `text` in reading order. Returns the lines that are missing or out of order. */
function unreadLines(text: string): string[] {
  const haystack = flat(text)
  let from = 0
  const missing: string[] = []
  for (const line of resumeTextLines()) {
    const at = haystack.indexOf(flat(line), from)
    if (at === -1) missing.push(line)
    else from = at + flat(line).length
  }
  return missing
}

describe('resume content', () => {
  test('sections use the standard headings, in the agreed order', () => {
    expect(resume.sections.map((s) => s.heading)).toEqual(HEADINGS)
  })

  test('experience is the website’s experience, word for word', () => {
    const section = resume.sections.find((s) => s.kind === 'experience')
    expect(section?.kind === 'experience' && section.employers.map((e) => e.roles.map((r) => r.bullets))).toEqual(
      jobs.map((j) => j.roles.map((r) => r.bullets)),
    )
  })

  test('contact details come from the profile', () => {
    const contact = JSON.stringify(resume.contact)
    for (const value of [profile.phone, profile.email, profile.links.site, profile.links.linkedin, profile.links.github])
      expect(contact).toContain(value)
    expect(JSON.stringify(resume.sections)).toContain(getProject('gym-daddy')!.links[0].href)
  })

  test('claims that could not be verified stay off the resume', () => {
    const text = resumeTextLines().join('\n')
    expect(text).not.toMatch(/production-ready|Context Engineering Framework|identifies UI elements visually/i)
  })

  test.skipIf(!terms)('no confidential or banned terms', () => {
    expect(findConfidentialTerms([resume.documentTitle, ...resumeTextLines()].join('\n'), terms ?? [])).toEqual([])
  })
})

describe('the committed resume PDF', () => {
  let pdf: PDFDocumentProxy
  let pages: PDFPageProxy[]
  /** Page text as pdf.js extracts it, without Unicode normalization, so ligatures would show. */
  let rawText: string

  beforeAll(async () => {
    pdf = await getDocument({
      data: new Uint8Array(readFileSync(PDF_FILE)),
      fontExtraProperties: true,
      verbosity: 0,
    }).promise
    pages = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)))
    const texts = await Promise.all(
      pages.map(async (page) => {
        const { items } = await page.getTextContent({ disableNormalization: true })
        return items.map((item) => ('str' in item ? item.str + (item.hasEOL ? '\n' : '') : '')).join('')
      }),
    )
    rawText = texts.join('\n')
  })

  test('is at most 200 KB and one or two A4 pages', () => {
    expect(statSync(PDF_FILE).size).toBeLessThanOrEqual(200 * 1024)
    expect(pdf.numPages).toBeGreaterThanOrEqual(1)
    expect(pdf.numPages).toBeLessThanOrEqual(2)
    for (const page of pages) {
      const [, , width, height] = page.view
      expect(Math.round((width * 25.4) / 72)).toBe(210)
      expect(Math.round((height * 25.4) / 72)).toBe(297)
    }
  })

  test('carries the document title and language', async () => {
    const { info } = (await pdf.getMetadata()) as { info: Record<string, unknown> }
    expect(info.Title).toBe(resume.documentTitle)
    expect(info.Language).toBe('en')
  })

  test('is tagged: one H1, the section headings as H2 in order, lists and links', async () => {
    // Typed as an object, returned as a Map by pdf.js 6: read either.
    const markInfo = (await pdf.getMarkInfo()) as unknown as Map<string, boolean> | { Marked?: boolean } | null
    expect(markInfo instanceof Map ? markInfo.get('Marked') : markInfo?.Marked).toBe(true)
    const roles: string[] = []
    const h2: string[] = []
    for (const page of pages) {
      const tagged = await markedContentText(page)
      const visit = (node: StructNode) => {
        if (node.role) roles.push(node.role)
        if (node.role === 'H2') h2.push(flat(contentText(node, tagged)))
        node.children?.forEach(visit)
      }
      const tree = (await page.getStructTree()) as StructNode | null
      if (tree) visit(tree)
    }
    expect(roles.filter((r) => r === 'H1')).toHaveLength(1)
    expect(h2).toEqual(HEADINGS)
    expect(roles).toContain('L')
    expect(roles).toContain('LI')
    expect(roles).toContain('Link')
  })

  test('has an outline that lists the section headings in order', async () => {
    const titles: string[] = []
    const visit = (items: { title: string; items: unknown[] }[] | null) =>
      items?.forEach((item) => {
        titles.push(item.title)
        visit(item.items as { title: string; items: unknown[] }[])
      })
    visit(await pdf.getOutline())
    expect(titles.filter((t) => HEADINGS.includes(t))).toEqual(HEADINGS)
  })

  test('pdf.js reads every line of the resume, in order', () => {
    expect(unreadLines(rawText)).toEqual([])
  })

  test('the text is plain: no ligatures, private-use or pictographic characters', () => {
    expect(rawText.match(/[ﬀ-ﬆ]/g)).toBeNull()
    expect(rawText.match(/[-]|\p{Extended_Pictographic}/gu)).toBeNull()
  })

  test('every font is embedded Instrument Sans, and none is Type 3', async () => {
    const fonts = new Map<string, { name: string; isType3Font: boolean; missingFile: boolean }>()
    for (const page of pages) {
      await page.getOperatorList()
      for (const [id, data] of page.commonObjs as unknown as Iterable<[string, Record<string, unknown>]>) {
        if (data && typeof data === 'object' && 'isType3Font' in data)
          fonts.set(id, data as { name: string; isType3Font: boolean; missingFile: boolean })
      }
    }
    expect(fonts.size).toBeGreaterThan(0)
    for (const font of fonts.values()) {
      expect(font.name, font.name).toMatch(/^[A-Z]{6}\+InstrumentSans-/)
      expect(font.isType3Font, font.name).toBe(false)
      expect(font.missingFile, font.name).toBe(false)
    }
  })

  test('links the email, site, LinkedIn, GitHub and Gym Daddy, and nothing else', async () => {
    const urls = new Set<string>()
    for (const page of pages)
      for (const a of await page.getAnnotations()) if (a.subtype === 'Link' && a.url) urls.add(new URL(a.url).href)
    const expected = [
      `mailto:${profile.email}`,
      profile.links.site,
      profile.links.linkedin,
      profile.links.github,
      getProject('gym-daddy')!.links[0].href,
    ].map((u) => new URL(u).href)
    expect([...urls].sort()).toEqual(expected.sort())
  })

  test.skipIf(!terms)('contains no confidential or banned terms', () => {
    expect(findConfidentialTerms(rawText, terms ?? [])).toEqual([])
  })
})

/** A second parser, close to what applicant tracking systems use: xpdf/poppler pdftotext. */
const pdftotext = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' })
const hasPdftotext = !pdftotext.error

describe('pdftotext', () => {
  test('is available in CI', () => {
    if (process.env.CI) expect(hasPdftotext).toBe(true)
  })

  test.skipIf(!hasPdftotext)('reads every line of the resume, in order', () => {
    const out = spawnSync('pdftotext', ['-layout', '-enc', 'UTF-8', PDF_FILE, '-'], { encoding: 'utf8' })
    expect(out.status).toBe(0)
    expect(unreadLines(out.stdout)).toEqual([])
  })
})

interface StructNode {
  role?: string
  type?: string
  id?: string
  children?: StructNode[]
}

/** Text of each marked-content sequence on the page, keyed by its id. */
async function markedContentText(page: PDFPageProxy): Promise<Map<string, string>> {
  const { items } = await page.getTextContent({ includeMarkedContent: true, disableNormalization: true })
  const text = new Map<string, string>()
  const open: string[] = []
  for (const item of items) {
    if ('type' in item && item.type === 'beginMarkedContentProps' && item.id) open.push(item.id)
    else if ('type' in item && item.type === 'beginMarkedContent') open.push('')
    else if ('type' in item && item.type === 'endMarkedContent') open.pop()
    else if ('str' in item) for (const id of open) if (id) text.set(id, (text.get(id) ?? '') + item.str)
  }
  return text
}

function contentText(node: StructNode, tagged: Map<string, string>): string {
  if (node.type === 'content' && node.id) return tagged.get(node.id) ?? ''
  return (node.children ?? []).map((child) => contentText(child, tagged)).join(' ')
}
