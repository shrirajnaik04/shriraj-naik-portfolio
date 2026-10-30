import type { SkillGroup } from './types'

/** Plain-text groups, QA first. Every item is on the resume or verified in a project. */
export const skillGroups: SkillGroup[] = [
  {
    name: 'Test automation',
    items: ['Playwright (incl. Playwright MCP)', 'TestSigma', 'TestProject', 'Vitest', 'Jest', 'Detox', 'Maestro'],
  },
  {
    name: 'Agentic engineering',
    items: [
      'Parallel AI coding agents (Claude Code)',
      'Harness engineering',
      'Loop engineering',
      'Human-in-the-loop review',
      'AI agent guardrails',
      'Context engineering and MCP',
    ],
  },
  { name: 'API and performance', items: ['Postman', 'Supertest', 'JMeter', 'REST API validation'] },
  { name: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Kotlin', 'SQL'] },
  {
    name: 'Product engineering',
    items: ['Next.js', 'React', 'Node.js', 'Express', 'FastAPI', 'Flask', 'Socket.IO', 'Capacitor', 'Tauri'],
  },
  {
    name: 'Data',
    items: [
      'PostgreSQL (row-level security)',
      'Supabase',
      'Prisma',
      'MongoDB (Atlas Vector Search)',
      'Redis',
      'Qdrant',
      'MySQL',
      'OpenSearch',
    ],
  },
  {
    name: 'AI',
    items: ['LLM integration (Gemini, Groq, Together AI)', 'RAG', 'Vector search', 'MCP servers'],
  },
  { name: 'Delivery', items: ['Git', 'GitHub Actions', 'Jenkins', 'Docker', 'Portainer', 'Vercel', 'Railway', 'Sentry'] },
  {
    name: 'Practice',
    items: ['Test strategy and case design', 'Risk-based testing', 'Defect investigation', 'Release validation', 'Agile'],
  },
]
