import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/project/CaseStudy'
import { JsonLd } from '@/components/site/JsonLd'
import { getCaseStudySlugs, getProject } from '@/content'
import { articleJsonLd } from '@/lib/json-ld'

export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project?.caseStudy) return {}
  return {
    title: `${project.name} case study`,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
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
