import { expect, test } from '@playwright/test'
import {
  approachClosing,
  award,
  earlierJobs,
  getFeaturedProjects,
  getMoreProjects,
  getPublishedProjects,
  jobs,
  principles,
  profile,
  skillGroups,
  testimonials,
} from '../../content'
import { RESUME_PATH } from '../../lib/site'

const STATUS_WORDS = ['live', 'in development', 'prototype', 'client work']

test.describe('hero', () => {
  test('one h1 and the agreed hero copy', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText(profile.name)
    const hero = page.locator('#home')
    await expect(hero).toContainText(profile.hero.subtitle)
    await expect(hero).toContainText(profile.hero.statement)
    await expect(hero).toContainText(profile.hero.body)
  })

  test('the test report lists the five facts as label/value pairs', async ({ page }) => {
    await page.goto('/')
    const dl = page.locator('#home dl')
    expect(await dl.locator('dt').allTextContents()).toEqual(profile.facts.map((f) => f.label))
    expect(await dl.locator('dd').allTextContents()).toEqual(profile.facts.map((f) => f.value))
    await expect(page.locator('#home')).toContainText(`${profile.facts.length} checks passed`)
  })

  test('calls to action', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'See selected work' })).toHaveAttribute('href', '#projects')
    const resume = page.locator('#home').getByRole('link', { name: /Download resume/ })
    await expect(resume).toHaveAttribute('href', RESUME_PATH)
    await expect(resume).toHaveAttribute('download', '')
  })

  test('portrait is served by Cloudinary, not the Next image optimizer', async ({ page }) => {
    await page.goto('/')
    const img = page.locator('#home img')
    await expect(img).toHaveAttribute('alt', profile.portrait.alt)
    await expect(img).toHaveAttribute('src', /^https:\/\/res\.cloudinary\.com\/dfvyqtli8\/image\/upload\/f_auto,/)
  })

  test('the hero name fits at 320px with 200% text', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/')
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('no animation on the page loops forever', async ({ page }) => {
    await page.goto('/')
    const infinite = await page.evaluate(
      () => document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity).length,
    )
    expect(infinite).toBe(0)
  })
})

test.describe('selected work', () => {
  test('featured spreads: the four featured projects, in order', async ({ page }) => {
    await page.goto('/')
    const names = await page.locator('#projects article h3').allTextContents()
    expect(names).toEqual(getFeaturedProjects().map((p) => p.name))
  })

  test('each spread shows evidence and a captioned schematic', async ({ page }) => {
    await page.goto('/')
    for (const article of await page.locator('#projects article').all()) {
      await expect(article.getByRole('heading', { name: 'How I know it works' })).toBeVisible()
      await expect(article.locator('[data-evidence] li').first()).toBeVisible()
      const svg = article.locator('figure svg[role="img"]')
      await expect(svg).toHaveCount(1)
      expect((await svg.locator('title').textContent())?.trim().length).toBeGreaterThan(0)
      expect((await article.locator('figcaption').textContent())?.trim().length).toBeGreaterThan(0)
    }
  })

  test('the More work index lists the rest, and every published project appears exactly once', async ({ page }) => {
    await page.goto('/')
    const more = await page.locator('#projects details > summary [data-project-name]').allTextContents()
    expect(more).toEqual(getMoreProjects().map((p) => p.name))
    const featured = await page.locator('#projects article h3').allTextContents()
    expect([...featured, ...more].sort()).toEqual(getPublishedProjects().map((p) => p.name).sort())
  })

  test('an index row expands to show what was built', async ({ page }) => {
    await page.goto('/')
    const first = page.locator('#projects details').first()
    await first.locator('summary').click()
    await expect(first).toHaveAttribute('open', '')
    await expect(first.getByRole('heading', { name: 'What I built' })).toBeVisible()
  })

  test('schematic labels render at 11 px or more on a 390 px phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const smallest = await page.evaluate(() => {
      let min = Number.POSITIVE_INFINITY
      for (const text of document.querySelectorAll<SVGTextElement>('#projects figure svg text')) {
        const scale = text.ownerSVGElement?.getScreenCTM()?.a ?? 1
        min = Math.min(min, parseFloat(getComputedStyle(text).fontSize) * scale)
      }
      return Math.round(min * 10) / 10
    })
    expect(smallest).toBeGreaterThanOrEqual(11)
  })

  test('body text keeps a readable measure: at most 80 characters a line at 1280 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    for (const path of ['/', '/work/gym-daddy']) {
      await page.goto(path)
      const widest = await page.evaluate(() => {
        let max = 0
        for (const el of document.querySelectorAll<HTMLElement>('main .t-body, main article li')) {
          const text = el.textContent?.trim() ?? ''
          const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
          const lines = Math.max(1, Math.round(el.getBoundingClientRect().height / lineHeight))
          if (lines > 1) max = Math.max(max, Math.round(text.length / lines))
        }
        return max
      })
      expect(widest, path).toBeLessThanOrEqual(80)
    }
  })

  test('the RAG chatbot states its verification gap plainly, without a check mark', async ({ page }) => {
    await page.goto('/')
    const row = page.locator('details', { has: page.locator('[data-project-name]', { hasText: 'RAG chatbot builder' }) })
    await expect(row.locator('[data-gap]')).toContainText('No automated tests yet')
    expect(await row.locator('[data-gap]').textContent()).not.toContain('✓')
  })

  test('a general note covers work still in development', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#projects')).toContainText('A few more products are in development and aren’t listed yet.')
  })

  test('no project carries a status label', async ({ page }) => {
    await page.goto('/')
    const labels = await page
      .locator('#projects *')
      .evaluateAll((els, words) => els.filter((e) => words.includes((e.textContent ?? '').trim().toLowerCase())).length, STATUS_WORDS)
    expect(labels).toBe(0)
    await expect(page.locator('[data-status]')).toHaveCount(0)
  })

  test('case-study links and the live site link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Read the Gym Daddy case study' })).toHaveAttribute('href', '/work/gym-daddy')
    await expect(page.getByRole('link', { name: 'Read the PrintSaathi case study' })).toHaveAttribute(
      'href',
      '/work/printsaathi',
    )
    const live = page.locator('#projects a[href="https://www.gymdaddy.in"]')
    await expect(live).toHaveAttribute('rel', /noopener/)
  })
})

test.describe('approach', () => {
  test('the four principles and the closing line', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('#approach h3').allTextContents()).toEqual(principles.map((p) => p.title))
    await expect(page.locator('#approach')).toContainText(approachClosing)
  })
})

test('no phone number anywhere in the page', async ({ page }) => {
  await page.goto('/')
  expect((await page.content()).replace(/\D/g, '')).not.toContain('9764904641')
})

test.describe('experience, about, skills, testimonials', () => {
  test('experience shows the three CodeMax roles in order, the award and the earlier roles', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#experience')
    expect(await section.locator('h4').allTextContents()).toEqual(jobs[0].roles.map((r) => r.title))
    await expect(section).toContainText(award.title)
    for (const job of earlierJobs) await expect(section).toContainText(job.title)
  })

  test('about defines "vibe engineer" once, as a definition', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#about dfn')).toHaveText('vibe engineer')
    const text = await page.locator('body').innerText()
    expect(text.match(/vibe engineer/gi)?.length).toBe(1)
  })

  test('skills are eight plain-text groups with no emoji', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('#tech h3').allTextContents()).toEqual(skillGroups.map((g) => g.name))
    const skillsText = await page.locator('#tech').innerText()
    expect(skillsText.length).toBeGreaterThan(100) // guards against a vacuous pass on unrendered text
    expect(skillsText).not.toMatch(/\p{Extended_Pictographic}/u)
  })

  test('testimonials are static and verbatim', async ({ page }) => {
    await page.goto('/')
    const quotes = page.locator('#testimonials blockquote')
    const before = await quotes.allTextContents()
    expect(before.map((q) => q.trim())).toEqual(testimonials.map((t) => t.quote))
    for (const t of testimonials) await expect(page.locator('#testimonials figcaption', { hasText: t.name })).toHaveCount(1)
    await expect(page.locator('#testimonials [role="tablist"]')).toHaveCount(0)
    await page.waitForTimeout(3000)
    expect(await quotes.allTextContents()).toEqual(before)
  })

  test('legacy anchors still resolve', async ({ page }) => {
    await page.goto('/')
    for (const id of ['home', 'projects', 'approach', 'experience', 'about', 'tech', 'testimonials', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
  })
})
