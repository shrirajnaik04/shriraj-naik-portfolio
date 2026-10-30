# Harness

How this site is verified before it ships, what each check proves, and the trade-offs behind the
gates. The rule for every gate: **never bypass it** (no `--no-verify`, no skipped or loosened
assertions). A red result is a real defect, or a budget decision for the owner to make, never
something to silence.

## Commands

| Command | Proves |
|---|---|
| `pnpm verify` | ESLint, `tsc --noEmit` and the Vitest suites: content rules, copy style, confidentiality, contact endpoint, SEO and headers, dependency policy, architecture (exactly five client components: the menu, the theme switch, the contact form, the testimonial carousel and the drawings' motion gate), the claims of the "shrirajnaik.com" project, generated images, and the resume PDF. Runs before every commit (pre-commit hook). |
| `pnpm test:e2e` | Playwright against a fresh `next build && next start` on port 3100 (`CONTACT_TRANSPORT=stream`, so no mail is sent), on four engines: `chromium-desktop`, `chromium-mobile` (Pixel 7), `firefox-desktop`, `webkit-mobile` (iPhone 14). It covers navigation (every header and menu link, and every direct `/#section` load, lands on its section with smooth scrolling on), the skip link, the mobile menu, case studies and the 404, the contact form (success, validation, server error, rate limit, a too-quick send, errors clearing as fields are fixed, the honeypot staying out of autofill, no submission without JavaScript, real wiring), resume download and redirects, security headers and social tags. It also runs axe (WCAG 2.2 AA rules) on every route in light and dark, and checks reduced motion, no overflow at 320 px with 100 % and 200 % text (page, boxes and every line of text), schematic labels of 11 px or more at 390 px, a readable measure, no JavaScript, the resource budgets (all but the hidden-tab check, see Budgets) and the confidentiality scan. Tests see the page as a visitor does: nothing is pre-rendered for them. |
| `pnpm test:visual` | Full-page screenshot baselines (home at 360 / 768 / 1280 / 1920 px, Gym Daddy case study at 1280 px, light and dark). Baselines are win32-only (see below). |
| `pnpm resume:verify` | The committed resume PDF: size, A4 pages, title and language, tag tree (H1, H2 order, lists, links), outline, every line read in order by pdf.js and by `pdftotext`, no ligature, private-use or pictographic characters, embedded non-Type 3 fonts, exact link set, banned terms. |
| `pnpm assets:build` | Regenerates the resume PDF, `public/og.png` and `app/apple-icon.png` from content. Run it after changing the resume or profile content, then commit the outputs. The PDF's bytes change on every run (creation date), so commit it only when its content or template changed. |
| `pnpm perf` | Builds, serves on port 3100 and runs every performance gate (see Budgets). Needs a display: the hidden-tab check runs headed Chromium off-screen. |
| `pnpm audit:deps` | `osv-scanner` over the whole lockfile (triaged dev-only advisories in `osv-scanner.toml`, each with a reason and an expiry date), then `pnpm audit --prod` with no exceptions. |
| `pnpm audit:secrets` | `gitleaks` over the full git history. |
| `pnpm harness` | All of the above in order. The release gate. |

CI (`.github/workflows/ci.yml`, on pull requests and pushes to `main`) runs `pnpm verify`, the
Chromium end-to-end projects, `pnpm audit --prod` and osv-scanner. Firefox, WebKit, visual baselines,
`pnpm perf` and gitleaks run locally as part of `pnpm harness`.

## Setup

- `pnpm install` also sets `core.hooksPath` to `.githooks`, which enables the pre-commit gate.
- `pnpm exec playwright install` (browsers for the end-to-end, asset and perf scripts).
- `pdftotext` (poppler or xpdf) for the resume's second parser. CI installs `poppler-utils`; the test
  fails in CI without it and is skipped locally when it is missing.
- `osv-scanner` and `gitleaks` on `PATH` for the audits (CI downloads a pinned, checksum-verified
  osv-scanner).
- **Confidential terms.** Client and customer names and other banned terms live only in the git-ignored
  `.confidential-terms` file (one per line) and in the `CONFIDENTIAL_TERMS` repository secret (same
  format). No tracked file contains them. Without them the scans are skipped locally with a warning,
  and fail in CI by design.

## Budgets

| Budget | Gate | Measured by |
|---|---|---|
| Lighthouse performance ≥ 0.95, accessibility = 1, best practices ≥ 0.95, SEO = 1, CLS ≤ 0.02, TBT ≤ 100 ms | `lighthouserc.json` assertions, median of 3, `/` and `/work/gym-daddy` | Lighthouse mobile, **simulated** throttling |
| LCP ≤ 2,000 ms | `lighthouse.mjs --max-lcp 2000`: the median LCP of 3 runs | Lighthouse mobile, **applied** (devtools) throttling |
| App-owned script ≤ 20 KB gzip on top of the framework floor; CSS ≤ 15 KB; fonts ≤ 200 KB, preloaded ≤ 100 KB | `measure.ts --assert` | Bytes on the wire, recompressed (gzip and brotli); framework vs app split from `.next/build-manifest.json` |
| Idle main thread ≤ 50 ms per 10 s; no timers, animation frames or endless animations after load; heap ≤ 10 MB; heap growth ≤ 1 MB over 10 interaction cycles; hidden tab ≤ 10 ms per 10 s | `measure.ts --assert` (the hidden-tab check only in `pnpm perf`, which runs alone: under the parallel end-to-end load a background tab's page load spills into the window, 231 ms against 0.3–4.4 ms alone) | Raw CDP counters in Chromium |

LCP is gated on applied throttling (owner's decision, 2026-10-29). On localhost, Lighthouse's
simulation finishes every script before the first paint, which inflates simulated LCP (about 2.7 s
against about 1.8 s observed). The simulated value is still reported, as a warning, and is re-checked
on the Vercel preview, where it is meaningful. INP has no lab measurement; TBT stands in for it.

A budget miss is recorded and reported to the owner. Budgets are never loosened silently.

Lab numbers vary between runs on the same build (on 2026-10-30: applied LCP on `/` 1,791–1,968 ms,
simulated TBT on `/work/gym-daddy` 47–103 ms). A gate that fails once is re-run once; a second
failure is a real miss.

## Evidence

- `docs/evidence/2026-10-29/baseline.json`: the before state (production and local).
- `docs/evidence/2026-10-29/after.json`: the after state, with the budgets it was checked against.
- `docs/evidence/2026-10-29/raw/` (git-ignored): screenshots before and after, raw Lighthouse and
  measure output, resume page renders and `pdftotext` output.

## Trade-offs and known limits

- **CSP `'unsafe-inline'` for scripts.** The App Router inlines its RSC payload, and a nonce-based
  policy would force every page to render dynamically (no static HTML, no CDN cache). The site serves
  no user-generated HTML, and JSON-LD is escaped. Security headers are production-only;
  `upgrade-insecure-requests` is added only on Vercel (on http://localhost it would break assets).
- **Rate limiting is best effort.** The limiter (5 messages per IP per 10 minutes) lives in each
  serverless instance's memory, so separate instances count separately. The client IP is the first
  `x-forwarded-for` entry, which Vercel sets itself; behind another proxy it could be spoofed. The
  honeypot, the minimum fill time and the 24-hour expiry still apply. A platform rule (for example a
  Vercel Firewall rate limit) would make it global: check plan availability and cost first, since
  nothing paid is added without the owner's approval.
- **Visual baselines are win32-only.** Font rasterisation differs per OS, so baselines are committed
  for Windows and `test:visual` is not run in CI. Update them deliberately:
  `pnpm test:visual --update-snapshots`, then review every changed image.
- **Engines.** CI runs Chromium only; Firefox and WebKit run locally.
- **No `content-visibility`.** Skipping off-screen sections saved layout work (about 80 ms at 4×
  CPU throttling), but section links then scrolled to positions computed from placeholder heights
  and landed in the wrong section on every engine (WebKit has no scroll anchoring to correct it). It
  was removed; the navigation spec guards against its return. Cost: applied-throttling LCP on `/`
  rose from about 1.8 s to about 1.97 s (gate 2.0 s).
- **CSS is linked, not inlined.** `experimental.inlineCss` cut applied LCP on `/` to about 1.13 s,
  but Next.js also puts the CSS into every page's hydration payload, which pushed simulated TBT on
  `/work/gym-daddy` to about 100–108 ms (budget 100). Not enabled; the owner's call.
- **WebKit without JavaScript.** Playwright cannot scroll a JavaScript-disabled WebKit page to an
  off-screen element, so a pointer click misses. The no-JavaScript test opens the disclosure with the
  keyboard there (native behaviour either way); Chromium and Firefox use a click.
- **Dev-only advisories.** `osv-scanner.toml` lists advisories in development tooling (mostly
  Lighthouse CI), each traced with `pnpm why`, with a reason and an expiry date. They are never shipped;
  `pnpm audit --prod` has no exceptions.
