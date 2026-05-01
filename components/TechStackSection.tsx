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
    // Row 1 — Modern AI
    { name: "Generative AI", category: "AI", description: "LLM-driven content & code generation", logo: "✨" },
    { name: "Agentic AI", category: "AI", description: "Autonomous goal-driven AI agents", logo: "🤖" },
    { name: "Vision AI", category: "AI", description: "Vision-model element detection for QA", logo: "👁️" },
    { name: "RAG", category: "AI", description: "Retrieval-Augmented Generation pipelines", logo: "🧠" },
    { name: "MCP Context Engineering", category: "AI", description: "Model Context Protocol for AI testing", logo: "⚙️" },
    { name: "Google Gemini", category: "AI", description: "Multimodal generative AI model", logo: "💎" },

    // Row 2 — AI platforms & QA tooling
    { name: "LM Studio", category: "Local AI", description: "Local LLM runtime & model playground", logo: "🖥️" },
    { name: "Playwright MCP", category: "Testing", description: "MCP-driven AI-native browser automation", logo: "🪄" },
    { name: "Playwright", category: "Testing", description: "Modern cross-browser test framework", logo: "🎭" },
    { name: "Upstash", category: "Serverless DB", description: "Serverless Redis & Kafka data layer", logo: "🚀" },
    { name: "Postman", category: "API", description: "API development & testing platform", logo: "📮" },
    { name: "Git", category: "Version Control", description: "Distributed version control", logo: "🔀" },

    // Row 3 — Frontend & languages
    { name: "Next.js", category: "Framework", description: "React production framework", logo: "▲" },
    { name: "TypeScript", category: "Language", description: "Type-safe JavaScript at scale", logo: "🟦" },
    { name: "Tailwind CSS", category: "Styling", description: "Utility-first CSS framework", logo: "🎨" },
    { name: "Claude Code", category: "AI Dev Tool", description: "Anthropic's agentic coding assistant", logo: "🪶" },
    { name: "Vercel", category: "Edge Cloud", description: "Frontend deployment & edge platform", logo: "🔼" },
    { name: "Socket.IO", category: "Real-time", description: "Real-time bi-directional events", logo: "🔌" },

    // Row 4 — Databases & backend
    { name: "Supabase", category: "Backend", description: "Postgres + auth backend platform", logo: "🟢" },
    { name: "Prisma", category: "ORM", description: "Type-safe database ORM", logo: "🔺" },
    { name: "PostgreSQL", category: "Database", description: "Relational database with RLS", logo: "🐘" },
    { name: "MongoDB", category: "Database", description: "NoSQL document database", logo: "🍃" },
    { name: "MySQL", category: "Database", description: "Relational database management", logo: "🐬" },
    { name: "Redis", category: "Database", description: "In-memory cache & data store", logo: "⚡" },

    // Row 5 — Vector store, infra & SaaS
    { name: "Qdrant", category: "Vector DB", description: "Vector search for RAG pipelines", logo: "🧬" },
    { name: "Docker Desktop", category: "DevOps", description: "Containerization platform", logo: "🐳" },
    { name: "Digital Ocean", category: "Cloud", description: "Cloud infrastructure provider", logo: "🌊" },
    { name: "N8N", category: "Automation", description: "Workflow automation engine", logo: "🔗" },
    { name: "Opensearch", category: "Search", description: "Search & analytics engine", logo: "🔍" },
    { name: "Railway", category: "Cloud Hosting", description: "Modern app deployment platform", logo: "🚄" },
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
