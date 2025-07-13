"use client"

import { motion } from "framer-motion"
import { Play, Zap, Cog, TrendingUp } from "lucide-react"

export default function AutomationSection() {
  const automationFeatures = [
    {
      icon: <Play className="w-8 h-8 text-teal-400" />,
      title: "Playwright MCP Executions",
      description: "Advanced test executions with context engineering for rapid AI development",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Dockerized Postman Pipelines",
      description: "Containerized API testing pipelines for consistent and scalable automation",
    },
    {
      icon: <Cog className="w-8 h-8 text-teal-400" />,
      title: "Opensearch QA Monitoring",
      description: "Real-time logging and monitoring of QA processes with advanced analytics",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      title: "Performance Optimization",
      description: "Continuous improvement of testing frameworks and AI model performance",
    },
  ]

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden" itemScope itemType="https://schema.org/Service">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" itemProp="name">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Automation That Drives Rapid AI Development
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto" itemProp="description">
            Leveraging cutting-edge automation technologies to accelerate AI development and testing processes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Features */}
          <div className="space-y-6 lg:space-y-8">
            {automationFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 lg:space-x-6 group"
              >
                <div className="p-2 lg:p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700 group-hover:border-teal-500/50 transition-all duration-300 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 rounded-2xl border border-slate-700">
              {/* Mock Terminal */}
              <div className="bg-slate-950 rounded-lg p-4 lg:p-6 font-mono text-xs lg:text-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-400 ml-2 lg:ml-4 text-xs lg:text-sm">automation-pipeline</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-400">$</span>
                    <span className="break-all">playwright test --project=mcp-context</span>
                  </div>
                  <div className="text-green-400">✓ MCP Context Engineering Tests: 45 passed</div>

                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-teal-400">$</span>
                    <span className="break-all">docker run postman-api-tests</span>
                  </div>
                  <div className="text-green-400">✓ API Automation Suite: 120 tests passed</div>

                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-teal-400">$</span>
                    <span className="break-all">opensearch-dashboards --qa-monitoring</span>
                  </div>
                  <div className="text-green-400">✓ QA Metrics Dashboard: Active</div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            onClick={() => {
              const contactForm = document.getElementById('contact-form')
              contactForm?.scrollIntoView({ behavior: 'smooth' })
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-teal-500 to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 group"
          >
            <span>Let's Collaborate</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="ml-2 inline-block"
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
