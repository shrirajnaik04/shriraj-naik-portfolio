import type { ReactNode } from 'react'
import { IconExternal } from '@/components/icons'
import { SchematicFor } from '@/components/schematics'
import type { CaseStudy as CaseStudyContent, Project } from '@/content/types'
import { sectionHref } from '@/lib/site'
import { morphName } from '@/lib/view-transition'

const PARTS = [
  { id: 'context', label: 'Context' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'quality', label: 'Quality' },
  { id: 'where-it-stands', label: 'Where it stands' },
  { id: 'next', label: 'Next' },
] as const

function Part({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-rule py-12 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="t-h3">
        {label}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/**
 * A long read. The title and the drawing carry the same view-transition names as the home-page
 * spread, so opening a case study morphs them into place (cross-document view transition; links
 * here are plain anchors so the browser, not the client router, navigates).
 */
export function CaseStudy({
  project,
  other,
}: {
  project: Project & { caseStudy: CaseStudyContent }
  other?: Project
}) {
  const cs = project.caseStudy
  return (
    <article className="page pt-10 pb-[clamp(5rem,3rem+6vw,9rem)] lg:pt-16">
      <p>
        <a href={sectionHref('projects')} className="link t-small font-medium text-ink-soft">
          All work
        </a>
      </p>

      <header className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h1 className="t-h2 vt-morph" style={{ viewTransitionName: morphName('title', project.slug) }}>
            {project.name}
          </h1>
          <p className="t-meta mt-4 flex flex-wrap gap-x-5 gap-y-1">
            <span>{project.role}</span>
            <span>{project.period}</span>
            {project.context ? <span>{project.context}</span> : null}
          </p>
          <p className="t-lede mt-6">{project.summary}</p>
          {project.problem ? <p className="t-body mt-4 text-ink-soft">{project.problem}</p> : null}
          <p className="t-code mt-6">{project.stack.join(', ')}</p>
          {project.links.length ? (
            <p className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1.5 font-medium"
                >
                  {link.label}
                  <IconExternal />
                </a>
              ))}
            </p>
          ) : null}
        </div>
        {project.schematic ? (
          <figure className="lg:col-span-7">
            <div className="figure-plate vt-morph" style={{ viewTransitionName: morphName('figure', project.slug) }}>
              <SchematicFor kind={project.schematic.kind} />
            </div>
            <figcaption className="t-small mt-4 max-w-[56ch] text-ink-soft">{project.schematic.caption}</figcaption>
          </figure>
        ) : null}
      </header>

      <div className="mt-20 grid grid-cols-1 gap-12 lg:mt-28 lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ul className="t-small sticky top-24 space-y-2 border-l border-rule pl-5">
            {PARTS.map((part) => (
              <li key={part.id}>
                <a href={`#${part.id}`} className="text-ink-soft transition-colors duration-150 hover:text-ink">
                  {part.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-8 lg:col-start-5">
          <Part id="context" label="Context">
            {cs.context.map((p) => (
              <p key={p} className="t-body mt-4 first:mt-0">
                {p}
              </p>
            ))}
          </Part>
          <Part id="constraints" label="Constraints">
            <ul className="list-built">
              {cs.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Part>
          <Part id="architecture" label="Architecture">
            <p className="t-body">{cs.architecture}</p>
          </Part>
          <Part id="decisions" label="Decisions">
            <ol className="space-y-10">
              {cs.decisions.map((d) => (
                <li key={d.title}>
                  <h3 className="t-h4">{d.title}</h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
                    <dt className="font-semibold">Why</dt>
                    <dd className="text-ink-soft">{d.why}</dd>
                    <dt className="font-semibold">Trade-off</dt>
                    <dd className="text-ink-soft">{d.tradeoff}</dd>
                  </dl>
                </li>
              ))}
            </ol>
          </Part>
          <Part id="quality" label="Quality">
            <ul className="list-evidence">
              {cs.quality.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </Part>
          <Part id="where-it-stands" label="Where it stands">
            {cs.whereItStands.map((p) => (
              <p key={p} className="t-body">
                {p}
              </p>
            ))}
          </Part>
          <Part id="next" label="Next">
            <ul className="list-built">
              {cs.next.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Part>

          <p className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-rule pt-10">
            <a href={sectionHref('projects')} className="btn btn-secondary">
              All work
            </a>
            {other ? (
              <a href={`/work/${other.slug}`} className="link self-center font-medium">
                Read the {other.name} case study
              </a>
            ) : null}
          </p>
        </div>
      </div>
    </article>
  )
}
