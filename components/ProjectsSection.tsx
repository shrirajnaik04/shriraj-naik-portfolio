"use client"

import { motion } from "framer-motion"
import {
  ExternalLink,
  Github,
  MessagesSquare,
  Radar,
  Boxes,
  Fingerprint,
  FlaskConical,
  ScanEye,
  Waypoints,
  CarFront,
  MessageSquareCode,
  type LucideIcon,
} from "lucide-react"
import Image from "next/image"

type IconName =
  | "MessagesSquare"
  | "Radar"
  | "Boxes"
  | "Fingerprint"
  | "FlaskConical"
  | "ScanEye"
  | "Waypoints"
  | "CarFront"
  | "MessageSquareCode"

type Accent = "teal" | "purple"

interface Project {
  title: string
  description: string
  tags: string[]
  image?: string
  iconName?: IconName
  accent?: Accent
  demoUrl?: string
  githubUrl?: string
}

const iconMap: Record<IconName, LucideIcon> = {
  MessagesSquare,
  Radar,
  Boxes,
  Fingerprint,
  FlaskConical,
  ScanEye,
  Waypoints,
  CarFront,
  MessageSquareCode,
}

const accentGradient: Record<Accent, string> = {
  teal: "from-teal-500/40 via-teal-600/20 to-slate-900",
  purple: "from-purple-500/40 via-purple-600/20 to-slate-900",
}

export default function ProjectsSection() {
  const projects: Project[] = [
    // Row 1 — Travel OTA family
    {
      title: "Travel OTA RAG Chatbot",
      description:
        "Streaming RAG chatbot on Gemini 2.0 Flash that surfaces AI-curated stay recommendations as property-card carousels — MongoDB Atlas vector search, Socket.IO support, embeddable Shadow-DOM widget.",
      tags: ["Generative AI", "RAG", "Google Gemini", "MongoDB Atlas", "Socket.IO"],
      iconName: "MessagesSquare",
      accent: "teal",
    },
    {
      title: "Travel OTA Agentic Outreach Pipeline",
      description:
        "Autonomous agent that mines property PDFs, enriches contacts via Playwright + Google AI Mode and composes personalized emails through a multi-provider LLM waterfall with delivery state tracking.",
      tags: ["Agentic AI", "Playwright", "LLM Composition", "Supabase", "Python"],
      iconName: "Radar",
      accent: "purple",
    },
    {
      title: "Travel OTA Real-Time Chat SDK",
      description:
        "Real-time host-guest messaging SDK for travel OTA platforms — Express + Socket.IO backend with a React component library, MongoDB + Redis unread tracking, content moderation and Redis-adapter horizontal scaling.",
      tags: ["Socket.IO", "Express", "React", "MongoDB", "Redis"],
      iconName: "MessageSquareCode",
      accent: "teal",
    },
    // Row 2 — Multi-tenant SaaS family
    {
      title: "Multi-Tenant SaaS Chatbot Platform",
      description:
        "Production SaaS where tenants upload PDFs and CSVs, train RAG bots over Qdrant + MongoDB, embed widgets and bill via Stripe webhooks with usage-based limits.",
      tags: ["Next.js", "RAG", "Qdrant", "Stripe", "Generative AI"],
      iconName: "Boxes",
      accent: "purple",
    },
    {
      title: "Multi-Tenant Gym Management SaaS",
      description:
        "Gym chain platform with PostgreSQL Row-Level Security data isolation, biometric attendance integration, subscription billing, GST invoicing and a Capacitor-wrapped mobile shell.",
      tags: ["Next.js", "Supabase", "Prisma", "Row-Level Security", "Capacitor"],
      iconName: "Fingerprint",
      accent: "teal",
    },
    {
      title: "Self-Drive Car Rental Marketplace",
      description:
        "Multi-tenant SaaS with customer, agency and super-admin portals, real-time booking lifecycle, Razorpay subscriptions, WhatsApp notifications and GST compliance.",
      tags: ["Next.js 15", "Express", "Prisma", "PostgreSQL", "Razorpay"],
      iconName: "CarFront",
      accent: "purple",
    },
    // Row 3 — QA & AI tooling family
    {
      title: "AI Powered Automation QA Framework",
      description:
        "Reverse-engineered an open-source AI low-code test platform to run fully locally — Spring Boot + Angular via Docker Compose, with a host-side local agent for real-browser Web, Mobile and API execution.",
      tags: ["Generative AI", "Playwright MCP", "Java Spring Boot", "Docker Compose", "Self-Hosted"],
      iconName: "FlaskConical",
      accent: "teal",
    },
    {
      title: "Vision-AI QA Platform",
      description:
        "Next-gen test automation that uses Vision-AI models (Florence-2 / GPT-4V) for element detection from screenshots — author tests in natural language and execute via Playwright.",
      tags: ["Vision AI", "FastAPI", "Playwright MCP", "Next.js", "Generative AI"],
      iconName: "ScanEye",
      accent: "purple",
    },
    {
      title: "MCP Context Engineering Framework",
      description:
        "Context-engineering framework that drives Agentic-AI test generation through Model Context Protocol — accelerates LLM evaluation and rapid AI delivery cycles.",
      tags: ["MCP", "Agentic AI", "Context Engineering", "Playwright MCP", "Python"],
      iconName: "Waypoints",
      accent: "teal",
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
            Showcasing flagship work in Agentic AI, Generative AI and modern QA automation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" itemProp="workExample">
          {projects.map((project, index) => {
            const Icon = project.iconName ? iconMap[project.iconName] : null
            const accent = project.accent ?? "teal"

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500/50 hover:shadow-[0_20px_50px_-12px_rgba(45,212,191,0.18)] transition-all duration-300 group"
                itemScope
                itemType="https://schema.org/SoftwareApplication"
              >
                <div className="relative overflow-hidden">
                  {project.image ? (
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
                  ) : (
                    <div
                      role="img"
                      aria-label={`${project.title} preview`}
                      className={`relative w-full h-40 lg:h-48 bg-gradient-to-br ${accentGradient[accent]} flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="relative z-10 w-14 h-14 lg:w-16 lg:h-16 text-white/90 drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)] transition-transform duration-500 ease-out group-hover:rotate-6"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 lg:p-6">
                  <h3
                    className="text-lg lg:text-xl font-bold text-white mb-3 transition-colors duration-300 leading-tight"
                    itemProp="name"
                  >
                    {project.title}
                  </h3>

                  <p className="text-slate-400 mb-4 leading-relaxed text-sm lg:text-base" itemProp="description">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 lg:px-3 lg:py-1 bg-slate-700 text-slate-300 text-xs lg:text-sm rounded-full border border-slate-600 hover:border-teal-500/40 hover:text-white transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {(project.demoUrl || project.githubUrl) && (
                    <div className="flex space-x-4">
                      {project.demoUrl && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
