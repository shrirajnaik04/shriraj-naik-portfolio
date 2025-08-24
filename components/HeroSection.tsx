"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronRight, Award } from "lucide-react"

export default function HeroSection() {
  const [currentText, setCurrentText] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const texts = ["QA Automation Engineer", "Rapid AI Developer", "MCP Context Engineering Expert", "RAG AI Chatbot System Architect"]

  useEffect(() => {
    const currentFullText = texts[currentText]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentFullText.substring(0, displayText.length + 1))

          if (displayText === currentFullText) {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          setDisplayText(currentFullText.substring(0, displayText.length - 1))

          if (displayText === "") {
            setIsDeleting(false)
            setCurrentText((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentText, texts])

  return (
    <main>
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative dotted background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23334155' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8 order-2 lg:order-1"
          >
            {/* Award Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 rounded-full px-3 py-2 lg:px-4 lg:py-2"
            >
              <Award className="w-4 h-4 lg:w-5 lg:h-5 text-teal-400" />
              <span className="text-xs lg:text-sm text-slate-300">
                Quality Analyst of the Quarter - FinTech Company, Goa
              </span>
            </motion.div>

            <header>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Shriraj Naik
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-slate-400 mt-4"
                role="banner"
              >
                Building Scalable QA Frameworks and SaaS AI Chatbots for Rapid AI Development
              </motion.p>
            </header>

            {/* Typing Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl font-semibold"
            >
              <span className="text-teal-400">{">"} </span>
              <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                {displayText}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-teal-400"
              >
                |
              </motion.span>
            </motion.div>

            {/* CTA Buttons - Moved up in mobile order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 order-1 lg:order-none"
            >
              <motion.button
                onClick={() => {
                  const projectsSection = document.getElementById('projects')
                  projectsSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-purple-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full scale-0"
                  whileHover={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Explore My Work</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  contactSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden border-2 border-teal-500 text-teal-400 px-6 py-3 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-teal-500/20 rounded-full scale-0"
                  whileHover={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Contact Me</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Panel - Profile positioned slightly higher */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center order-1 lg:order-2 -mt-24 sm:-mt-20 lg:-mt-12"
          >
            {/* Profile Image */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 via-purple-500 to-teal-400 p-1"
              >
                <div className="w-full h-full rounded-full bg-slate-900"></div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl"
              >
                <Image
                  src="https://res.cloudinary.com/dfvyqtli8/image/upload/v1756014604/profile-image_kcrna3.png"
                  alt="Shriraj Naik - Professional QA Automation Engineer and AI Developer from Goa, India"
                  width={320}
                  height={320}
                  priority
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Updated Floating Tech Icons - Better positioned for mobile */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="absolute top-8 -left-4 sm:top-10 sm:-left-10 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-lg sm:text-xl lg:text-2xl">🎭</span>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute top-16 -right-4 sm:top-20 sm:-right-10 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-lg sm:text-xl lg:text-2xl">🤖</span>
            </motion.div>

            <motion.div
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              className="absolute bottom-16 -left-2 sm:bottom-20 sm:-left-5 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-lg sm:text-xl lg:text-2xl">⚙️</span>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY }}
              className="absolute bottom-8 -right-2 sm:bottom-10 sm:-right-5 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-lg sm:text-xl lg:text-2xl">🚀</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </section>
    </main>
  )
}
