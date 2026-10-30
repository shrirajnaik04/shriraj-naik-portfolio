import { expect, test } from '@playwright/test'
import {
  approachClosing,
  award,
  earlierJobs,
  getFeaturedProjects,
  getMoreProjects,
  getPublishedProjects,
  jobs,
  practices,
  principles,
  profile,
  skillGroups,
  skillsIntro,
  testimonials,
} from '../../content'
import { AUTOPLAY_MS } from '../../components/sections/TestimonialCarousel'

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

  test('calls to action: the work and a way to get in touch (the resume lives in the header)', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#home')
    await expect(hero.getByRole('link', { name: 'See selected work' })).toHaveAttribute('href', '#projects')
    await expect(hero.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact')
    await expect(hero.locator('a[download]')).toHaveCount(0)
  })

  test('portrait is served by Cloudinary, not the Next image optimizer', async ({ page }) => {
    await page.goto('/')
    const img = page.locator('#home img')
    await expect(img).toHaveAttribute('alt', profile.portrait.alt)
    await expect(img).toHaveAttribute('src', /^https:\/\/res\.cloudinary\.com\/dfvyqtli8\/image\/upload\/f_auto,/)
  })

  for (const width of [320, 360, 390, 412, 768]) {
    test(`at ${width}px the portrait is visible on load, and the test report comes after it`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 740 : 1024 })
      await page.goto('/')
      await expect(page.locator('#home img')).toBeInViewport({ ratio: 0.9 })
      const top = (selector: string) => page.locator(selector).evaluate((el) => el.getBoundingClientRect().top)
      expect(await top('#home .report')).toBeGreaterThan(await top('#home img'))
    })
  }

  test('the hero name fits at 320px with 200% text', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.goto('/')
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('nothing loops on the opening screen: endless motion runs only in drawings that are on screen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const endless = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations === Infinity && a.playState === 'running')
          .map((a) => {
            const plate = ((a.effect as KeyframeEffect).target as Element).closest('.figure-plate')
            const r = plate?.getBoundingClientRect()
            return Boolean(plate?.hasAttribute('data-inview') && r && r.bottom > 0 && r.top < innerHeight)
          }),
      )
    await page.waitForTimeout(300)
    expect(await endless()).toEqual([])
    await page.locator('#project-gym-daddy').scrollIntoViewIfNeeded()
    await expect.poll(async () => (await endless()).length).toBeGreaterThan(0)
    expect((await endless()).every(Boolean)).toBe(true)
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(async () => (await endless()).length).toBe(0)
  })
})

test.describe('selected work', () => {
  test('featured spreads: the six featured projects, in order', async ({ page }) => {
    await page.goto('/')
    const names = await page.locator('#projects article h3').allTextContents()
    expect(names).toEqual(getFeaturedProjects().map((p) => p.name))
    expect(names).toHaveLength(6)
  })

  test('each spread shows its evidence, or plainly what isn’t proven, and a captioned schematic', async ({ page }) => {
    await page.goto('/')
    const featured = getFeaturedProjects()
    const articles = await page.locator('#projects article').all()
    expect(articles).toHaveLength(featured.length)
    for (const [i, article] of articles.entries()) {
      const project = featured[i]
      await expect(article.getByRole('heading', { name: 'How I know it works' })).toBeVisible()
      expect(await article.locator('[data-evidence] li').allTextContents()).toEqual(project.verified)
      if (project.verificationGap) await expect(article.locator('[data-evidence] [data-gap]')).toHaveText(project.verificationGap)
      else await expect(article.locator('[data-gap]')).toHaveCount(0)
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

  test('every featured drawing carries its moving parts: marching guardrails and travelling beads', async ({ page }) => {
    await page.goto('/')
    for (const article of await page.locator('#projects article').all()) {
      const name = await article.locator('h3').textContent()
      expect(await article.locator('svg .sch-bead').count(), `${name} beads`).toBeGreaterThan(0)
      const guards = await article.locator('svg .sch-march').count()
      expect(guards, `${name} guardrails`).toBeGreaterThan(0)
    }
  })

  test('schematic labels render at 11 px or more on a 390 px phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const smallest = await page.evaluate(() => {
      let min = Number.POSITIVE_INFINITY
      for (const text of document.querySelectorAll<SVGTextElement>(':is(#projects, #agentic) figure svg text')) {
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

  test('the RAG chatbot builder states its verification gap plainly, without a check mark', async ({ page }) => {
    await page.goto('/')
    const spread = page.locator('#projects article', { has: page.getByRole('heading', { name: 'RAG chatbot builder' }) })
    await expect(spread.locator('[data-gap]')).toContainText('No automated tests yet')
    await expect(spread.locator('[data-evidence] li')).toHaveCount(0)
    expect(await spread.locator('[data-gap]').textContent()).not.toContain('✓')
  })

  test('drawings: lines draw and checks resolve with the scroll; beads and guardrails loop on screen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const drawingAnimations = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => ((a.effect as KeyframeEffect | null)?.target as Element | null)?.closest('#projects svg, #agentic svg'))
          .map((a) => ({
            name: (a as CSSAnimation).animationName,
            timeline: a.timeline?.constructor.name ?? 'none',
            iterations: a.effect?.getTiming().iterations,
            state: a.playState,
            properties: (a.effect as KeyframeEffect)
              .getKeyframes()
              .flatMap((k) => Object.keys(k).filter((p) => !['offset', 'computedOffset', 'easing', 'composite'].includes(p))),
          })),
      )
    await page.locator('#project-travel-messaging').scrollIntoViewIfNeeded()
    await expect.poll(async () => (await drawingAnimations()).some((a) => a.name === 'sch-bead' && a.state === 'running')).toBe(true)
    const all = await drawingAnimations()
    // Endless: beads and marching guardrails, on the document clock, animating transform only (GPU).
    const endless = all.filter((a) => a.iterations === Infinity)
    expect(new Set(endless.map((a) => a.name.replace(/-(right|left|up|down)$/, '')))).toEqual(new Set(['sch-bead', 'sch-march']))
    expect(new Set(endless.flatMap((a) => a.properties))).toEqual(new Set(['opacity', 'transform']))
    expect(endless.filter((a) => a.timeline !== 'DocumentTimeline')).toEqual([])
    // Everything else is finite; where scroll timelines exist, it follows the scroll.
    const finite = all.filter((a) => a.iterations !== Infinity)
    expect(finite.filter((a) => a.iterations !== 1)).toEqual([])
    if (await page.evaluate(() => CSS.supports('animation-timeline: view()'))) {
      expect(new Set(finite.map((a) => a.name))).toEqual(new Set(['sch-draw', 'sch-fade', 'sch-pop']))
      expect(finite.filter((a) => a.timeline !== 'ViewTimeline')).toEqual([])
    }
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

test.describe('how I build with AI agents', () => {
  test('the practices in order, each with its evidence, beside the captioned loop drawing', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#agentic')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('How I build with AI agents')
    expect(await section.locator('li h3').allTextContents()).toEqual(practices.map((p) => p.title))
    for (const p of practices) await expect(section).toContainText(p.evidence)
    await expect(section.locator('figure svg[role="img"]')).toHaveCount(1)
    expect((await section.locator('figcaption').textContent())?.trim().length).toBeGreaterThan(0)
  })
})

test.describe('approach', () => {
  test('the principles and the closing line, general and not about any one project', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('#approach h3').allTextContents()).toEqual(principles.map((p) => p.title))
    await expect(page.locator('#approach')).toContainText(approachClosing)
    const text = await page.locator('#approach').innerText()
    for (const project of getPublishedProjects()) expect(text, project.name).not.toContain(project.name)
    expect(text).not.toContain('this site')
  })
})

test('no phone number anywhere in the page', async ({ page }) => {
  await page.goto('/')
  expect((await page.content()).replace(/\D/g, '')).not.toContain('9764904641')
})

test.describe('experience, about, skills, testimonials', () => {
  test('experience shows the three FinTech company roles in order, the award and the earlier roles', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#experience')
    expect(await section.locator('h4').allTextContents()).toEqual(jobs[0].roles.map((r) => r.title))
    await expect(section).toContainText(award.title)
    for (const job of earlierJobs) await expect(section).toContainText(job.title)
  })

  test('about defines "Vibe Engineer" once, as a definition', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#about dfn')).toHaveText('Vibe Engineer')
    const text = await page.locator('body').innerText()
    // A whole word: the footer's "Vibe engineered with AI agents" is not the term.
    expect(text.match(/\bvibe engineer\b/gi)?.length).toBe(1)
  })

  test('skills say plainly that AI agents write the code, and list no programming languages', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#tech')).toContainText(skillsIntro)
    expect(await page.locator('#tech h3').allTextContents()).not.toContain('Languages')
  })

  test('skills are plain-text groups with no emoji', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('#tech h3').allTextContents()).toEqual(skillGroups.map((g) => g.name))
    const skillsText = await page.locator('#tech').innerText()
    expect(skillsText.length).toBeGreaterThan(100) // guards against a vacuous pass on unrendered text
    expect(skillsText).not.toMatch(/\p{Extended_Pictographic}/u)
  })

  test('testimonials: the verbatim quotes, in a carousel', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#testimonials')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('What tech professionals say')
    expect((await section.locator('blockquote').allTextContents()).map((q) => q.trim())).toEqual(testimonials.map((t) => t.quote))
    for (const t of testimonials) await expect(section.locator('figcaption', { hasText: t.name })).toHaveCount(1)
    await expect(section.locator('[aria-roledescription="carousel"]')).toHaveCount(1)
    await expect(section.locator('[aria-roledescription="slide"]')).toHaveCount(testimonials.length)
  })

  test('testimonials: moves on by itself, holds under a mouse, stops when paused, never announces itself', async ({
    page,
    isMobile,
    browserName,
  }) => {
    // WebKit doesn't deliver IntersectionObserver entries under a fake clock, so it runs in real time.
    const fake = browserName !== 'webkit'
    if (!fake) test.slow()
    const wait = (ms: number) => (fake ? page.clock.runFor(ms) : page.waitForTimeout(ms))
    if (fake) await page.clock.install()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const section = page.locator('#testimonials')
    const status = section.locator('[aria-atomic="true"]')
    const carousel = section.locator('.carousel')
    await carousel.scrollIntoViewIfNeeded()
    await expect(status).toHaveText(`1 of ${testimonials.length}`)
    // Advance only once the autoplay timer is armed (it arms when the carousel is seen).
    await expect(carousel).toHaveAttribute('data-autoplay', 'running')
    await wait(AUTOPLAY_MS + 400)
    await expect(status).toHaveText(`2 of ${testimonials.length}`)
    await expect(status).toHaveAttribute('aria-live', 'off')
    // A mouse resting on it holds it (touch screens have no hover).
    if (!isMobile) {
      await section.locator('.carousel-track').hover()
      await expect(carousel).toHaveAttribute('data-autoplay', 'held')
      await wait(AUTOPLAY_MS + 1000)
      await expect(status).toHaveText(`2 of ${testimonials.length}`)
      await page.mouse.move(0, 0)
    }
    // Pause stops it until Play.
    await section.getByRole('button', { name: 'Pause automatic quotes' }).click()
    await expect(carousel).toHaveAttribute('data-autoplay', 'held')
    await wait(AUTOPLAY_MS + 1000)
    await expect(status).toHaveText(`2 of ${testimonials.length}`)
    await section.getByRole('button', { name: 'Play quotes automatically' }).click()
    await expect(carousel).toHaveAttribute('data-autoplay', 'running')
    await wait(AUTOPLAY_MS + 400)
    await expect(status).toHaveText(`3 of ${testimonials.length}`)
  })

  test('testimonials: with reduced motion the carousel starts paused', async ({ page }) => {
    await page.clock.install()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const section = page.locator('#testimonials')
    await section.locator('.carousel').scrollIntoViewIfNeeded()
    await expect(section.getByRole('button', { name: 'Play quotes automatically' })).toBeEnabled()
    const before = await section.locator('.carousel-track').evaluate((el) => el.scrollLeft)
    await page.clock.runFor(20000)
    expect(await section.locator('.carousel-track').evaluate((el) => el.scrollLeft)).toBe(before)
  })

  test('testimonials: Next and Previous move the carousel and announce where it is', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const section = page.locator('#testimonials')
    const previous = section.getByRole('button', { name: 'Previous quotes' })
    const next = section.getByRole('button', { name: 'Next quotes' })
    const status = section.locator('[aria-atomic="true"]')
    await next.scrollIntoViewIfNeeded()
    await expect(previous).toBeDisabled()
    await expect(next).toBeEnabled()
    await expect(status).toHaveText(`1 of ${testimonials.length}`)
    await expect(status).toHaveAttribute('aria-live', 'off')
    await next.click()
    await expect(status).toHaveText(`2 of ${testimonials.length}`)
    await expect(status).toHaveAttribute('aria-live', 'polite')
    await expect(previous).toBeEnabled()
    await previous.click()
    await expect(status).toHaveText(`1 of ${testimonials.length}`)
  })

  test('legacy anchors still resolve', async ({ page }) => {
    await page.goto('/')
    for (const id of ['home', 'projects', 'approach', 'experience', 'about', 'tech', 'testimonials', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
  })
})
