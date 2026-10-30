import { expect, test } from '@playwright/test'
import { profile } from '../../content'
import { renderAll } from './helpers'

const ROUTES = ['/', '/work/gym-daddy', '/work/printsaathi', '/missing']

test.describe('at 320px wide', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  for (const path of ROUTES) {
    for (const text of ['100%', '200%']) {
      test(`${path} fits with ${text} text: nothing overflows the viewport`, async ({ page }) => {
        await page.goto(path)
        await renderAll(page)
        await page.addStyleTag({ content: `html { font-size: ${text} !important; }` })
        await page.locator('#projects details').evaluateAll((all) => all.forEach((d) => ((d as HTMLDetailsElement).open = true)))
        // The page must not scroll sideways, and no rendered box or line of text may cross the
        // viewport's edges (a box can fit while a long word spills out of it). Not rendered (a closed
        // disclosure), hidden from everyone (aria-hidden: decoration, the honeypot) and SVG internals
        // (clipped by their <svg>) are excluded; the <svg> itself is checked.
        const result = await page.evaluate(() => {
          const width = document.documentElement.clientWidth
          const shown = (el: Element) => el.checkVisibility() && !el.closest('[aria-hidden="true"]')
          const beyond = (r: DOMRect) => r.width > 0 && (r.right > width + 1 || r.left < -1)
          const name = (el: Element) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${[...el.classList].slice(0, 2).join('.')}`
          const boxes = [...document.querySelectorAll('body *')]
            .filter((el) => !el.parentElement?.closest('svg') && shown(el) && beyond(el.getBoundingClientRect()))
            .map(name)
          const text: string[] = []
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            const node = walker.currentNode
            const parent = node.parentElement
            if (!parent || !node.textContent?.trim() || !shown(parent)) continue
            const range = document.createRange()
            range.selectNodeContents(node)
            if ([...range.getClientRects()].some(beyond)) text.push(`"${node.textContent.trim().slice(0, 32)}" in ${name(parent)}`)
          }
          return { overflow: document.documentElement.scrollWidth - width, boxes: boxes.slice(0, 8), text: text.slice(0, 8) }
        })
        expect(result).toEqual({ overflow: 0, boxes: [], text: [] })
        await expect(page.locator('[data-mobile-nav] summary')).toBeVisible()
      })
    }
  }
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the home page reads, navigates and offers the email fallback', async ({ page, isMobile, browserName }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (isMobile) await page.locator('[data-mobile-nav] summary').click()
    await page.locator('header').getByRole('link', { name: 'Work', exact: true }).first().click()
    await expect(page).toHaveURL(/#projects$/)
    await expect(page.locator('#projects')).toBeInViewport()
    const more = page.locator('#projects details').first()
    if (browserName === 'webkit') {
      // Playwright can't scroll a JavaScript-disabled WebKit page to an off-screen element, so a
      // pointer click lands outside the viewport. Keyboard activation is native: focus scrolls, Enter opens.
      await more.locator('summary').focus()
      await more.locator('summary').press('Enter')
    } else {
      await more.locator('summary').click()
    }
    await expect(more).toHaveAttribute('open', '')
    await expect(page.locator('#contact')).toContainText(profile.email)
  })

  test('a case study reads in full and links back to the work', async ({ page }) => {
    await page.goto('/work/gym-daddy')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('main article section > h2')).not.toHaveCount(0)
    await expect(page.locator('main').getByRole('link', { name: /work/i }).first()).toHaveAttribute('href', /\/#projects$/)
  })
})
