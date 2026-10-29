import Link from 'next/link'
import { IconExternal } from '@/components/icons'
import { SchematicFor } from '@/components/schematics'
import type { Project } from '@/content/types'

/** A featured project as an editorial spread built around its schematic. Sides alternate on wide screens. */
export function FeaturedProject({ project, flip }: { project: Project; flip: boolean }) {
  const titleId = `project-${project.slug}`
  return (
    <article
      aria-labelledby={titleId}
      className={`spread ${flip ? 'spread--flip' : ''} border-t border-rule py-16 first:border-t-0 first:pt-0 lg:py-24`}
    >
      <header className="spread__head">
        <h3 id={titleId} className="t-h3">
          {project.name}
        </h3>
        <p className="t-meta mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <span>{project.role}</span>
          <span>{project.period}</span>
          {project.context ? <span>{project.context}</span> : null}
        </p>
      </header>

      {project.schematic ? (
        <figure className="spread__figure">
          <div className="figure-plate">
            <SchematicFor kind={project.schematic.kind} />
          </div>
          <figcaption className="t-small mt-4 max-w-[56ch] text-ink-soft">{project.schematic.caption}</figcaption>
        </figure>
      ) : null}

      <div className="spread__body">
        <p className="t-lede">{project.summary}</p>
        {project.problem ? <p className="t-body mt-4 text-ink-soft">{project.problem}</p> : null}
        {project.note ? <p className="t-small mt-4 text-ink-soft">{project.note}</p> : null}

        <div className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h4 className="font-sans text-[0.9375rem] font-semibold">What I built</h4>
            <ul className="list-built t-small mt-3">
              {project.built.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div data-evidence>
            <h4 className="font-sans text-[0.9375rem] font-semibold">How I know it works</h4>
            <ul className="list-evidence t-small mt-3">
              {project.verified.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="t-code mt-8">{project.stack.join(', ')}</p>

        {project.caseStudy || project.links.length ? (
          <p className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            {project.caseStudy ? (
              <Link href={`/work/${project.slug}`} prefetch={false} className="btn btn-secondary">
                Read the {project.name} case study
              </Link>
            ) : null}
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
    </article>
  )
}
