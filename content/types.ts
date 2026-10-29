export interface ProjectLink {
  label: string
  href: string
  kind: 'site' | 'repo'
}

export interface Decision {
  title: string
  why: string
  tradeoff: string
}

export interface CaseStudy {
  context: string[]
  constraints: string[]
  decisions: Decision[]
  /** Text equivalent of the architecture schematic, shown as its caption. */
  architecture: string
  quality: string[]
  /** Where the project stands today, as plain facts (no status labels). */
  whereItStands: string[]
  next: string[]
}

export type SchematicKind = 'gym-daddy' | 'fintech-qa' | 'printsaathi' | 'travel-concierge'

export interface Project {
  slug: string
  name: string
  summary: string
  /** What the work was, e.g. "Founder and sole engineer". */
  role: string
  /** "YYYY" or "YYYY – YYYY|present", backed by commit dates in the private claims evidence. */
  period: string
  /** Ownership context where it matters: employer work or an anonymized client engagement. */
  context?: string
  /** One factual sentence where a reader could otherwise assume more maturity. Never a label. */
  note?: string
  problem?: string
  built: string[]
  /** Evidence that it works; shown with a check mark. */
  verified: string[]
  /** What has not been verified, stated plainly; shown without a check mark. */
  verificationGap?: string
  stack: string[]
  links: ProjectLink[]
  /** Featured projects get a full spread; the rest form the "More work" index. */
  tier: 'featured' | 'more'
  /** A single switch to withhold a project from the site. */
  publish: boolean
  /** Drafting-style figure for featured projects; the caption is its plain-sentence summary. */
  schematic?: { kind: SchematicKind; caption: string }
  caseStudy?: CaseStudy
}

export interface Role {
  title: string
  period: string
  /** Full resume bullets. */
  bullets: string[]
  /** The subset shown on the website; must be a subset of `bullets`. */
  highlights: string[]
}

export interface Job {
  company: string
  location: string
  period: string
  roles: Role[]
}

export interface EarlierJob {
  company: string
  title: string
  period: string
}

export interface SkillGroup {
  name: string
  items: string[]
}

export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
}

export interface Fact {
  value: string
  label: string
}

export interface Award {
  title: string
  period: string
  note: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  email: string
  /** Resume only — never rendered on the website. */
  phone: string
  links: { site: string; linkedin: string; github: string }
  portrait: { src: string; alt: string }
  hero: { subtitle: string; statement: string; body: string }
  facts: Fact[]
  about: { intro: string; outro: string }
  vibeDefinition: string
}
