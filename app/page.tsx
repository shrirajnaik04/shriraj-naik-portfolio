import AboutSection from '@/components/AboutSection'
import AutomationSection from '@/components/AutomationSection'
import ContactSection from '@/components/ContactSection'
import HeroSection from '@/components/HeroSection'
import MetricsSection from '@/components/MetricsSection'
import ProjectsSection from '@/components/ProjectsSection'
import TechStackSection from '@/components/TechStackSection'
import TestimonialsSection from '@/components/TestimonialsSection'

/** Transitional: legacy sections are replaced in Tasks 6, 7 and 10. */
export default function Home() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      <AutomationSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
