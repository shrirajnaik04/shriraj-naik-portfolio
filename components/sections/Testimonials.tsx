import { Section } from '@/components/site/Section'
import { testimonials } from '@/content'

/** Colleagues' words, verbatim and static: no carousel, no stars. Quote marks are typographic only. */
export function Testimonials() {
  return (
    <Section id="testimonials" title="What colleagues say" surface="deep">
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.name} className="flex flex-col">
            <blockquote className="quote mb-6 font-display text-[1.1875rem] leading-[1.55] text-pretty">{t.quote}</blockquote>
            <figcaption className="mt-auto border-t border-rule pt-4">
              <span className="block font-semibold">{t.name}</span>
              <span className="t-small block text-ink-soft">
                {t.role}, {t.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
