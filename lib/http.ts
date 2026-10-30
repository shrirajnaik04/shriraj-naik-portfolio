import { RESUME_PATH } from './site'

/**
 * Response headers for every route. 'unsafe-inline' for scripts is a deliberate trade-off: the
 * App Router inlines its RSC payload, and a nonce-based policy would force every page to render
 * dynamically (no static HTML, no CDN cache). The site serves no user-generated HTML, and JSON-LD
 * is escaped. `upgrade-insecure-requests` is added only where the site is served over HTTPS
 * (Vercel); on http://localhost it would rewrite same-origin asset URLs to https and break them.
 */
export function securityHeaders({ vercel }: { vercel: boolean }): { key: string; value: string }[] {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://res.cloudinary.com",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(vercel ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
  return [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ]
}

/** The old download URL keeps working (permanently moved); /resume is a memorable alias. */
export function redirects() {
  return [
    { source: '/SHRIRAJ%20NAIK%20-%20QA%20Analyst%20III.pdf', destination: RESUME_PATH, permanent: true },
    { source: '/resume', destination: RESUME_PATH, permanent: false },
  ]
}
