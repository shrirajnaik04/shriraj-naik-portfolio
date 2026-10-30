import { Section } from '@/components/site/Section'
import { skillGroups } from '@/content'

/** A plain-text index: no logos, no ratings, QA groups first. */
export function Skills() {
  return (
    <Section id="tech" title="Skills">
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3 className="font-sans text-[0.9375rem] font-semibold">{group.name}</h3>
            <ul className="t-small mt-3 text-ink-soft max-sm:flex max-sm:flex-wrap max-sm:gap-x-[0.35em] sm:space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="max-sm:after:content-[','] max-sm:last:after:content-none">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
