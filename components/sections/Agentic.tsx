import { AgentLoopSchematic } from '@/components/schematics/AgentLoop'
import { Section } from '@/components/site/Section'
import { agenticIntro, practices } from '@/content'

/** Agentic engineering: how every project here is built, with the loop drawn beside the practices. */
export function Agentic() {
  return (
    <Section id="agentic" title="How I build with AI agents" intro={agenticIntro} surface="deep">
      <div className="agentic-flow grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <ul className="space-y-10 lg:col-span-7">
          {practices.map((practice) => (
            <li key={practice.title} className="reveal">
              <h3 className="t-h4">{practice.title}</h3>
              <p className="t-body mt-3 text-ink-soft">{practice.body}</p>
              <p className="t-meta mt-3 flex items-center gap-2 text-evidence">
                <span aria-hidden="true" className="mark-pass" />
                {practice.evidence}
              </p>
            </li>
          ))}
        </ul>
        <figure className="lg:col-span-5">
          <div className="figure-plate lg:sticky lg:top-24">
            <AgentLoopSchematic />
          </div>
          <figcaption className="t-small mt-4 text-ink-soft">
            Agents work in parallel inside guardrails, a harness checks every change, and nothing ships without my review.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
