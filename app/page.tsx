"use client"
import HeroSection from "@/components/HeroSection"
import MetricsSection from "@/components/MetricsSection"
import AboutSection from "@/components/AboutSection"
import TechStackSection from "@/components/TechStackSection"
import ProjectsSection from "@/components/ProjectsSection"
import AutomationSection from "@/components/AutomationSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ContactSection from "@/components/ContactSection"
import Navbar from "@/components/Navbar"
import ScrollProgress from "@/components/ScrollProgress"

export default function Home() {
  return (
    <div className="bg-slate-900 text-white overflow-x-hidden">
      <ScrollProgress />
      <Navbar />

      <main>
        <HeroSection />
        <MetricsSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <AutomationSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <footer className="bg-slate-950 py-8 text-center text-slate-400">
        <p>&copy; 2024 Shriraj Naik. All rights reserved.</p>
      </footer>
    </div>
  )
}
