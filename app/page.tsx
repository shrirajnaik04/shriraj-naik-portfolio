import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import TechStackSection from '@/components/TechStackSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import { Approach } from '@/components/sections/Approach'
import { Hero } from '@/components/sections/Hero'
import { Work } from '@/components/sections/Work'

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Approach />
      {/* Transitional: Tasks 7 and 10 replace these. Hidden so only the new design shows; anchors stay. */}
      <div hidden>
        <AboutSection />
        <TechStackSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    </>
  )
}
