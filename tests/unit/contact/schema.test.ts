import { describe, expect, test } from 'vitest'
import { CONTACT_FIELDS, CONTACT_LIMITS, FIELD_ERRORS, validateContactFields, validateField } from '@/lib/contact/schema'

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Hello there', message: 'A message long enough.' }

describe('contact field validation', () => {
  test('accepts a valid message and trims every field', () => {
    const r = validateContactFields({ ...valid, name: '  Ada Lovelace ', subject: ' Hello there ' })
    expect(r).toEqual({ ok: true, data: { ...valid } })
  })

  test('accepts non-ASCII and apostrophe names', () => {
    for (const name of ['José Ñúñez', 'शिवा नाइक', "O'Neil", 'Zoë D’Souza-Naik']) {
      expect(validateContactFields({ ...valid, name }).ok, name).toBe(true)
    }
  })

  test('name length boundaries and characters', () => {
    expect(validateContactFields({ ...valid, name: 'A' }).ok).toBe(false)
    expect(validateContactFields({ ...valid, name: 'Al' }).ok).toBe(true)
    expect(validateContactFields({ ...valid, name: 'A'.repeat(CONTACT_LIMITS.name[1]) }).ok).toBe(true)
    expect(validateContactFields({ ...valid, name: 'A'.repeat(CONTACT_LIMITS.name[1] + 1) }).ok).toBe(false)
    expect(validateContactFields({ ...valid, name: '<script>' }).ok).toBe(false)
    expect(validateContactFields({ ...valid, name: '1337 hacker' }).ok).toBe(false)
  })

  test('subject and message boundaries', () => {
    expect(validateContactFields({ ...valid, subject: 'Hi' }).ok).toBe(false)
    expect(validateContactFields({ ...valid, subject: 'Hey' }).ok).toBe(true)
    expect(validateContactFields({ ...valid, subject: 'x'.repeat(121) }).ok).toBe(false)
    expect(validateContactFields({ ...valid, message: '123456789' }).ok).toBe(false)
    expect(validateContactFields({ ...valid, message: '1234567890' }).ok).toBe(true)
    expect(validateContactFields({ ...valid, message: 'x'.repeat(2000) }).ok).toBe(true)
    expect(validateContactFields({ ...valid, message: 'x'.repeat(2001) }).ok).toBe(false)
  })

  test('email format and the 254-character limit', () => {
    expect(validateContactFields({ ...valid, email: 'not-an-email' }).ok).toBe(false)
    expect(validateContactFields({ ...valid, email: `${'a'.repeat(245)}@example.com` }).ok).toBe(false)
    expect(validateContactFields({ ...valid, email: `${'a'.repeat(242)}@example.com` }).ok).toBe(true)
  })

  test('email shapes: dotted and tagged local parts pass; empty labels, no TLD and spaces fail', () => {
    for (const email of ['A@EXAMPLE.COM', 'first.last@sub.example.co.in', 'a+tag@example.com', "o'neil@example.com"])
      expect(validateField('email', email), email).toBeNull()
    for (const email of ['a..b@example.com', '.a@example.com', 'a.@example.com', 'a@example', 'a@-example.com', 'a@.example.com', 'a b@example.com', 'a@@example.com', 'ünï@example.com'])
      expect(validateField('email', email), email).toBe(FIELD_ERRORS.email)
  })

  test('whitespace-only values are empty, and on-blur checks agree with the full check', () => {
    for (const field of CONTACT_FIELDS) {
      expect(validateField(field, ' \n\t '), field).toBe(FIELD_ERRORS[field])
      expect(validateField(field, valid[field]), field).toBeNull()
      expect(validateField(field, 42), field).toBe(FIELD_ERRORS[field])
    }
  })

  test('reports a message for every invalid field', () => {
    const r = validateContactFields({ name: '', email: 'x', subject: '', message: '' })
    expect(r).toEqual({ ok: false, fields: FIELD_ERRORS })
  })

  test('non-string and missing fields are invalid, not a crash', () => {
    expect(validateContactFields({ name: 42, email: null }).ok).toBe(false)
    expect(validateContactFields(null).ok).toBe(false)
  })
})
