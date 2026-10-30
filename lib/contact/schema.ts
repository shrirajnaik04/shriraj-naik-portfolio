/**
 * Shared by the server handler and the client form, so both apply exactly the same rules. Plain
 * functions, no validation library: the form ships to the browser, and four length-and-pattern
 * checks don't justify ~15 KB of script there (the app-owned JS budget is 20 KB).
 */
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

/** A practical address check (the same pattern zod 4 uses for `z.email()`): dotted local part, a domain with a TLD. */
const EMAIL_PATTERN = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

const within = (value: string, [min, max]: readonly [number, number]) => value.length >= min && value.length <= max

const RULES: Record<ContactField, (value: string) => boolean> = {
  name: (v) => within(v, CONTACT_LIMITS.name) && NAME_PATTERN.test(v),
  email: (v) => v.length <= CONTACT_LIMITS.emailMax && EMAIL_PATTERN.test(v),
  subject: (v) => within(v, CONTACT_LIMITS.subject),
  message: (v) => within(v, CONTACT_LIMITS.message),
}

/** The trimmed value when it is a valid string for `field`, otherwise null. */
function accept(field: ContactField, value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return RULES[field](trimmed) ? trimmed : null
}

/** Validates one field (used on blur); returns its error message or null. */
export function validateField(field: ContactField, value: unknown): string | null {
  return accept(field, value) === null ? FIELD_ERRORS[field] : null
}

/** Trims and validates every field. */
export function validateContactFields(
  input: unknown,
): { ok: true; data: ContactFields } | { ok: false; fields: Partial<Record<ContactField, string>> } {
  const source = (input !== null && typeof input === 'object' ? input : {}) as Record<string, unknown>
  const data = {} as ContactFields
  const fields: Partial<Record<ContactField, string>> = {}
  for (const field of CONTACT_FIELDS) {
    const value = accept(field, source[field])
    if (value === null) fields[field] = FIELD_ERRORS[field]
    else data[field] = value
  }
  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, data }
}
