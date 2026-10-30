import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { personJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, socialMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  ...socialMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/', type: 'website' }),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1efe9' },
    { media: '(prefers-color-scheme: dark)', color: '#101827' },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [personJsonLd(), websiteJsonLd()] }} />
      </body>
    </html>
  )
}
