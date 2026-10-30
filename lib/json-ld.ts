import { profile } from '@/content'
import { CLOUDINARY_BASE } from './cloudinary-loader'
import type { Project } from '@/content/types'
import { CONTENT_UPDATED, SITE_URL } from './site'

const LINE_SEPARATOR = String.fromCharCode(0x2028)
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029)
const PERSON_ID = `${SITE_URL}/#person`

/** JSON for an inline <script type="application/ld+json">, escaped so no value can close the element. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replaceAll(LINE_SEPARATOR, '\\u2028')
    .replaceAll(PARAGRAPH_SEPARATOR, '\\u2029')
}

export function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: `${SITE_URL}/`,
    image: `${CLOUDINARY_BASE}/f_auto,q_auto,c_fill,g_face,ar_1:1,w_400/${profile.portrait.src}`,
    jobTitle: 'SDET and QA Automation Engineer',
    sameAs: [profile.links.linkedin, profile.links.github],
    address: { '@type': 'PostalAddress', addressLocality: 'Goa', addressCountry: 'IN' },
  }
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: profile.name,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

export function articleJsonLd(project: Project) {
  const url = `${SITE_URL}/work/${project.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${project.name} case study`,
    description: project.summary,
    url,
    mainEntityOfPage: url,
    dateModified: CONTENT_UPDATED,
    author: { '@id': PERSON_ID },
  }
}
