import { Section } from '@/components/site/Section'
import { approachClosing, principles } from '@/content'

/** The QA thinking behind the work, on the ink-blue band. Principles are not a sequence, so they are not numbered. */
export function Approach() {
  return (
    <Section id="approach" title="How I test what I build" surface="band" layout="split">
      <ul className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
        {principles.map((principle) => (
          <li key={principle.title}>
            <h3 className="t-h4">{principle.title}</h3>
            <p className="mt-3 text-ink-soft">{principle.body}</p>
            <p className="t-meta mt-4 text-ink-soft">{principle.practice}</p>
          </li>
        ))}
      </ul>
      <p className="t-lede mt-16 max-w-[44ch] border-t border-rule pt-8">{approachClosing}</p>
    </Section>
  )
}
