import { projects } from './projects'
import type { Project } from './types'

export { agenticIntro, practices } from './agentic'
export { approachClosing, principles } from './approach'
export { earlierJobs, jobs } from './experience'
export { award, profile } from './profile'
export { projects } from './projects'
export { skillGroups, skillsIntro } from './skills'
export { testimonials } from './testimonials'

export function filterPublished(list: Project[]): Project[] {
  return list.filter((p) => p.publish)
}

/** Published featured projects, in file order. */
export function getFeaturedProjects(): Project[] {
  return filterPublished(projects).filter((p) => p.tier === 'featured')
}

/** Published "More work" projects, in file order. */
export function getMoreProjects(): Project[] {
  return filterPublished(projects).filter((p) => p.tier === 'more')
}

/** Every published project: featured first, then "More work". */
export function getPublishedProjects(): Project[] {
  return [...getFeaturedProjects(), ...getMoreProjects()]
}

export function getProject(slug: string): Project | undefined {
  return filterPublished(projects).find((p) => p.slug === slug)
}

export function getCaseStudySlugs(): string[] {
  return filterPublished(projects)
    .filter((p) => p.caseStudy)
    .map((p) => p.slug)
}
