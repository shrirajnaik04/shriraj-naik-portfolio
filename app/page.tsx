import ContactSection from '@/components/ContactSection'
import { About } from '@/components/sections/About'
import { Approach } from '@/components/sections/Approach'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { Work } from '@/components/sections/Work'

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Approach />
      <Experience />
      <About />
      <Skills />
      <Testimonials />
      {/* Transitional: Task 10 replaces this. Hidden so only the new design shows; the anchor stays. */}
      <div hidden>
        <ContactSection />
      </div>
    </>
  )
}
