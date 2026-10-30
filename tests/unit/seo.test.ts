import type { MetadataRoute } from 'next'
import { describe, expect, test } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { CONTENT_UPDATED, RESUME_PATH, SITE_URL } from '@/lib/site'
import { redirects, securityHeaders } from '@/lib/http'

const rules = (r: MetadataRoute.Robots) => (Array.isArray(r.rules) ? r.rules : [r.rules])
const disallowsAll = (r: MetadataRoute.Robots, bot: string) =>
  rules(r).some((rule) => [rule.userAgent].flat().includes(bot) && [rule.disallow].flat().includes('/'))

describe('sitemap and robots', () => {
  test('sitemap lists the canonical pages with a stable date', () => {
    const entries = sitemap()
    expect(entries.map((e) => e.url)).toEqual([SITE_URL, `${SITE_URL}/work/gym-daddy`, `${SITE_URL}/work/printsaathi`])
    expect(new Set(entries.map((e) => String(e.lastModified)))).toEqual(new Set([CONTENT_UPDATED]))
  })

  test('training crawlers are blocked; user-initiated assistants may read the site', () => {
    const r = robots()
    for (const bot of ['GPTBot', 'CCBot', 'Google-Extended', 'ClaudeBot', 'anthropic-ai']) expect(disallowsAll(r, bot), bot).toBe(true)
    for (const bot of ['ChatGPT-User', 'Claude-User']) expect(disallowsAll(r, bot), bot).toBe(false)
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe('security headers', () => {
  const csp = (vercel: boolean) => securityHeaders({ vercel }).find((h) => h.key === 'Content-Security-Policy')!.value

  test('the content security policy has every directive', () => {
    for (const directive of [
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
    ])
      expect(csp(false)).toContain(directive)
  })

  test('upgrade-insecure-requests only where the site is served over HTTPS (Vercel)', () => {
    expect(csp(true)).toContain('upgrade-insecure-requests')
    expect(csp(false)).not.toContain('upgrade-insecure-requests')
  })

  test('the other hardening headers', () => {
    const headers = Object.fromEntries(securityHeaders({ vercel: true }).map((h) => [h.key, h.value]))
    expect(headers).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
    })
  })
})

describe('redirects', () => {
  test('the legacy resume URL moves permanently; /resume stays a temporary alias', () => {
    expect(redirects()).toEqual([
      { source: '/SHRIRAJ%20NAIK%20-%20QA%20Analyst%20III.pdf', destination: RESUME_PATH, permanent: true },
      { source: '/resume', destination: RESUME_PATH, permanent: false },
    ])
  })
})
