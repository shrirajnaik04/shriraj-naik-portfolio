import type { MetadataRoute } from 'next'
import { getCaseStudySlugs } from '@/content'
import { CONTENT_UPDATED, SITE_URL } from '@/lib/site'

/** Canonical pages only (no #fragments), dated by the content review, so the file is stable across builds. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: CONTENT_UPDATED },
    ...getCaseStudySlugs().map((slug) => ({ url: `${SITE_URL}/work/${slug}`, lastModified: CONTENT_UPDATED })),
  ]
}
