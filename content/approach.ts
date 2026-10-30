export interface Principle {
  title: string
  body: string
  /** The testing practice it belongs to (a label, not a claim about any one project). */
  practice: string
}

/** "How I test what I build": the general approach, not tied to any one project. */
export const principles: Principle[] = [
  {
    title: 'Put the guardrail where the damage is.',
    body: 'Data isolation, payments and permissions are protected at the deepest layer that can enforce them, usually the database, and that boundary gets its own tests. A check missed higher up should fail closed, not leak.',
    practice: 'Risk-based testing',
  },
  {
    title: 'Test the artifact you ship.',
    body: 'Checks run against what people actually get: the built app, the deployed page, the generated file, not only the source it came from. If what ships differs from what was tested, the release stops.',
    practice: 'Release validation',
  },
  {
    title: 'Treat hostile input as a fixture.',
    body: 'Malformed, oversized and malicious inputs sit in the test suite beside the happy path, so failures are handled by design instead of discovered in production.',
    practice: 'Negative and edge-case testing',
  },
  {
    title: 'Set budgets, then measure.',
    body: 'Speed, size, accessibility and running cost get numbers, and the release checks fail when one regresses, so quality can’t drift a little at a time.',
    practice: 'Performance and accessibility gates',
  },
  {
    title: 'Test the way people use it.',
    body: 'Key journeys run end to end in real browsers at phone, tablet and desktop sizes, with automated accessibility checks, because that’s where people find what unit tests miss.',
    practice: 'Cross-browser end-to-end testing',
  },
  {
    title: 'Every bug becomes a test.',
    body: 'A fix ships with the test that reproduces the bug, so the same defect can’t come back quietly in a later release.',
    practice: 'Regression coverage',
  },
]

/** Counts never carry a tool list: the tools changed over the years, and the counts span all of them. */
export const approachClosing =
  'At work, the same habits are behind 1,000+ automated test cases and 1,000+ API validations across FinTech releases.'
