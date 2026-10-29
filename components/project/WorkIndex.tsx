import { IconExternal } from '@/components/icons'
import type { Project } from '@/content/types'

/** The rest of the collection: ruled rows that expand to show what was built and how it is verified. */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="cv-auto mt-20 lg:mt-28">
      <h3 className="t-h3">More work</h3>
      <ul className="mt-6 border-t border-rule">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-rule">
            <details className="disclosure">
              <summary className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_5.5rem_auto]">
                <span data-project-name className="col-start-1 row-start-1 font-display text-[1.375rem] leading-snug">
                  {project.name}
                </span>
                <span className="t-small col-span-2 col-start-1 row-start-2 text-ink-soft md:col-span-1 md:col-start-2 md:row-start-1">
                  {project.summary}
                </span>
                <span className="t-meta hidden md:col-start-3 md:row-start-1 md:block">{project.period}</span>
                <span
                  aria-hidden="true"
                  className="disclosure-sign col-start-2 row-start-1 self-center md:col-start-4"
                >
                  +
                </span>
              </summary>
              <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-x-6">
                <p className="t-meta flex flex-wrap gap-x-5 gap-y-1 md:flex-col">
                  <span>{project.role}</span>
                  <span>{project.period}</span>
                  {project.context ? <span>{project.context}</span> : null}
                </p>
                <div>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                      <h4 className="font-sans text-[0.9375rem] font-semibold">What I built</h4>
                      <ul className="list-built t-small mt-3">
                        {project.built.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-sans text-[0.9375rem] font-semibold">How I know it works</h4>
                      {project.verified.length ? (
                        <ul className="list-evidence t-small mt-3">
                          {project.verified.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                      {project.verificationGap ? (
                        <p data-gap className="t-small mt-3 text-ink-soft">
                          {project.verificationGap}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="t-code mt-6">{project.stack.join(', ')}</p>
                  {project.links.length ? (
                    <p className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
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
              </div>
            </details>
          </li>
        ))}
      </ul>
      <p className="t-small mt-8 max-w-[60ch] text-ink-soft">
        A few more products are in development. They’ll appear here once they’re properly tested.
      </p>
    </div>
  )
}
