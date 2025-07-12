"use client"

import { motion } from "framer-motion"
import { Code, Brain, Rocket, Shield } from "lucide-react"

export default function AboutSection() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-teal-400" />,
      title: "MCP Context Engineering",
      description: "Architecting frameworks that enable rapid AI development and testing",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "QA Automation Excellence",
      description: "Building scalable test frameworks with Selenium, Playwright, and JMeter",
    },
    {
      icon: <Code className="w-8 h-8 text-teal-400" />,
      title: "SaaS AI Development",
      description: "Creating production-grade chatbots and AI solutions",
    },
    {
      icon: <Rocket className="w-8 h-8 text-purple-400" />,
      title: "Rapid Innovation",
      description: "Delivering speed, accuracy, and real-world impact",
    },
  ]

  return (
    <section id="about" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
              <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                About Shriraj Naik
              </span>
            </h2>

            <div className="space-y-4 lg:space-y-6 text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                I specialize in architecting{" "}
                <strong className="text-teal-400">MCP Context Engineering Frameworks</strong> that enable{" "}
                <strong className="text-purple-400">Rapid AI Development and Testing</strong>.
              </p>

              <p>
                With a passion for innovation and excellence, I bridge the gap between traditional QA methodologies and
                cutting-edge AI technologies, creating solutions that transform how businesses approach quality
                assurance and artificial intelligence.
              </p>

              <p>
                My expertise lies in building scalable QA Automation Frameworks and production-grade SaaS AI Chatbots
                that deliver speed, accuracy, and real-world impact.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 lg:mt-8"
            >
              <motion.a
                href="/Shriraj_Naik_Resume.pdf"
                download="Shriraj_Naik_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-purple-600 px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
              >
                <span>Download Resume</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-4 lg:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-slate-800 p-4 lg:p-6 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="p-2 bg-slate-700 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm lg:text-base text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
