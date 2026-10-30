import { FeaturedProject } from '@/components/project/FeaturedProject'
import { WorkIndex } from '@/components/project/WorkIndex'
import { Section } from '@/components/site/Section'
import { getFeaturedProjects, getMoreProjects } from '@/content'

export function Work() {
  const featured = getFeaturedProjects()
  return (
    <Section
      id="projects"
      title="Selected work"
      intro="Six I’d show first, then everything else. Each one says what I built and how I know it works."
    >
      {featured.map((project, i) => (
        <FeaturedProject key={project.slug} project={project} flip={i % 2 === 1} />
      ))}
      <WorkIndex projects={getMoreProjects()} />
    </Section>
  )
}
