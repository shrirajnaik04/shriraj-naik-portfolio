export interface Practice {
  title: string
  body: string
  /** Where the practice can be seen; every line is backed by this repository. */
  evidence: string
}

/** "How I build with AI agents": agentic engineering, the way every project here is built. */
export const agenticIntro =
  'I’m an AI optimist, and I build like one: with several AI coding agents at once. They write the code; I design the loop they work in, the harness that tests every change and the guardrails they can’t cross, and I stay in the loop to review and sign off.'

export const practices: Practice[] = [
  {
    title: 'Agentic engineering',
    body: 'AI coding agents work in parallel on separate parts of a task, and independent agents review the result from different angles (engineering, security, design) before I accept it.',
    evidence: 'This site, built with Claude Code',
  },
  {
    title: 'Context engineering',
    body: 'Agents start from the project’s written rules and map the blast radius before they change anything: the pages, APIs, data, permissions and tests a change can touch. Through the Playwright MCP server they open the app in a real browser and check their own work at several screen sizes.',
    evidence: 'This site: HARNESS.md, the rules every change follows',
  },
  {
    title: 'Loop engineering',
    body: 'Every task runs the same loop: requirement, plan, build, real test, evidence, adversarial review, fix, re-test, regression check, self-audit, then an explicit close. A failed check sends the work back, never forward.',
    evidence: 'This site’s commit history',
  },
  {
    title: 'Harness engineering',
    body: 'Agents work inside a test harness that decides what can ship: lint, types, unit and end-to-end tests on three browser engines, accessibility, performance budgets and confidentiality checks. A green run is required, but it isn’t proof on its own: I still check what tests can’t see.',
    evidence: 'This site: one harness command, a pre-commit gate and CI',
  },
  {
    title: 'Guardrails',
    body: 'Hard limits the agents can’t argue past: secret scanning, a check that keeps client names off public pages, no paid service without my approval, and no access to production.',
    evidence: 'This site: secret, dependency and confidentiality checks',
  },
  {
    title: 'Cost and resource budgets',
    body: 'A product with no revenue yet has to run on free tiers, so every change is weighed against its database, cache and hosting bill, and against the CPU, memory and battery it takes from the visitor’s device.',
    evidence: 'This site: idle CPU, background-tab and memory budgets in every performance run',
  },
  {
    title: 'Human in the loop',
    body: 'Agents propose and I decide. Plans, designs, budgets and anything that can’t be undone, such as a merge, a deploy or a public claim, wait for my review and sign-off.',
    evidence: 'This site: nothing ships without my approval',
  },
]
