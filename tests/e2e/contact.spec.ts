import { expect, test, type Page } from '@playwright/test'
import { FIELD_ERRORS } from '../../lib/contact/schema'

const SUCCESS = 'Thanks — your message is on its way. I’ll reply by email.'
const RATE_LIMITED = 'Too many messages from your network. Please try again in a few minutes, or email me directly.'
const GENERIC = 'Something went wrong sending your message. Please email me at nykshriraj4nov@gmail.com.'
const TOO_FAST = 'Please wait a few seconds, then send your message again.'
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

test('after an empty submit, errors clear as the fields are fixed and one click sends', async ({ page }) => {
  // Regression: the message error used to clear only on blur, so the click on Send blurred the field,
  // the error line vanished, the button moved up under the pointer and the click was lost.
  let posts = 0
  await page.route('**/api/contact', (route) => {
    posts += 1
    return route.fulfill({ status: 200, json: { ok: true } })
  })
  await openContact(page)
  const send = page.locator('#contact form').getByRole('button', { name: 'Send message' })
  await send.click()
  await expect(page.locator('#contact-message')).toHaveAttribute('aria-invalid', 'true')
  await fillValid(page) // the cursor stays in the message field
  for (const field of Object.keys(FIELD_ERRORS))
    await expect(page.locator(`#contact-${field}`)).not.toHaveAttribute('aria-invalid', 'true')
  await send.click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(SUCCESS)
  expect(posts).toBe(1)
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

test('rate limiting, server errors and a too-quick send show the agreed copy', async ({ page }) => {
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
  reply = { status: 400, json: { ok: false, error: 'too_fast' } }
  await send.click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(TOO_FAST)
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

test('the honeypot is unreachable by keyboard, hidden from assistive technology and no autofill target', async ({ page }) => {
  await openContact(page)
  const trap = page.locator('#contact form [aria-hidden="true"] input')
  await expect(trap).toHaveCount(1)
  await expect(trap).toHaveAttribute('tabindex', '-1')
  await expect(trap).toHaveAttribute('autocomplete', 'off')
  // Browser autofill and password managers match fields by id, name and label; a trap they fill
  // would discard a real message behind a success message.
  const AUTOFILL = /company|organi[sz]ation|name|mail|phone|tel|fax|address|street|city|postal|zip|country|url|website/i
  const id = (await trap.getAttribute('id')) ?? ''
  const name = (await trap.getAttribute('name')) ?? ''
  const label = await page.locator(`label[for="${id}"]`).innerText()
  for (const value of [id.replace(/^contact-/, ''), name, label]) expect(value).not.toMatch(AUTOFILL)
  expect(await trap.getAttribute('data-1p-ignore')).not.toBeNull()
  await expect(trap).toHaveAttribute('data-lpignore', 'true')
})

test('the bot timer counts from page load, so a quick sender is not discarded', async ({ page }) => {
  let elapsedMs = -1
  await page.route('**/api/contact', async (route) => {
    elapsedMs = (route.request().postDataJSON() as { elapsedMs: number }).elapsedMs
    await route.fulfill({ status: 200, json: { ok: true } })
  })
  await openContact(page)
  await page.waitForTimeout(3200) // reading the page first
  await fillValid(page) // then filling the form in well under 3 s
  await page.locator('#contact form').getByRole('button', { name: 'Send message' }).click()
  await expect(page.locator('#contact [role="status"]')).toHaveText(SUCCESS)
  expect(elapsedMs).toBeGreaterThanOrEqual(3000)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the form cannot submit, so nothing typed ends up in a URL', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('#contact form')
    await expect(form).toHaveAttribute('method', 'post')
    await expect(form.getByRole('button', { name: 'Send message' })).toBeDisabled()
    await page.locator('#contact-name').focus()
    await page.keyboard.type('Ada Lovelace')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    expect(new URL(page.url()).search).toBe('')
  })
})

test('the message counter tracks length', async ({ page }) => {
  await openContact(page)
  await page.locator('#contact-message').fill('twelve chars')
  await expect(page.locator('#contact-message-count')).toHaveText('12 / 2,000')
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

test('every field has a visible label and a placeholder hint', async ({ page }) => {
  await page.goto('/#contact')
  for (const field of ['name', 'email', 'subject', 'message']) {
    await expect(page.locator(`label[for="contact-${field}"]`)).toBeVisible()
    expect((await page.locator(`#contact-${field}`).getAttribute('placeholder'))?.trim().length, field).toBeGreaterThan(0)
  }
})
