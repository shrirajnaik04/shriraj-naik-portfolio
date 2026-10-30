/**
 * An environment value, with a variable that is set but empty (a "cleared" value in a hosting
 * dashboard) treated as unset, so it falls back like a missing one instead of being used as "".
 */
export function envValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Where enquiries go and who sends them. */
export function mailRoute(
  env: Record<string, string | undefined>,
  fallbackRecipient: string,
): { recipient: string; from: string | undefined } {
  return {
    recipient: envValue(env.RECIPIENT_EMAIL) ?? fallbackRecipient,
    from: envValue(env.EMAIL_FROM) ?? envValue(env.EMAIL_USER),
  }
}
