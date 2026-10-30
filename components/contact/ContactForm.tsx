'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import { CONTACT_FIELDS, CONTACT_LIMITS, validateContactFields, validateField, type ContactField } from '@/lib/contact/schema'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }
type Errors = Partial<Record<ContactField, string>>

const SUCCESS = 'Thanks — your message is on its way. I’ll reply by email.'
const ERROR_COPY: Record<string, string> = {
  rate_limited: 'Too many messages from your network. Please try again in a few minutes, or email me directly.',
  expired: 'This form has been open a long time. Please reload the page and try again.',
  too_fast: 'Please wait a few seconds, then send your message again.',
}

const LABELS: Record<ContactField, string> = { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' }

/** Hints only: every field keeps its visible label. */
const PLACEHOLDERS: Record<ContactField, string> = {
  name: 'Your name',
  email: 'you@company.com',
  subject: 'A role, a project or a question',
  message: 'A few lines about what you need, and how I can help.',
}

const noSubscription = () => () => {}

/**
 * False in the server HTML and during hydration, true once React has attached the submit handler.
 * Until then Send stays disabled, so the browser never submits the form natively (which would put
 * the fields in the URL and lose the message).
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
}

/**
 * The contact form. Validation is the same set of rules the server uses (lib/contact/schema.ts),
 * run on blur and on submit. Errors are linked to their fields; on a failed submit, focus moves to the first invalid
 * field. The status message stays until the next submit. `elapsedMs` (how long the page has been
 * open) and the hidden trap field let the server answer bots without sending.
 */
export function ContactForm({ email }: { email: string }) {
  const hydrated = useHydrated()
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [messageLength, setMessageLength] = useState(0)

  const focusFirstInvalid = (form: HTMLFormElement, found: Errors) => {
    const first = CONTACT_FIELDS.find((field) => found[field])
    if (first) form.querySelector<HTMLElement>(`#contact-${first}`)?.focus()
  }

  const revalidate = (field: ContactField, value: string) => {
    const error = validateField(field, value)
    setErrors((current) => ({ ...current, [field]: error ?? undefined }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const values = Object.fromEntries(CONTACT_FIELDS.map((field) => [field, String(data.get(field) ?? '')]))
    const checked = validateContactFields(values)
    if (!checked.ok) {
      setErrors(checked.fields)
      setStatus({ kind: 'idle' })
      focusFirstInvalid(form, checked.fields)
      return
    }
    setErrors({})
    setStatus({ kind: 'sending' })
    const fallback = `Something went wrong sending your message. Please email me at ${email}.`
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...checked.data,
          company: String(data.get('ref_code') ?? ''),
          // Time since the page opened: people read before they write; scripts post at once.
          elapsedMs: Math.round(performance.now()),
        }),
      })
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Errors }
      if (response.ok && result.ok) {
        form.reset()
        setMessageLength(0)
        setStatus({ kind: 'sent' })
        return
      }
      if (result.error === 'validation' && result.fields) {
        setErrors(result.fields)
        setStatus({ kind: 'idle' })
        focusFirstInvalid(form, result.fields)
        return
      }
      setStatus({ kind: 'error', message: ERROR_COPY[result.error ?? ''] ?? fallback })
    } catch {
      setStatus({ kind: 'error', message: fallback })
    }
  }

  const describedBy = (field: ContactField) =>
    [field === 'message' ? 'contact-message-count' : null, errors[field] ? `contact-${field}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  const field = (name: ContactField, input: (props: Record<string, unknown>) => React.ReactNode) => (
    <div className="grid gap-2">
      <label htmlFor={`contact-${name}`} className="font-medium">
        {LABELS[name]}
      </label>
      {input({
        id: `contact-${name}`,
        name,
        placeholder: PLACEHOLDERS[name],
        required: true,
        'aria-invalid': errors[name] ? true : undefined,
        'aria-describedby': describedBy(name),
        // Errors appear on blur, and a shown error clears as soon as the value is valid. Clearing it
        // only on blur would move the Send button between mousedown and mouseup and lose the click.
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => revalidate(name, e.currentTarget.value),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (errors[name]) revalidate(name, e.currentTarget.value)
        },
        className: 'field',
      })}
      {errors[name] ? (
        <p id={`contact-${name}-error`} className="t-small text-signal">
          {errors[name]}
        </p>
      ) : null}
    </div>
  )

  return (
    <form method="post" action="/api/contact" noValidate onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {field('name', (p) => <input type="text" autoComplete="name" maxLength={CONTACT_LIMITS.name[1]} {...p} />)}
        {field('email', (p) => (
          <input type="email" autoComplete="email" inputMode="email" maxLength={CONTACT_LIMITS.emailMax} {...p} />
        ))}
      </div>
      {field('subject', (p) => <input type="text" maxLength={CONTACT_LIMITS.subject[1]} {...p} />)}
      {field('message', (p) => (
        <textarea
          rows={6}
          maxLength={CONTACT_LIMITS.message[1]}
          onInput={(e) => setMessageLength(e.currentTarget.value.length)}
          {...p}
        />
      ))}
      <p id="contact-message-count" className="t-small -mt-4 text-ink-soft tabular-nums" aria-live="off">
        {messageLength.toLocaleString('en-US')} / {CONTACT_LIMITS.message[1].toLocaleString('en-US')}
      </p>

      {/* Hidden from people and assistive technology; only bots fill it in. Its id, name and label match
          no autofill vocabulary and password managers are told to skip it, so a visitor's autofill never
          fills it (a filled trap means the message is dropped behind a success message). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-ref-code">Referral code (leave empty)</label>
        <input
          id="contact-ref-code"
          type="text"
          name="ref_code"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" className="btn btn-primary" disabled={!hydrated || status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" className={status.kind === 'error' ? 'text-signal' : 'text-evidence'}>
          {status.kind === 'sent' ? SUCCESS : status.kind === 'error' ? status.message : ''}
        </p>
      </div>
    </form>
  )
}
