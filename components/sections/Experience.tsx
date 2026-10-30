import { Section } from '@/components/site/Section'
import { award, earlierJobs, jobs } from '@/content'

/** A real sequence, so it reads as a timeline: period beside each role, newest first. */
export function Experience() {
  return (
    <Section id="experience" title="Experience" deferRendering>
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          {jobs.map((job) => (
            <div key={job.company}>
              <h3 className="t-h3">{job.company}</h3>
              <p className="t-meta mt-2 flex flex-wrap gap-x-5 gap-y-1">
                <span>{job.location}</span>
                <span>{job.period}</span>
              </p>
              <ol className="mt-10 border-l border-rule">
                {job.roles.map((role) => (
                  <li
                    key={role.title}
                    className="relative grid grid-cols-1 gap-x-8 gap-y-2 pb-10 pl-7 last:pb-0 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.45rem] -left-[5px] h-[9px] w-[9px] rounded-full border border-ink bg-paper"
                    />
                    <p className="t-meta pt-1">{role.period}</p>
                    <div>
                      <h4 className="t-h4">{role.title}</h4>
                      <ul className="list-built t-small mt-3">
                        {role.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="plate p-6">
            <p className="t-meta flex items-center gap-2 text-evidence">
              <span aria-hidden="true" className="mark-pass" />
              {award.period}
            </p>
            <p className="t-h4 mt-3">{award.title}</p>
            <p className="t-small mt-2 text-ink-soft">{award.note}</p>
          </div>

          <h3 className="mt-12 font-sans text-[0.9375rem] font-semibold">Before QA</h3>
          <ul className="mt-4 border-t border-rule">
            {earlierJobs.map((job) => (
              <li key={job.title} className="border-b border-rule py-4">
                <p className="font-medium">{job.title}</p>
                <p className="t-small text-ink-soft">{job.company}</p>
                <p className="t-meta mt-1">{job.period}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
