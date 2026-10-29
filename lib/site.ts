export const SITE_URL = 'https://www.shrirajnaik.com'
export const RESUME_PATH = '/resume/Shriraj-Naik-QA-Automation-Engineer-Resume.pdf'
export const LEGACY_RESUME_PATH = '/SHRIRAJ NAIK - QA Analyst III.pdf'
export const REPO_URL = 'https://github.com/shrirajnaik04/shriraj-naik-portfolio'
/** Date content was last reviewed; drives sitemap lastModified so it is stable across builds. */
export const CONTENT_UPDATED = '2026-10-29'

export const NAV: { label: string; hash: string }[] = [
  { label: 'Work', hash: 'projects' },
  { label: 'Approach', hash: 'approach' },
  { label: 'Experience', hash: 'experience' },
  { label: 'About', hash: 'about' },
  { label: 'Contact', hash: 'contact' },
]

/**
 * Section link that works from every page. The header renders once in the root layout, and a
 * `/#hash` link on the home page only scrolls (fragment navigation to the current path).
 */
export function sectionHref(hash: string): string {
  return `/#${hash}`
}
