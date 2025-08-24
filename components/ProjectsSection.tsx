"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

interface Project {
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl?: string
  githubUrl?: string
}

export default function ProjectsSection() {
  const projects: Project[] = [
    {
      title: "SaaS AI RAG Chatbot for Real-Time Interactions",
      description:
        "Built a production-ready chatbot with retrieval-augmented generation capabilities for enhanced customer support and real-time query resolution.",
      tags: ["Python", "Flask", "Together AI", "RAG", "Redis"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026124/saas-ai-chatbot_zqj3wu.png",
    },
    {
      title: "MCP Context Engineering Framework for Rapid AI Testing",
      description:
        "Developed a comprehensive framework for context engineering that accelerates AI model testing and validation processes.",
      tags: ["Python", "MCP", "AI Testing", "Automation", "Context Engineering"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026124/mcp-framework_zdkrxv.png",
    },
    {
      title: "Fintech QA Automation Suite",
      description:
        "Comprehensive testing suite for financial applications using multiple testing frameworks for maximum coverage and reliability.",
      tags: ["Selenium", "Playwright", "JMeter", "Postman", "Python"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026123/fintech-qa_dtrs39.png",
    },
    {
      title: "Rapid AI Automation Framework for Smart Testing",
      description:
        "Prototyping an AI-led framework that uses low-code scripting for fast, scalable test automation for beginner QA engineers.",
      tags: ["AI in QA", "Automation Frameworks", "Low-Code Scripting", "API Testing", "LLM Integration"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026124/api-automation_rmlodn.png",
    },
    {
      title: "QA Monitoring System with Opensearch and Redis",
      description:
        "Real-time monitoring and analytics system for QA processes using Opensearch for logging and Redis for caching.",
      tags: ["Opensearch", "Redis", "Monitoring", "Analytics", "Python"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026124/qa-monitoring_u0yoc9.png",
    },
    {
      title: "Multi-Tenant SaaS Gym Management Application",
      description:
        "A flexible SaaS Gym management application to manage memberships, staff, and payments across multiple gyms with modular customization.",
      tags: ["Next.js", "TypeScript", "Supabase" , "Multi-Tenant", "SaaS"],
  image: "https://res.cloudinary.com/dfvyqtli8/image/upload/f_auto,q_auto/v1756026124/flask-saas_dkt9fj.png",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-slate-900" itemScope itemType="https://schema.org/CreativeWork">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" itemProp="headline">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto" itemProp="description">
            Showcasing innovative solutions in QA automation and AI development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" itemProp="workExample">
          {projects.map((project, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group"
              itemScope
              itemType="https://schema.org/SoftwareApplication"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={640}
                  height={360}
                  className="w-full h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  placeholder="empty"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>

              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 transition-colors duration-300 leading-tight">
                  {project.title}
                </h3>

                <p className="text-slate-400 mb-4 leading-relaxed text-sm lg:text-base">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 lg:px-3 lg:py-1 bg-slate-700 text-slate-300 text-xs lg:text-sm rounded-full border border-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  {project.demoUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={project.demoUrl}
                      className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition-colors duration-200 text-sm lg:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Demo</span>
                    </motion.a>
                  )}

                  {project.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={project.githubUrl}
                      className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
