"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { TestTube, Zap, Bot, Cog } from "lucide-react"

interface MetricCardProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  delay: number
}

function MetricCard({ icon, value, label, suffix = "", delay }: MetricCardProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0
        const end = value
        const duration = 2000
        const increment = end / (duration / 16)

        const counter = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(counter)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)

        return () => clearInterval(counter)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isInView, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 lg:p-3 bg-gradient-to-r from-teal-500/20 to-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <motion.div
          animate={{ rotate: isInView ? 360 : 0 }}
          transition={{ duration: 1, delay: delay / 1000 }}
          className="w-2 h-2 bg-teal-400 rounded-full"
        />
      </div>

      <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>

      <div className="text-slate-400 text-base lg:text-lg">{label}</div>
    </motion.div>
  )
}

export default function MetricsSection() {
  const metrics = [
    {
      icon: <TestTube className="w-8 h-8 text-teal-400" />,
      value: 1000,
      label: "Automated Test Cases Executed",
      suffix: "+",
      delay: 200,
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      value: 500,
      label: "API Test Validations Completed",
      suffix: "+",
      delay: 400,
    },
    {
      icon: <Bot className="w-8 h-8 text-teal-400" />,
      value: 5,
      label: "SaaS AI Chatbots Delivered",
      suffix: "+",
      delay: 600,
    },
    {
      icon: <Cog className="w-8 h-8 text-purple-400" />,
      value: 8,
      label: "QA Frameworks Engineered",
      suffix: "+",
      delay: 800,
    },
  ]

  return (
    <section className="py-20 bg-slate-950" itemScope itemType="https://schema.org/Person">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" itemProp="description">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              My Journey in Numbers
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Delivering excellence through automation, innovation, and cutting-edge AI solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </section>
  )
}
