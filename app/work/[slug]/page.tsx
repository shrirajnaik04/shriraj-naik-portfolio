import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/project/CaseStudy'
import { JsonLd } from '@/components/site/JsonLd'
import { getCaseStudySlugs, getProject } from '@/content'
import { articleJsonLd } from '@/lib/json-ld'
import { SITE_NAME, socialMetadata } from '@/lib/metadata'

export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project?.caseStudy) return {}
  const title = `${project.name} case study | ${SITE_NAME}`
  const path = `/work/${slug}`
  return {
    title: { absolute: title },
    description: project.summary,
    alternates: { canonical: path },
    ...socialMetadata({ title, description: project.summary, path, type: 'article' }),
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project?.caseStudy) notFound()
  const other = getCaseStudySlugs()
    .filter((s) => s !== slug)
    .map((s) => getProject(s))
    .find(Boolean)
  return (
    <>
      <CaseStudy project={{ ...project, caseStudy: project.caseStudy }} other={other} />
      <JsonLd data={articleJsonLd(project)} />
    </>
  )
}
