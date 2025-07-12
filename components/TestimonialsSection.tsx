"use client"

import { motion } from "framer-motion"
import { useState } from "react"
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
      name: "Rishabh Garg",
      role: "CTO",
      company: "FinTech Solutions Pvt Ltd",
      content:
        "Shriraj's QA automation frameworks transformed our testing processes. His expertise in MCP context engineering and AI-driven testing reduced our testing cycles by 60% while improving accuracy.",
      rating: 5,
    },
    {
      name: "Vardha Naik",
      role: "CMO",
      company: "Majestic Escape India",
      content:
        "The SaaS AI chatbot developed by Shriraj exceeded our expectations. The rapid development approach and seamless integration with our existing systems was remarkable.",
      rating: 5,
    },
    {
      name: "Abhishek Gupta",
      role: "Engineering Director - QA",
      company: "Global Tech Solutions",
      content:
        "Working with Shriraj on API automation was a game-changer. His Docker-based testing pipelines and Postman integrations streamlined our entire development workflow.",
      rating: 5,
    },
    {
      name: "Priya S.",
      role: "QA Lead",
      company: "Digital Innovations Ltd",
      content:
        "Shriraj's approach to combining traditional QA with AI technologies is innovative. His frameworks are not just efficient but also future-ready and scalable.",
      rating: 5,
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Client Testimonials
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
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 xl:p-12 rounded-2xl border border-slate-700 shadow-2xl"
          >
            {/* Stars */}
            <div className="flex justify-center mb-4 lg:mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg lg:text-xl xl:text-2xl text-slate-300 text-center leading-relaxed mb-6 lg:mb-8">
              "{testimonials[currentIndex].content}"
            </blockquote>

            {/* Author */}
            <div className="text-center">
              <div className="text-lg lg:text-xl font-semibold text-white mb-1">{testimonials[currentIndex].name}</div>
              <div className="text-teal-400 font-medium text-sm lg:text-base">{testimonials[currentIndex].role}</div>
              <div className="text-slate-400 text-sm lg:text-base">{testimonials[currentIndex].company}</div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
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
