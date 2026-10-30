import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/** Training crawlers are kept out; assistants fetching a page because a person asked may read it. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'ClaudeBot', 'anthropic-ai'], disallow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
