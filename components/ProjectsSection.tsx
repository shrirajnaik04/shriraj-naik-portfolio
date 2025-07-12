"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

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
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "MCP Context Engineering Framework for Rapid AI Testing",
      description:
        "Developed a comprehensive framework for context engineering that accelerates AI model testing and validation processes.",
      tags: ["Python", "MCP", "AI Testing", "Automation", "Context Engineering"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Fintech QA Automation Suite",
      description:
        "Comprehensive testing suite for financial applications using multiple testing frameworks for maximum coverage and reliability.",
      tags: ["Selenium", "Playwright", "JMeter", "Postman", "Python"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Postman API Automation with Docker Pipelines",
      description:
        "Automated API testing pipeline integrated with Docker containers for consistent and scalable testing environments.",
      tags: ["Postman", "Docker", "CI/CD", "API Testing", "Automation"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "QA Monitoring System with Opensearch and Redis",
      description:
        "Real-time monitoring and analytics system for QA processes using Opensearch for logging and Redis for caching.",
      tags: ["Opensearch", "Redis", "Monitoring", "Analytics", "Python"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Flask-Based SaaS AI Chatbot Deployment",
      description:
        "Scalable chatbot deployment solution using Flask and Together AI for enterprise-level AI applications.",
      tags: ["Flask", "Together AI", "SaaS", "Deployment", "Scalability"],
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Showcasing innovative solutions in QA automation and AI development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-500 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-lg font-semibold flex items-center space-x-2 shadow-lg text-sm lg:text-base"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors duration-300 leading-tight">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
