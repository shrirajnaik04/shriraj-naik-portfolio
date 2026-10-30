import { expect, test, type Page } from '@playwright/test'
import { FIELD_ERRORS } from '../../lib/contact/schema'

const SUCCESS = 'Thanks — your message is on its way. I’ll reply by email.'
const RATE_LIMITED = 'Too many messages from your network. Please try again in a few minutes, or email me directly.'
const GENERIC = 'Something went wrong sending your message. Please email me at nykshriraj4nov@gmail.com.'
const NOSCRIPT = 'The form needs JavaScript. Email me at nykshriraj4nov@gmail.com instead.'

async function fillValid(page: Page, name = 'Ada Lovelace') {
  const form = page.locator('#contact form')
  await form.getByLabel('Name').fill(name)
  await form.getByLabel('Email').fill('ada@example.com')
  await form.getByLabel('Subject').fill('Hello there')
  await form.getByLabel('Message').fill('A message that is long enough to send.')
}

async function openContact(page: Page) {
  await page.goto('/#contact')
  await page.locator('#contact form').scrollIntoViewIfNeeded()
}

test('an empty submit shows four linked errors and focuses the first field', async ({ page }) => {
  await openContact(page)
  await page.locator('#contact form').getByRole('button', { name: 'Send message' }).click()
  for (const [field, message] of Object.entries(FIELD_ERRORS)) {
    const input = page.locator(`#contact-${field}`)
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = (await input.getAttribute('aria-describedby')) ?? ''
    const errorId = describedBy.split(' ').find((id) => id.endsWith('-error'))
    await expect(page.locator(`#${errorId}`)).toHaveText(message)
  }
  await expect(page.locator('#contact-name')).toBeFocused()
})

test('a sent message shows a status that stays', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { ok: true } }))
  await openContact(page)
  await fillValid(page)
  await page.locator('#contact form').getByRole('button', { name: 'Send message' }).click()
  const status = page.locator('#contact [role="status"]')
  await expect(status).toHaveText(SUCCESS)
  await page.waitForTimeout(5000)
  await expect(status).toHaveText(SUCCESS)
})

test('rate limiting and server errors show the agreed copy', async ({ page }) => {
  let reply = { status: 429, json: { ok: false, error: 'rate_limited' } }
  await page.route('**/api/contact', (route) => route.fulfill(reply))
  await openContact(page)
  await fillValid(page)
  const send = page.locator('#contact form').getByRole('button', { name: 'Send message' })
  await send.click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(RATE_LIMITED)
  reply = { status: 500, json: { ok: false, error: 'send_failed' } }
  await send.click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(GENERIC)
})

test('field errors returned by the server are shown on their fields', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 400, json: { ok: false, error: 'validation', fields: { subject: FIELD_ERRORS.subject } } }),
  )
  await openContact(page)
  await fillValid(page)
  await page.locator('#contact form').getByRole('button', { name: 'Send message' }).click()
  await expect(page.locator('#contact-subject-error')).toHaveText(FIELD_ERRORS.subject)
  await expect(page.locator('#contact-subject')).toBeFocused()
})

test('accented names are accepted in the browser', async ({ page }) => {
  await openContact(page)
  const name = page.locator('#contact-name')
  await name.fill('José Ñúñez')
  await name.blur()
  await expect(name).not.toHaveAttribute('aria-invalid', 'true')
})

test('the honeypot is unreachable by keyboard and hidden from assistive technology', async ({ page }) => {
  await openContact(page)
  const trap = page.locator('#contact input[name="company"]')
  await expect(trap).toHaveAttribute('tabindex', '-1')
  await expect(trap).toHaveAttribute('autocomplete', 'off')
  expect(await trap.evaluate((el) => Boolean(el.closest('[aria-hidden="true"]')))).toBe(true)
})

test('the message counter tracks length', async ({ page }) => {
  await openContact(page)
  await page.locator('#contact-message').fill('twelve chars')
  await expect(page.locator('#contact-message-count')).toHaveText('12 / 2000')
})

test('without JavaScript the email fallback is in the page', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain(NOSCRIPT)
})

test('the real endpoint accepts a message (stream transport)', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'One real submission per run, on desktop Chromium')
  await openContact(page)
  await fillValid(page)
  await page.waitForTimeout(3100) // a person takes longer than the 3 s bot threshold
  await page.locator('#contact form').getByRole('button', { name: 'Send message' }).click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(SUCCESS)
})
