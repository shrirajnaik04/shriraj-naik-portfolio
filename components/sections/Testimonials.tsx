import { Section } from '@/components/site/Section'
import { testimonials } from '@/content'
import { TestimonialCarousel } from './TestimonialCarousel'

/** Tech professionals' words, verbatim, in a carousel that pauses for the visitor; no stars. Quote marks are typographic only. */
export function Testimonials() {
  return (
    <Section id="testimonials" title="What tech professionals say" surface="deep">
      <TestimonialCarousel items={testimonials} labelledBy="testimonials-title" />
    </Section>
  )
}
