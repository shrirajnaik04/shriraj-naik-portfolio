import * as z from 'zod/mini'

/** Shared by the server handler and the client form, so both apply exactly the same rules. */
export const CONTACT_LIMITS = {
  name: [2, 80],
  emailMax: 254,
  subject: [3, 120],
  message: [10, 2000],
} as const

export const FIELD_ERRORS = {
  name: 'Enter your name (2–80 letters).',
  email: 'Enter a valid email address.',
  subject: 'Enter a subject (3–120 characters).',
  message: 'Enter a message (10–2,000 characters).',
} as const

export type ContactField = keyof typeof FIELD_ERRORS
export type ContactFields = Record<ContactField, string>
export const CONTACT_FIELDS = Object.keys(FIELD_ERRORS) as ContactField[]

/** Letters and marks in any script, plus space, dot, apostrophes and hyphen: "José", "शिवा", "O'Neil". */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u

const SCHEMAS = {
  name: z.string().check(z.minLength(CONTACT_LIMITS.name[0]), z.maxLength(CONTACT_LIMITS.name[1]), z.regex(NAME_PATTERN)),
  email: z.email().check(z.maxLength(CONTACT_LIMITS.emailMax)),
  subject: z.string().check(z.minLength(CONTACT_LIMITS.subject[0]), z.maxLength(CONTACT_LIMITS.subject[1])),
  message: z.string().check(z.minLength(CONTACT_LIMITS.message[0]), z.maxLength(CONTACT_LIMITS.message[1])),
}

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : value)

/** Validates one field (used on blur); returns its error message or null. */
export function validateField(field: ContactField, value: unknown): string | null {
  return SCHEMAS[field].safeParse(clean(value)).success ? null : FIELD_ERRORS[field]
}

/** Trims and validates every field. */
export function validateContactFields(
  input: unknown,
): { ok: true; data: ContactFields } | { ok: false; fields: Partial<Record<ContactField, string>> } {
  const source = (input !== null && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const data = {} as ContactFields
  const fields: Partial<Record<ContactField, string>> = {}
  for (const field of CONTACT_FIELDS) {
    const result = SCHEMAS[field].safeParse(clean(source[field]))
    if (result.success) data[field] = result.data
    else fields[field] = FIELD_ERRORS[field]
  }
  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, data }
}
