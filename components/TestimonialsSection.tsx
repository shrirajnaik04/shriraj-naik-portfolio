"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      name: "Tanaji Hemant Naik",
      role: "Senior Technical Program Manager",
      company: "Amazon Web Services",
      content:
        "Shriraj's approach of AI in QA is both exciting and forward-thinking. His custom frameworks reflect a deep understanding of automation and innovation in testing. Truly impressive work—he’s clearly pushing boundaries in the QA space.",
      rating: 5,
    },
    {
      name: "Marcelino Fernandes",
      role: "QA Automation Team Lead",
      company: "FinTech Company",
      content:
        "Shriraj has scripted 500+ test scripts across diverse projects, showcasing strong technical acumen and quick adaptability. He has integrated AI tools seamlessly into his workflow. He proactively upskills, stays updated with industry trends, and has explored MCPs, web development, and AI chatbots. Always eager to learn, he embraces challenges and feedback with a growth mindset.",
      rating: 5,
    },
    {
      name: "Shashankh Naik",
      role: "QA Automation Team Lead",
      company: "FinTech Company",
      content:
        "Working with Shriraj Naik has been a privilege. As a QA, he delivers thorough, high-quality test cases and consistently uncovers critical bugs others might miss. Reliable and detail-oriented, he meets every deadline and takes full ownership. A natural leader, he confidently manages the QA team when needed. Beyond work, Shriraj is a supportive, trustworthy friend who brings both brilliance and warmth to the team—an invaluable asset to the workplace.",
      rating: 5,
    },
    {
      name: "Sankalp Kalangutkar",
      role: "Software and AI Engineer",
      company: "BIZ Nest, Goa",
      content:
        "Shriraj is a highly skilled QA Automation Engineer with a sharp focus on AI-driven automation in the fintech space. His ability to blend quality assurance with development makes him a standout contributor. He’s proactive, detail-oriented, and consistently brings innovative solutions to the table. A true asset to any tech team.",
      rating: 5,
    },
  ]

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">What industry leaders say about working with me</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 xl:p-12 rounded-2xl border border-slate-700 shadow-2xl h-[500px] sm:h-[450px] lg:h-[400px] xl:h-[450px] flex flex-col justify-between overflow-hidden"
          >
            {/* Stars */}
            <div className="flex justify-center mb-4 lg:mb-6 flex-shrink-0">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current" />
              ))}
            </div>

            {/* Quote - Scrollable content area */}
            <div className="flex-1 flex items-center justify-center px-2">
              <blockquote className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 text-center leading-relaxed overflow-y-auto max-h-full">
                "{testimonials[currentIndex].content}"
              </blockquote>
            </div>

            {/* Author */}
            <div className="text-center flex-shrink-0 mt-4">
              <div className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1">{testimonials[currentIndex].name}</div>
              <div className="text-teal-400 font-medium text-sm lg:text-base">{testimonials[currentIndex].role}</div>
              <div className="text-slate-400 text-xs sm:text-sm lg:text-base">{testimonials[currentIndex].company}</div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-4 sm:mt-6 lg:mt-8 space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-3 bg-slate-800 rounded-full border border-slate-700 hover:border-teal-500/50 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-teal-400" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-teal-400 scale-125" : "bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-3 bg-slate-800 rounded-full border border-slate-700 hover:border-teal-500/50 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-teal-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
