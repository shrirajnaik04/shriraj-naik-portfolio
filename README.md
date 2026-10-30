# shrirajnaik.com

The portfolio of Shriraj Naik, SDET and QA automation engineer who also builds and ships full-stack
products. Live at [www.shrirajnaik.com](https://www.shrirajnaik.com).

It is a statically generated site that has to pass its own tests before it ships: accessibility on
every route, performance and resource budgets, and a check that every claim the site makes about
itself is backed by the code or a measurement.

## What's inside

- **Pages:** the home page (work, approach, how I build with AI agents, experience, about, skills,
  testimonials, contact) and two case studies, `/work/gym-daddy` and `/work/printsaathi`. All of them are static HTML.
- **Content:** typed data in `content/*.ts`. The pages, the resume PDF and the social image are all
  generated from it.
- **One server endpoint:** `POST /api/contact`. It checks the content type, caps the body size,
  accepts same-origin requests only, rate-limits per IP, catches bots with a honeypot and a timing
  check, and HTML-escapes everything it emails.
- **Five small client components:** the mobile menu, the theme switch, the contact form, the testimonial
  carousel and the gate that runs the drawings' motion only while they're on screen. Everything else is
  a React Server Component.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Nodemailer. Tests use Vitest,
Playwright (Chromium, Firefox and WebKit) with axe, and Lighthouse CI. Packages are managed with
pnpm; the site is hosted on Vercel.

## Run it locally

You need Node 24 (or 22.13+) and pnpm 11.

```bash
pnpm install                  # also enables the pre-commit check
pnpm exec playwright install   # browsers for the tests and the asset build
pnpm dev                      # http://localhost:3000
```

The contact form sends mail through SMTP. Copy `.env.example` to `.env.local` and fill it in to send
real messages; without it, the form shows an error and sends nothing.

## Checks

| Command | What it runs |
|---|---|
| `pnpm verify` | ESLint, the TypeScript compiler and the unit tests. Runs before every commit. |
| `pnpm test:e2e` | Playwright against a production build, on four browser and device profiles. |
| `pnpm test:visual` | Screenshot comparisons (baselines are Windows-only). |
| `pnpm resume:verify` | Parses the resume PDF and checks its structure, text and links. |
| `pnpm perf` | Lighthouse and resource budgets on a production build. |
| `pnpm audit:deps`, `pnpm audit:secrets` | Dependency advisories and a secret scan of the git history. |
| `pnpm harness` | All of the above, in order: the release check. |

[HARNESS.md](HARNESS.md) explains what each check proves, the budgets and the known limits.

## Editing content

- **Site text** lives in `content/*.ts`. Unit tests guard the house style (for example, no project
  status labels and no unverifiable claims) and the facts the site states about itself.
- **The resume** is `content/resume.ts`. After changing it, run `pnpm assets:build` to regenerate
  `public/resume/Shriraj-Naik-QA-Automation-Engineer-Resume.pdf`, the social image and the Apple icon,
  then commit them. `pnpm test` fails while the committed PDF and the content disagree.
