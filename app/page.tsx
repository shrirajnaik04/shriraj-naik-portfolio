"use client"
import dynamic from "next/dynamic"
import HeroSection from "@/components/HeroSection"
// Fold optimization: dynamically import sections below initial viewport
const MetricsSection = dynamic(() => import("@/components/MetricsSection"), { loading: () => <div className="h-32" /> })
const AboutSection = dynamic(() => import("@/components/AboutSection"))
const TechStackSection = dynamic(() => import("@/components/TechStackSection"))
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"))
const AutomationSection = dynamic(() => import("@/components/AutomationSection"))
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"))
const ContactSection = dynamic(() => import("@/components/ContactSection"))
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
        <p>&copy; 2025 Shriraj Naik. All rights reserved.</p>
      </footer>
    </div>
  )
}
