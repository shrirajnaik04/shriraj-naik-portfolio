import { describe, expect, test } from 'vitest'
import {
  filterPublished,
  getCaseStudySlugs,
  getFeaturedProjects,
  getMoreProjects,
  getPublishedProjects,
  jobs,
  profile,
  projects,
} from '@/content'
import type { Project } from '@/content/types'
import { REPO_URL } from '@/lib/site'

const FEATURED_ORDER = ['gym-daddy', 'fintech-qa', 'printsaathi', 'travel-ota']
const published = filterPublished(projects)

describe('projects', () => {
  test('8 projects in the inventory, with unique kebab-case slugs', () => {
    expect(projects).toHaveLength(8)
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  test('3–5 featured projects, in the agreed order', () => {
    const featured = getFeaturedProjects().map((p) => p.slug)
    expect(featured.length).toBeGreaterThanOrEqual(3)
    expect(featured.length).toBeLessThanOrEqual(5)
    expect(featured).toEqual(FEATURED_ORDER)
  })

  test('published = featured then "more work", each exactly once', () => {
    const all = getPublishedProjects().map((p) => p.slug)
    expect(all).toEqual([...getFeaturedProjects(), ...getMoreProjects()].map((p) => p.slug))
    expect(new Set(all).size).toBe(all.length)
    expect([...all].sort()).toEqual(published.map((p) => p.slug).sort())
  })

  test('case studies exist only for featured projects: Gym Daddy and PrintSaathi', () => {
    const featured = new Set(FEATURED_ORDER)
    expect(getCaseStudySlugs()).toEqual(['gym-daddy', 'printsaathi'])
    for (const slug of getCaseStudySlugs()) expect(featured.has(slug)).toBe(true)
  })

  test('filterPublished drops publish:false', () => {
    const p = { ...projects[0], publish: false } satisfies Project
    expect(filterPublished([p])).toEqual([])
  })

  test('every published project says what was built and how it is verified, or plainly what is not', () => {
    for (const p of published) {
      expect(p.built.length, p.slug).toBeGreaterThan(0)
      expect(p.verified.length > 0 || Boolean(p.verificationGap), p.slug).toBe(true)
    }
  })

  test('no project carries a status field or status label', () => {
    for (const p of projects) {
      expect(Object.keys(p), p.slug).not.toContain('status')
      expect(Object.keys(p), p.slug).not.toContain('statusNote')
    }
  })

  test('periods are years backed by commit dates: "YYYY" or "YYYY – YYYY|present"', () => {
    for (const p of projects) expect(p.period, p.slug).toMatch(/^\d{4}( – (\d{4}|present))?$/)
  })

  test('every featured project has a schematic with a plain-sentence caption', () => {
    for (const p of getFeaturedProjects()) {
      expect(p.schematic?.caption, p.slug).toMatch(/^[A-Z].+\.$/)
    }
  })

  test('site links are https', () => {
    for (const p of projects)
      for (const l of p.links.filter((l) => l.kind === 'site')) expect(l.href, p.slug).toMatch(/^https:\/\//)
  })

  test('the only repository link is this portfolio’s public repo', () => {
    const repoLinks = projects.flatMap((p) => p.links.filter((l) => l.kind === 'repo').map((l) => [p.slug, l.href]))
    expect(repoLinks).toEqual([['this-portfolio', REPO_URL]])
  })

  test('case studies: five decisions with why and trade-off, and where it stands today', () => {
    for (const p of projects.filter((p) => p.caseStudy)) {
      const cs = p.caseStudy!
      expect(cs.decisions, p.slug).toHaveLength(5)
      for (const d of cs.decisions) {
        expect(d.title.length && d.why.length && d.tradeoff.length, p.slug).toBeTruthy()
      }
      expect(cs.whereItStands.length, p.slug).toBeGreaterThan(0)
      expect(cs.architecture.length, p.slug).toBeGreaterThan(40)
    }
  })
})

describe('experience and profile', () => {
  test('site highlights are a subset of resume bullets', () => {
    for (const job of jobs)
      for (const role of job.roles) for (const h of role.highlights) expect(role.bullets, role.title).toContain(h)
  })

  test('three CodeMax roles, newest first, with titles exactly as held', () => {
    expect(jobs[0].roles.map((r) => r.title)).toEqual([
      'QA Analyst III',
      'QA Analyst II (Automation)',
      'Software Quality Analyst',
    ])
  })

  test('profile matches the agreed copy', () => {
    expect(profile.headline).toBe('QA Automation Engineer & AI Product Engineer')
    expect(profile.hero.subtitle).toBe('QA Automation Engineer & AI Product Engineer in Goa, India')
    expect(profile.facts.map((f) => f.value)).toEqual(['4+ yrs', '1,000+', '1,000+', 'Q3 2024', '1'])
  })
})
