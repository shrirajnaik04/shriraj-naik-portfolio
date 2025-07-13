"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface TechItem {
  name: string
  category: string
  description: string
  logo: string
}

export default function TechStackSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  const technologies: TechItem[] = [
    // Row 1
    { name: "Selenium IDE", category: "Testing", description: "Web automation testing framework", logo: "🔧" },
    { name: "Playwright", category: "Testing", description: "Modern web testing framework", logo: "🎭" },
    { name: "JMeter", category: "Testing", description: "Performance testing tool", logo: "⚡" },
    { name: "Testsigma", category: "Testing", description: "Cloud-based test automation", logo: "☁️" },
    { name: "TestProject", category: "Testing", description: "Free test automation platform", logo: "🧪" },
    { name: "Python", category: "Language", description: "Programming language for automation", logo: "🐍" },

    // Row 2
    { name: "Flask", category: "Framework", description: "Python web framework", logo: "🌶️" },
    { name: "Next.js", category: "Framework", description: "React production framework", logo: "▲" },
    { name: "Tailwind CSS", category: "Styling", description: "Utility-first CSS framework", logo: "🎨" },
    { name: "Docker Desktop", category: "DevOps", description: "Containerization platform", logo: "🐳" },
    { name: "Portainer", category: "DevOps", description: "Container management UI", logo: "📦" },
    { name: "Postman", category: "API", description: "API development platform", logo: "📮" },

    // Row 3
    { name: "Git", category: "Version Control", description: "Distributed version control", logo: "🔀" },
    { name: "Redis", category: "Database", description: "In-memory data structure store", logo: "🔴" },
    { name: "N8N", category: "Automation", description: "Workflow automation tool", logo: "🔗" },
    { name: "Opensearch", category: "Search", description: "Search and analytics engine", logo: "🔍" },
    { name: "Digital Ocean", category: "Cloud", description: "Cloud infrastructure provider", logo: "🌊" },
    { name: "Supabase", category: "Backend", description: "Open source Firebase alternative", logo: "⚡" },

    // Row 4
    { name: "MongoDB", category: "Database", description: "NoSQL document database", logo: "🍃" },
    { name: "MySQL", category: "Database", description: "Relational database management", logo: "🐬" },
    { name: "Together AI", category: "AI", description: "AI model inference platform", logo: "🤖" },
    { name: "SaaS RAG AI", category: "AI", description: "Retrieval-Augmented Generation", logo: "🧠" },
    { name: "MCP Context Engineering", category: "AI", description: "Context engineering framework", logo: "⚙️" },
    { name: "API Automation", category: "Testing", description: "Automated API testing", logo: "🔄" },
  ]

  return (
    <section id="tech" className="py-20 bg-slate-950" itemScope itemType="https://schema.org/TechArticle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" itemProp="headline">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto" itemProp="description">
            Cutting-edge tools and technologies powering modern QA automation and AI development
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onHoverStart={() => setHoveredTech(tech.name)}
              onHoverEnd={() => setHoveredTech(null)}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 lg:p-6 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tech.logo}
                </div>
                <h3 className="text-xs lg:text-sm font-semibold text-white mb-1">{tech.name}</h3>
                <p className="text-xs text-slate-400">{tech.category}</p>
              </div>

              {/* Tooltip - Only show on larger screens */}
              {hoveredTech === tech.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden lg:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white whitespace-nowrap z-10 shadow-lg"
                >
                  {tech.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-lg">And many more tools in my ever-expanding toolkit...</p>
        </motion.div>
      </div>
    </section>
  )
}
