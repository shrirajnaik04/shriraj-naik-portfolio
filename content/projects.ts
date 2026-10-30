import type { Project } from './types'

/**
 * Every fact traces to the private claims evidence (re-verified 2026-10-29) or to the resume.
 * Client work is anonymized: no names, domains, links or screenshots. No per-project status labels.
 */
export const projects: Project[] = [
  {
    slug: 'gym-daddy',
    name: 'Gym Daddy',
    summary: 'Multi-tenant gym management SaaS for gym chains, in daily use at gyms.',
    role: 'Creator and sole engineer',
    period: '2025 – Present',
    problem:
      'Gym chains run members, payments, biometric check-in and GST invoicing across branches, and one gym’s data must never reach another.',
    built: [
      'Client and admin portals in Next.js 16 and TypeScript',
      'Supabase Postgres with row-level security per gym, and Prisma migrations',
      'ZKTeco/ADMS biometric attendance and GST invoicing',
      'Android (Capacitor 8) and desktop (Tauri 2) apps from the same codebase',
      'Sentry monitoring and separate dev, staging and production environments on Railway',
    ],
    verified: [
      '1,200+ automated test files across unit, API, RLS/RBAC and Playwright end-to-end suites',
      'Gym ID taken from the session only, never from the request',
      'Payment atomicity pinned by a dedicated security test',
      '7 GitHub Actions workflows',
      'Verification scripts for accessibility, layout shift and network resilience',
    ],
    stack: ['Next.js 16', 'TypeScript', 'Supabase Postgres (RLS)', 'Prisma', 'Capacitor', 'Tauri', 'Sentry', 'Railway'],
    links: [{ label: 'gymdaddy.in', href: 'https://www.gymdaddy.in', kind: 'site' }],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'gym-daddy',
      caption: 'Each request takes the gym ID from the session, and row-level security holds the same line in the database.',
    },
    caseStudy: {
      context: [
        'Gym Daddy is a multi-tenant SaaS for gym chains: one platform serves many gyms, each with its own branches, members, staff, payments and attendance devices. I built it alone, from the data model to the release pipeline, and gyms use it every day at gymdaddy.in.',
        'A front desk uses it all day to register members, record payments, check people in through fingerprint devices and issue GST invoices. Gym owners see what is happening across their branches; a separate admin portal runs the platform itself.',
      ],
      constraints: [
        'One gym’s members, payments and attendance must never be visible to another gym, even if a query in application code is wrong.',
        'A payment and everything that depends on it must be written together or not at all.',
        'Front desks run on whatever they have: a browser, an Android device or a desktop computer.',
        'Attendance comes from ZKTeco fingerprint devices that push records over their own protocol (ADMS).',
      ],
      decisions: [
        {
          title: 'Isolate tenants in the database, not only in application code',
          why: 'Application filters are easy to forget in one query out of hundreds. Postgres row-level security makes the database refuse cross-gym reads and writes, so a missed filter fails closed instead of leaking data.',
          tradeoff:
            'Every table and migration needs policies, and policy mistakes are harder to spot than code mistakes, so the RLS rules have their own tests.',
        },
        {
          title: 'Take the gym ID from the session, and allow-list writable fields',
          why: 'A gym ID sent in a request body can be edited by anyone with browser dev tools. Taking it only from the authenticated session, and accepting only allow-listed fields on writes, closes off tenant spoofing and mass assignment.',
          tradeoff:
            'Platform-admin features that legitimately work across gyms can’t reuse those routes; they need separate, explicitly authorized paths.',
        },
        {
          title: 'Record each payment through one atomic database function',
          why: 'A payment touches several records at once. Doing the work inside one database function means it either completes fully or not at all, and a dedicated security test pins that behaviour so a refactor can’t quietly break it.',
          tradeoff: 'Logic in SQL is harder to read and refactor than application code, so changes to it are fewer and more deliberate.',
        },
        {
          title: 'One codebase, three shells: web, Android and desktop',
          why: 'Gyms run their front desks on whatever hardware they have. Capacitor and Tauri wrap the same Next.js application, so a fix ships to all three.',
          tradeoff: 'Native capabilities differ per shell, and each shell needs its own build and release workflow.',
        },
        {
          title: 'Separate dev, staging and production, with error monitoring',
          why: 'Gyms depend on the system every day. Staging gives changes somewhere realistic to run before production, and Sentry reports errors from real use so they can be fixed before an owner has to report them.',
          tradeoff: 'Three environments cost more to run and keep in sync than one.',
        },
      ],
      quality: [
        '1,200+ automated test files cover unit logic, API routes, row-level security and role permissions, and end-to-end flows in Playwright.',
        'Seven GitHub Actions workflows run the test and end-to-end suites, the Android and desktop builds, and releases.',
        'Dedicated verification scripts check accessibility (axe), layout shift and behaviour on poor networks.',
      ],
      whereItStands: [
        'In production at gymdaddy.in, used by gyms every day, and still changing every week (last change: October 2026).',
      ],
      next: ['Generate row-level security tests from the schema, so a new table can’t ship without policy coverage.'],
      architecture:
        'Web, Android and desktop clients share one Next.js application. Each request takes the gym ID from the session, and Postgres row-level security enforces the same boundary in the database. Fingerprint devices push attendance over ADMS. Dev, staging and production run on Railway, with Sentry reporting errors.',
    },
  },
  {
    slug: 'travel-chat',
    name: 'AI travel chat assistant',
    summary:
      'An embeddable chat for a travel booking platform: guests describe the stay they want, it searches the listings by meaning, streams a short answer and shows matching stays as swipeable cards.',
    role: 'Sole engineer',
    period: '2026 – Present',
    context: 'Client project, anonymized',
    note: 'Runs on the platform’s website.',
    built: [
      'Listing search with MongoDB Atlas Vector Search, kept current by a change-stream worker; results are narrowed to the place asked for, and stays booked on the guest’s dates go last',
      'Streaming answers from Gemini 2.0 Flash that only see the stays the search found, falling back to Groq, then xAI, when Gemini runs out of quota',
      'A one-script-tag widget isolated in Shadow DOM, with a swipeable carousel of stay cards',
      'A live support tab over Socket.IO: agent assignment, typing, read receipts, ratings and transcripts',
      'Cost controls: an admin off switch that fails safe, per-minute and daily limits, and input caps',
    ],
    verified: [
      'About 158 scripted checks, 111 of them against the real support service on a local MongoDB replica set, with forced race conditions',
    ],
    verificationGap: 'The checks are run by hand: no CI yet, and no automated check of answer quality.',
    stack: ['TypeScript', 'Next.js 15', 'React 19', 'Socket.IO', 'MongoDB Atlas Vector Search', 'Gemini 2.0 Flash', 'Groq', 'xAI', 'Railway'],
    links: [],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'travel-chat',
      caption:
        'The model only sees the stays the search found, so it can’t recommend one that doesn’t exist; when Gemini runs out of quota, Groq and then xAI answer instead.',
    },
  },
  {
    slug: 'fintech-qa',
    name: 'FinTech QA automation',
    summary: 'UI, API and performance test automation for financial products, run across releases.',
    role: 'QA engineer, Software Quality Analyst to QA Analyst III',
    period: '2022 – Present',
    context: 'Employer work at a FinTech company',
    problem:
      'Financial products change with every release, and each release needs its user flows, APIs and data checked the same way every time.',
    built: [
      '1,000+ automated test cases and 1,000+ API validations across FinTech releases',
      'UI, API, end-to-end and performance coverage, built with Playwright, Postman and Supertest, JMeter and TestSigma',
      'Data checks across PostgreSQL, Redis and OpenSearch',
      'Repeatable execution, monitoring and reporting with Jenkins, Docker, Portainer, Redis and OpenSearch',
      'AI-assisted and MCP-based testing approaches in the QA R&D division',
    ],
    verified: [
      'Run across multiple releases, helping teams find defects earlier',
      'Spotlight Award of the Quarter (Jul – Sep 2024), as Quality Analyst of the Quarter',
    ],
    stack: ['Playwright', 'TestSigma', 'Postman', 'Supertest', 'JMeter', 'Jenkins', 'Docker', 'OpenSearch'],
    links: [],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'fintech-qa',
      caption: 'A generalized view of the coverage layers, not a diagram of any one product’s pipeline.',
    },
  },
  {
    slug: 'printsaathi',
    name: 'PrintSaathi',
    summary: 'Offline Android app that turns WhatsApp photos, passport photos, ID cards and PDFs into correct prints.',
    role: 'Sole engineer',
    period: '2026',
    note: 'Tested on Android 7–16 emulators; trials in real print shops are next, and it isn’t on the Play Store yet.',
    problem:
      'Small print-shop owners who only know WhatsApp need correct prints without Word, image editors or printer knowledge.',
    built: [
      'Preact, Vite and TypeScript UI in Capacitor 8',
      'Kotlin native engine that runs in an isolated, permission-less process',
      'pdf.js for documents, with passport-photo sizing and ID-card copy flows',
    ],
    verified: [
      'Release APK manifest checked from the built binary: no internet permission, not debuggable, no backups',
      'Hostile and malformed PDF fixtures in the test suite',
      'Pre-commit verify gate and bundle budgets (JS ≤ 60 KB, CSS ≤ 15 KB gzipped)',
      'Emulator matrix from Android 7 to Android 16 (API 24–36)',
      'Playwright with axe accessibility checks; about 195 test files',
    ],
    stack: ['Preact', 'TypeScript', 'Vite', 'Capacitor', 'Kotlin', 'pdf.js', 'Vitest', 'Playwright'],
    links: [],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'printsaathi',
      caption: 'Everything stays on the phone, and untrusted files are opened in an isolated process with no permissions.',
    },
    caseStudy: {
      context: [
        'Small print shops receive customers’ photos, passport photos, ID cards and PDFs over WhatsApp. The person at the counter often isn’t comfortable with Word, image editors or printer settings, and a wrong print wastes paper and the customer’s time.',
        'PrintSaathi is an Android app that takes those files straight from WhatsApp’s share sheet and turns them into correct prints in a few taps. It works offline, with no accounts and no server.',
      ],
      constraints: [
        'Customer files are private: ID cards, passport photos and password-protected PDFs such as e-Aadhaar.',
        'Files can be malformed or hostile, and the app has to survive them.',
        'Shops use low-end phones, so size and speed matter.',
        'Screens have to be plain: English without jargon, text up to 200 %, screen-reader support and a button for every gesture.',
      ],
      decisions: [
        {
          title: 'No server, no accounts, no internet permission',
          why: 'The safest customer data is data that never leaves the phone. Release builds don’t request the internet permission at all, so nothing can be uploaded, and there is nothing to host or pay for.',
          tradeoff: 'No cloud backup, sync or remote crash reports; problems have to be reproduced from the shop’s description.',
        },
        {
          title: 'Parse untrusted files in an isolated, permission-less process',
          why: 'Customer PDFs and images are opened in a separate Android process that has no permissions. A broken or hostile file can crash that process, never the app.',
          tradeoff: 'Data has to cross a process boundary, which adds latency and code for passing results back.',
        },
        {
          title: 'Verify the shipped artifact, not just the source',
          why: 'A release check reads the built APK’s binary manifest: no internet permission, not debuggable, no backups, only the expected components exported. It fails if the APK is older than its sources, so a stale build can’t slip through.',
          tradeoff:
            'The check depends on Android build tools, so it runs on the build machine rather than as a quick unit test.',
        },
        {
          title: 'Performance budgets for low-end phones',
          why: 'The interface is Preact on Vite, held to 60 KB of JavaScript and 15 KB of CSS gzipped. The budgets are checked in the build, so growth is a decision rather than an accident.',
          tradeoff: 'Fewer ready-made libraries fit inside the budget, so more of the interface is written by hand.',
        },
        {
          title: 'Designed for shopkeepers who only use WhatsApp',
          why: 'Files arrive through WhatsApp’s share sheet, screens use plain English, text scales to 200 % and every gesture also has a button.',
          tradeoff: 'Big, plain screens show less at once, so some flows take a few more taps.',
        },
      ],
      quality: [
        'About 195 test files: Vitest unit and property tests, Playwright end-to-end tests with axe accessibility checks, and Android instrumentation tests.',
        'A pre-commit hook runs lint, type checks and the unit tests, so a failing commit is blocked.',
        'Device scripts exercise sharing, process kills and privacy rules on emulators; the canonical matrix spans Android 7 to Android 16.',
      ],
      whereItStands: [
        'Built and tested on Android 7–16 emulators. Validation on a shopkeeper’s own phone and a shop printer comes next, and it isn’t on the Play Store yet.',
      ],
      next: ['Validate with a real shop, on the shopkeeper’s own phone and printer, before anything else.'],
      architecture:
        'Everything runs on the phone, and the release build has no internet permission. Files arrive from WhatsApp’s share sheet; the interface lays them out and previews them; untrusted files are parsed in an isolated engine process with no permissions; finished pages go to Android’s print service.',
    },
  },
  {
    slug: 'travel-messaging',
    name: 'Guest and host messaging service',
    summary:
      'The real-time messaging behind a travel booking platform’s guest–host inbox: instant messages, correct unread counts, and a blocker that stops people swapping phone numbers or payment details to take a booking off the platform.',
    role: 'Sole engineer',
    period: '2026',
    context: 'Client project, anonymized',
    built: [
      'An Express and Socket.IO server with sign-in, typing indicators, read receipts and quoted replies; each message is saved in a MongoDB transaction, so retries are safe',
      'Unread counts kept in MongoDB and cached in Redis, correct even when a read and a new message arrive together',
      'A contact-detail blocker that catches spelled-out, disguised or split phone numbers, emails, links and payment IDs',
      'A Redis adapter so it can run on more than one server, with a safe fallback when Redis is down',
    ],
    verified: [
      '9 Jest test files (about 115 tests) against a real in-memory MongoDB replica set and real Socket.IO clients',
      'A 226-case test corpus for the contact-detail blocker',
    ],
    verificationGap: 'The tests run locally; there is no CI test pipeline yet.',
    stack: ['TypeScript', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'Redis', 'Zod', 'Jest', 'Docker', 'Railway'],
    links: [],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'travel-messaging',
      caption:
        'A message carrying contact details is blocked before anything is saved; an allowed one is saved with the unread counts in one transaction, then delivered.',
    },
  },
  {
    slug: 'rag-chatbot-saas',
    name: 'RAG chatbot builder',
    summary:
      'Multi-tenant SaaS: each business uploads its own documents and gets a chatbot for its website that answers from them.',
    role: 'Sole engineer',
    period: '2025',
    built: [
      'PDF and CSV uploads, split into chunks and stored as vectors in a Qdrant collection named for the business; deleting a document deletes its vectors too',
      'Answers from Gemini, with the most relevant passages from the business’s documents, falling back to Together AI when Gemini fails',
      'An embeddable chat widget that gets a signed token for one business, so every chat searches that business’s documents',
      'Admin and client portals, with businesses, documents and chat logs in MongoDB',
    ],
    verified: [],
    verificationGap: 'No automated tests yet, and not tested in production use.',
    stack: ['Next.js', 'TypeScript', 'Qdrant', 'MongoDB', 'Gemini', 'Together AI'],
    links: [],
    tier: 'featured',
    publish: true,
    schematic: {
      kind: 'rag-chatbot',
      caption:
        'Each chat carries a signed token for one business, and the search reads that business’s documents; if Gemini fails, Together AI answers instead.',
    },
  },
  {
    slug: 'driveops',
    name: 'DriveOps',
    summary: 'Multi-tenant self-drive car rental platform.',
    role: 'Sole engineer',
    period: '2026',
    built: [
      'Customer, agency and admin web apps in Next.js',
      'Express API with Prisma on Supabase Postgres, hardened with Helmet, rate limiting, a CORS allow-list and environment validation',
      'WhatsApp notifications through Twilio',
    ],
    verified: ['Playwright end-to-end test for tenant isolation'],
    stack: ['Next.js', 'Express', 'Prisma', 'Supabase Postgres', 'Twilio', 'Playwright'],
    links: [],
    tier: 'more',
    publish: true,
  },
  {
    slug: 'visionqa',
    name: 'VisionQA',
    summary:
      'A web app for writing browser tests as plain-English steps; a local agent turns each step into a Playwright action and runs it in Chromium.',
    role: 'Sole engineer',
    period: '2026',
    built: [
      'Test-management web app in Next.js, with Prisma and PostgreSQL',
      'A Node agent that picks up queued runs and executes them with Playwright',
      'About 160 sentence patterns mapped to Playwright actions, plus REST steps and if/else and loop blocks',
    ],
    verified: [],
    verificationGap:
      'Checked by hand on a practice site, with a handful of unit tests so far. Finding elements by vision, as the name suggests, isn’t built yet.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Node.js', 'Playwright'],
    links: [],
    tier: 'more',
    publish: true,
  },
  {
    slug: 'local-test-platform',
    name: 'Fully local test automation platform',
    summary:
      'A test automation platform made to run entirely on my own machine, with no cloud: built from source, its browser recorder reverse-engineered to work with the local server, and my own agent running the tests in installed browsers.',
    role: 'Sole engineer',
    period: '2025',
    context: 'Built on an open-source codebase',
    built: [
      'My own local agent in Java (about 2,300 lines) that finds installed browsers, picks up queued runs and executes them, with no cloud calls',
      'The minified Chrome recorder reverse-engineered: server endpoints that answer its calls, so recording works against the local server',
      'A Docker Compose setup that builds the server and web app from source, with a setup guide',
      'Fixes for runs stuck in the queue and for duplicate browser windows caused by a race, each with its root cause written down',
      'A headless-run option, and a check that an agent is online before a run starts',
    ],
    verified: [],
    verificationGap: 'Checked by hand on real browser runs; no automated tests yet, and parts of the recorder work are unfinished.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Docker Compose', 'nginx'],
    links: [],
    tier: 'more',
    publish: true,
  },
  {
    slug: 'this-portfolio',
    name: 'shrirajnaik.com',
    summary: 'This site: a statically generated portfolio that has to pass its own tests before it ships.',
    role: 'Designer and engineer',
    period: '2025 – Present',
    built: [
      'Next.js 16 App Router with Server Components; only the menu, the theme switch, the contact form, the testimonial carousel and the drawings’ motion gate run in the browser',
      'Contact endpoint with origin checks, rate limiting, a honeypot and HTML escaping',
      'ATS resume PDF and social image generated from the same typed content as the pages',
    ],
    verified: [
      'Playwright end-to-end suite on Chromium, Firefox and WebKit, with automated axe checks (WCAG 2.2 AA rules) in light and dark',
      'Lighthouse and resource budgets: performance, accessibility, script size, idle CPU, and no motion running off-screen',
      'Copy, confidentiality and resume checks on every commit',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Playwright', 'Vitest', 'Lighthouse CI'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/shrirajnaik04/shriraj-naik-portfolio', kind: 'repo' }],
    tier: 'more',
    // Every sentence above is traced to code, tests or measurements in tests/unit/portfolio-claims.test.ts.
    publish: true,
  },
]
