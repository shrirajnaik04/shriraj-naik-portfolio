import { expect, test } from '@playwright/test'
import { getProject } from '../../content'
import { SITE_URL } from '../../lib/site'

const LABELS = ['Context', 'Constraints', 'Architecture', 'Decisions', 'Quality', 'Where it stands', 'Next']

for (const slug of ['gym-daddy', 'printsaathi']) {
  test(`${slug} renders the full case study`, async ({ page }) => {
    const project = getProject(slug)!
    const response = await page.goto(`/work/${slug}`)
    expect(response?.status()).toBe(200)

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText(project.name)
    expect(await page.locator('main article section > h2').allTextContents()).toEqual(LABELS)

    const decisions = page.locator('#decisions li')
    await expect(decisions).toHaveCount(5)
    for (const decision of await decisions.all()) {
      expect(await decision.locator('dt').allTextContents()).toEqual(['Why', 'Trade-off'])
    }

    const svg = page.locator('main figure svg[role="img"]')
    await expect(svg).toHaveCount(1)
    expect((await svg.locator('title').textContent())?.trim().length).toBeGreaterThan(0)
    expect((await page.locator('main figure figcaption').textContent())?.trim().length).toBeGreaterThan(0)

    await expect(page.locator('#where-it-stands')).toContainText(project.caseStudy!.whereItStands[0])
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}/work/${slug}`)
    await expect(page).toHaveTitle(`${project.name} case study | Shriraj Naik`)
    await expect(page.getByRole('link', { name: 'All work' }).first()).toHaveAttribute('href', '/#projects')
    expect((await page.content()).replace(/\D/g, '')).not.toContain('9764904641')
  })
}

test('non-case-study and unknown slugs are 404s', async ({ page }) => {
  for (const path of ['/work/travel-ota', '/work/nope']) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(404)
  }
})

/** Records every view-transition animation (duration > 0) in each new document, from its first frame. */
const RECORD_TRANSITIONS = () => {
  const seen: string[] = []
  ;(window as unknown as { __vt: string[] }).__vt = seen
  const poll = () => {
    for (const a of document.getAnimations()) {
      const pseudo = (a.effect as KeyframeEffect | null)?.pseudoElement ?? ''
      if (pseudo.startsWith('::view-transition') && Number(a.effect?.getTiming().duration) > 0) seen.push(pseudo)
    }
    if (performance.now() < 5000) requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

async function openGymDaddyCaseStudy(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.addInitScript(RECORD_TRANSITIONS)
  // The drawing is sticky beside the text, so it is on screen when the link is.
  await page.locator('#project-gym-daddy').scrollIntoViewIfNeeded()
  const link = page.getByRole('link', { name: 'Read the Gym Daddy case study' })
  await link.scrollIntoViewIfNeeded()
  await link.click()
  await expect(page).toHaveURL(/\/work\/gym-daddy$/)
  await expect(page.locator('h1')).toHaveText('Gym Daddy')
  await page.waitForTimeout(800)
  return (await page.evaluate(() => (window as unknown as { __vt?: string[] }).__vt ?? [])) as string[]
}

test('opening a case study morphs the drawing into place (Chromium, cross-document)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Cross-document view transitions are verified in Chromium')
  const seen = await openGymDaddyCaseStudy(page)
  expect(seen).toContain('::view-transition-group(figure-gym-daddy)')
})

test('with reduced motion, navigation runs no view-transition animations', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Cross-document view transitions are verified in Chromium')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await openGymDaddyCaseStudy(page)).toEqual([])
})
