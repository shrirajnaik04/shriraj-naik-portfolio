import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { personJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { SITE_URL } from '@/lib/site'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Shriraj Naik — QA Automation Engineer & AI Product Engineer',
    template: '%s | Shriraj Naik',
  },
  description:
    'QA automation engineer with 4+ years in FinTech testing, who also builds and ships full-stack AI products. Case studies, experience and resume.',
  alternates: { canonical: '/' },
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
