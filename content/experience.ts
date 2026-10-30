import type { EarlierJob, Job } from './types'

/** Wording from the resume (Desktop PDF, Sep 2026), with one tool removed by request. */
export const jobs: Job[] = [
  {
    company: 'FinTech Company',
    location: 'Goa, India',
    period: 'Jun 2022 – Present',
    roles: [
      {
        title: 'QA Analyst III',
        period: 'Oct 2025 – Present',
        bullets: [
          'Core member of the QA R&D function, driving automation architecture and AI-assisted testing initiatives for FinTech products.',
          'Design and evolve scalable testing approaches across UI, API, end-to-end, and performance layers using Playwright, Postman/Supertest, and JMeter.',
          'Partner with developers, analysts, and stakeholders in Agile delivery to improve testability, surface risk early, and strengthen release confidence.',
          'Evaluate Generative AI, Agentic AI, and MCP-based workflows to improve test generation, maintenance, analysis, and QA productivity.',
        ],
        highlights: [
          'Core member of the QA R&D function, driving automation architecture and AI-assisted testing initiatives for FinTech products.',
          'Design and evolve scalable testing approaches across UI, API, end-to-end, and performance layers using Playwright, Postman/Supertest, and JMeter.',
        ],
      },
      {
        title: 'QA Analyst II (Automation)',
        period: 'Jun 2025 – Oct 2025',
        bullets: [
          'Led QA automation initiatives focused on maintainable frameworks and high-value regression coverage.',
          'Integrated Playwright UI automation, API validation, and SaaS AI chatbot testing into end-to-end QA pipelines.',
          'Developed MCP context-engineering approaches for rapid AI-centric testing and validation across multiple QA touchpoints.',
        ],
        highlights: [
          'Led QA automation initiatives focused on maintainable frameworks and high-value regression coverage.',
          'Integrated Playwright UI automation, API validation, and SaaS AI chatbot testing into end-to-end QA pipelines.',
        ],
      },
      {
        title: 'Software Quality Analyst',
        period: 'Sep 2022 – Jun 2025',
        bullets: [
          'Delivered 1,000+ automated test cases and 1,000+ API validations across multiple releases, helping teams detect defects earlier and ship with higher confidence.',
          'Built scalable automated coverage using Playwright, TestSigma, JMeter, and Python/JavaScript-based tooling.',
          'Performed API and integration validation with Postman/Supertest and data checks across PostgreSQL, Redis, and OpenSearch environments.',
          'Used Jenkins, Docker, Git, Portainer, Redis, and OpenSearch to support repeatable QA execution, monitoring, and reporting.',
        ],
        highlights: [
          'Delivered 1,000+ automated test cases and 1,000+ API validations across multiple releases, helping teams detect defects earlier and ship with higher confidence.',
          'Used Jenkins, Docker, Git, Portainer, Redis, and OpenSearch to support repeatable QA execution, monitoring, and reporting.',
        ],
      },
    ],
  },
]

/** Newest first. */
export const earlierJobs: EarlierJob[] = [
  { company: 'Muthoot Finance Ltd.', title: 'Junior Relationship Executive', period: '2021 – 2022' },
  {
    company: 'Indian Coast Guard Air Store Depot, INS Hansa, Goa',
    title: 'Desktop Support Technician',
    period: '2019 – 2021',
  },
]
