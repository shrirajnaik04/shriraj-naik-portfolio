import { existsSync, readFileSync } from 'node:fs'
import { normalize } from './walk-strings'

/**
 * Terms that must never appear in public output: confidential client/customer names and other
 * banned terms. Sources, in order: the CONFIDENTIAL_TERMS env var (CI secret, newline-separated),
 * then the git-ignored `.confidential-terms` file. The terms are never committed — not even hashed.
 */
export function loadConfidentialTerms(): string[] | null {
  const raw =
    process.env.CONFIDENTIAL_TERMS ?? (existsSync('.confidential-terms') ? readFileSync('.confidential-terms', 'utf8') : null)
  if (raw == null) return null
  const terms = raw.split(/\r?\n/).map(normalize).filter(Boolean)
  return terms.length ? terms : null
}

/** Terms from `terms` that occur in `text` (both normalized; matched on word boundaries). */
export function findConfidentialTerms(text: string, terms: string[]): string[] {
  const haystack = ` ${normalize(text)} `
  return terms.filter((t) => haystack.includes(` ${t} `))
}
