import { describe, expect, test } from 'vitest'
import { envValue, mailRoute } from '@/lib/contact/config'

describe('mail configuration from the environment', () => {
  test('a variable that is set but empty counts as unset', () => {
    expect(envValue(undefined)).toBeUndefined()
    expect(envValue('')).toBeUndefined()
    expect(envValue('   ')).toBeUndefined()
    expect(envValue(' smtp.example.com ')).toBe('smtp.example.com')
  })

  test('recipient and sender fall back past empty variables', () => {
    expect(mailRoute({ RECIPIENT_EMAIL: '', EMAIL_FROM: ' ', EMAIL_USER: 'me@example.com' }, 'owner@example.com')).toEqual({
      recipient: 'owner@example.com',
      from: 'me@example.com',
    })
    expect(mailRoute({ RECIPIENT_EMAIL: 'inbox@example.com', EMAIL_FROM: 'Site <site@example.com>' }, 'owner@example.com')).toEqual({
      recipient: 'inbox@example.com',
      from: 'Site <site@example.com>',
    })
  })
})
