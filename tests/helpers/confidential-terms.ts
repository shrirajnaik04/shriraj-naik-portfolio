import { existsSync, readFileSync } from 'node:fs'
import { normalize } from './walk-strings'

/** A line `resume-ok: <term>` bans the term everywhere except the resume (the owner's employer name). */
const RESUME_OK = /^\s*resume-ok:\s*/i

function termLines(): string[] | null {
  const raw =
    process.env.CONFIDENTIAL_TERMS ?? (existsSync('.confidential-terms') ? readFileSync('.confidential-terms', 'utf8') : null)
  return raw == null ? null : raw.split(/\r?\n/).filter((line) => line.trim())
}

/**
 * Terms that must never appear in public output: confidential client/customer names and other
 * banned terms. Sources, in order: the CONFIDENTIAL_TERMS env var (CI secret, newline-separated),
 * then the git-ignored `.confidential-terms` file. The terms are never committed — not even hashed.
 */
export function loadConfidentialTerms(): string[] | null {
  const terms = termLines()
    ?.map((line) => normalize(line.replace(RESUME_OK, '')))
    .filter(Boolean)
  return terms?.length ? terms : null
}

/** The same terms minus those the resume may name (`resume-ok:`). For resume text only. */
export function loadResumeBannedTerms(): string[] | null {
  const terms = termLines()
    ?.filter((line) => !RESUME_OK.test(line))
    .map(normalize)
    .filter(Boolean)
  return terms?.length ? terms : null
}

/** Terms from `terms` that occur in `text` (both normalized; matched on word boundaries). */
export function findConfidentialTerms(text: string, terms: string[]): string[] {
  const haystack = ` ${normalize(text)} `
  return terms.filter((t) => haystack.includes(` ${t} `))
}
