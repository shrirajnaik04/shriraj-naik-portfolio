export interface Principle {
  title: string
  body: string
  /** Which work the principle is drawn from. */
  evidence: string
}

/** "How I test what I build". Every sentence is backed by the claims evidence. */
export const principles: Principle[] = [
  {
    title: 'Put the guardrail where the damage is.',
    body: 'In Gym Daddy, tenant isolation lives in the database through Postgres row-level security, not only in application code. The gym ID comes from the session, never from the request, so one missed filter can’t expose another gym’s members.',
    evidence: 'Gym Daddy',
  },
  {
    title: 'Test the artifact you ship.',
    body: 'PrintSaathi’s release check reads the built APK’s binary manifest: no internet permission, not debuggable, no backups. It fails if the APK is older than its sources.',
    evidence: 'PrintSaathi',
  },
  {
    title: 'Treat hostile input as a fixture.',
    body: 'Malformed and hostile PDFs are part of PrintSaathi’s test suite. They’re parsed in an isolated, permission-less process that can crash without taking the app down.',
    evidence: 'PrintSaathi',
  },
  {
    title: 'Set budgets, then measure.',
    body: 'PrintSaathi caps its JavaScript at 60 KB gzipped. This site’s release checks fail if its accessibility, performance or bundle budgets regress.',
    evidence: 'PrintSaathi and this site',
  },
]

/** Counts never carry a tool list: the tools changed over the years, and the counts span all of them. */
export const approachClosing =
  'At work, the same habits are behind 1,000+ automated test cases and 1,000+ API validations across FinTech releases.'
