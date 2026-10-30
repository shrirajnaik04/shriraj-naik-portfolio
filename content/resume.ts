import { earlierJobs, jobs } from './experience'
import { profile } from './profile'
import { projects } from './projects'

/** Text, optionally linked. */
export type ResumeText = string | { text: string; href: string }

/** A line set as `name | meta | meta`: the name in the heading weight, the meta regular. */
export interface ResumeEntry {
  name: string
  meta: ResumeText[]
  bullets?: string[]
}

export type ResumeSection =
  | { heading: string; kind: 'text'; text: string }
  | { heading: string; kind: 'labelled'; lines: { label: string; text: string }[] }
  | { heading: string; kind: 'experience'; employers: (ResumeEntry & { roles: ResumeEntry[] })[] }
  | { heading: string; kind: 'entries'; entries: ResumeEntry[] }
  | { heading: string; kind: 'bullets'; bullets: string[] }

export interface Resume {
  /** The PDF's document title, shown by viewers and read by applicant tracking systems. */
  documentTitle: string
  name: string
  headline: string
  contact: ResumeText[][]
  sections: ResumeSection[]
}

/** `https://www.example.com/path/` → `example.com/path` */
const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const linked = (href: string): ResumeText => ({ text: display(href), href })
const gymDaddySite = projects.find((p) => p.slug === 'gym-daddy')!.links[0].href

/**
 * The resume, single column and ATS-first. Based on the Sep 2026 resume (Desktop PDF), with the
 * changes agreed on 2026-10-29: one tool removed, the combined headline, verified projects added,
 * and volunteer work, higher secondary and the 2023 programme restored from the earlier version.
 * Experience and earlier roles are the website's own content, so the two cannot drift apart.
 */
export const resume: Resume = {
  documentTitle: 'Shriraj Naik - SDET | QA Automation Engineer - Resume',
  name: 'SHRIRAJ NAIK',
  headline: 'SDET | QA Automation Engineer | Test Automation, API Testing & Full-Stack AI Product Development',
  contact: [
    ['Vasco da Gama, Goa, India', profile.phone, { text: profile.email, href: `mailto:${profile.email}` }],
    [linked(profile.links.site), linked(profile.links.linkedin), linked(profile.links.github)],
  ],
  sections: [
    {
      heading: 'PROFESSIONAL SUMMARY',
      kind: 'text',
      text: 'SDET / QA Automation Engineer with 4+ years of QA experience building and scaling automated testing for FinTech and SaaS products. Hands-on with Playwright, Python, JavaScript, Postman, Supertest, JMeter, Jenkins, Docker, Git/GitHub, and relational/NoSQL databases. Delivered 1,000+ automated test cases and 1,000+ API validations across releases, with experience creating maintainable automation suites, validating UI and back-end workflows, and improving test feedback in Agile delivery. Currently focused on AI-assisted QA, Generative AI, Agentic AI, and MCP-based testing approaches to accelerate test design, execution, and analysis. Also designs, builds and ships full-stack products, including Gym Daddy, a multi-tenant SaaS in production guarded by 1,200+ automated test files.',
    },
    {
      heading: 'TECHNICAL SKILLS',
      kind: 'labelled',
      lines: [
        {
          label: 'Automation & Test Engineering',
          text: 'Playwright, Playwright MCP, TestSigma, TestProject, test framework design, UI/E2E automation',
        },
        {
          label: 'Programming & API Testing',
          text: 'Python, JavaScript, TypeScript, Postman, Supertest, REST API validation, Flask',
        },
        {
          label: 'Performance & CI/CD',
          text: 'JMeter, Jenkins, GitHub Actions, Docker, Docker Desktop, Portainer, Git, GitHub',
        },
        { label: 'Databases & Data Validation', text: 'MySQL, PostgreSQL, MongoDB, Redis, Supabase' },
        {
          label: 'AI-Enhanced QA',
          text: 'Generative AI, Agentic AI, MCP Context Engineering, AI vision-based QA prototyping, RAG/SaaS chatbot validation',
        },
        {
          label: 'Product Engineering',
          text: 'Next.js, React, Node.js, Express, FastAPI, PostgreSQL row-level security, Prisma, Capacitor, Tauri',
        },
        {
          label: 'Ways of Working',
          text: 'Agile, test case design, test analysis, defect investigation, release validation, cross-functional collaboration',
        },
      ],
    },
    {
      heading: 'PROFESSIONAL EXPERIENCE',
      kind: 'experience',
      employers: jobs.map((job) => ({
        name: job.company,
        meta: [job.location, job.period],
        roles: job.roles.map((role) => ({ name: role.title, meta: [role.period], bullets: role.bullets })),
      })),
    },
    {
      heading: 'PROJECTS',
      kind: 'entries',
      entries: [
        {
          name: 'Gym Daddy: Multi-Tenant Gym Management SaaS',
          meta: ['Founder & Sole Engineer', '2025 – Present', linked(gymDaddySite)],
          bullets: [
            'Built with Next.js, TypeScript, Supabase PostgreSQL row-level security and Prisma, with Android (Capacitor) and desktop (Tauri) apps, ZKTeco biometric attendance and GST invoicing.',
            'Guarded by 1,200+ automated test files (unit, API, RLS/RBAC and Playwright end-to-end) and 7 GitHub Actions CI workflows.',
          ],
        },
        {
          name: 'FinTech QA Automation Suite',
          meta: ['CodeMax IT Solutions'],
          bullets: [
            'Built and maintained automation coverage for financial applications using Playwright, JMeter, Postman, and automated API verification, with emphasis on repeatability, regression confidence, and maintainability.',
          ],
        },
        {
          name: 'PrintSaathi: Offline Android App for Print Shops',
          meta: ['Sole Engineer', '2026'],
          bullets: [
            'Preact and TypeScript UI on Capacitor, with a Kotlin engine that parses customer files in an isolated, permission-less process; release builds ship without internet permission, verified on the built APK.',
            'Tested with Vitest, Playwright with axe, and Android instrumentation tests across Android 7–16 emulators, with enforced bundle budgets and a pre-commit verification gate; trials in real print shops are next.',
          ],
        },
        {
          name: 'AI Concierge & Messaging for a Travel Booking Platform',
          meta: ['Client Engagement', '2026'],
          bullets: [
            'Streaming RAG chat widget (Shadow DOM embed, MongoDB Atlas Vector Search, Gemini 2.0 Flash with Groq and xAI fallback) and a real-time host–guest messaging SDK (Express, Socket.IO, MongoDB, Redis); mobile QA gates with Detox and Maestro.',
          ],
        },
        {
          name: 'VisionQA: Natural-Language Test Authoring',
          meta: ['2026'],
          bullets: [
            'Natural-language test steps mapped to Playwright actions by a rule-based executor (Next.js, FastAPI, Node agent, Redis, Docker Compose), with a vision-model element locator designed to reduce dependence on brittle DOM selectors.',
          ],
        },
      ],
    },
    {
      heading: 'ACHIEVEMENTS',
      kind: 'bullets',
      bullets: [
        'Spotlight Award of the Quarter (Jul – Sep 2024): recognized as Quality Analyst of the Quarter for contributions and impact in QA Automation.',
      ],
    },
    {
      heading: 'CERTIFICATIONS',
      kind: 'bullets',
      bullets: [
        'Mastering Generative AI for Software Testers & QA – LinkedIn Learning',
        'Advanced QA Bootcamp – Crio.Do',
        'Introduction to Clean Testing – TestSigma',
        'AWS Builder Online Series',
        'National Leadership Programme for Self-Transformation – Sri Sathya Sai Organization (2023)',
      ],
    },
    {
      heading: 'EDUCATION',
      kind: 'entries',
      entries: [
        { name: 'Bachelor of Computer Applications (BCA)', meta: ['Don Bosco College, Panjim, Goa', '2018 – 2021'] },
        { name: 'Higher Secondary', meta: ['MES College, Zuarinagar', '2016 – 2018'] },
      ],
    },
    {
      heading: 'ADDITIONAL EXPERIENCE',
      kind: 'entries',
      entries: earlierJobs.map((job) => ({ name: job.title, meta: [job.company, job.period] })),
    },
    {
      heading: 'VOLUNTEER EXPERIENCE',
      kind: 'labelled',
      lines: [
        {
          label: 'Member, Sri Sathya Sai Seva Organizations India',
          text: 'led disaster management, road safety, CPR, and fire safety awareness events.',
        },
      ],
    },
    { heading: 'LANGUAGES', kind: 'text', text: 'English | Hindi | Konkani' },
  ],
}

export const plainText = (t: ResumeText): string => (typeof t === 'string' ? t : t.text)
export const entryLine = (e: ResumeEntry): string => [e.name, ...e.meta.map(plainText)].join(' | ')

function sectionLines(section: ResumeSection): string[] {
  switch (section.kind) {
    case 'text':
      return [section.text]
    case 'labelled':
      return section.lines.map((l) => `${l.label}: ${l.text}`)
    case 'bullets':
      return section.bullets
    case 'entries':
      return section.entries.flatMap((e) => [entryLine(e), ...(e.bullets ?? [])])
    case 'experience':
      return section.employers.flatMap((e) => [
        entryLine(e),
        ...e.roles.flatMap((r) => [entryLine(r), ...(r.bullets ?? [])]),
      ])
  }
}

/** The resume as plain lines, in reading order: what a parser should get back from the PDF. */
export function resumeTextLines(r: Resume = resume): string[] {
  return [
    r.name,
    r.headline,
    ...r.contact.map((line) => line.map(plainText).join(' | ')),
    ...r.sections.flatMap((s) => [s.heading, ...sectionLines(s)]),
  ]
}
