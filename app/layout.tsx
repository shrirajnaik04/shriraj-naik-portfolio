import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { MotionGate } from '@/components/site/MotionGate'
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
  colorScheme: 'light',
  themeColor: '#f1efe9',
}

/** Applies a remembered dark theme before first paint (light is the default). Kept tiny and inline. */
const THEME_SCRIPT = `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.dataset.theme='dark';document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content='#101827'})}}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The theme script may set data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <MotionGate />
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [personJsonLd(), websiteJsonLd()] }} />
      </body>
    </html>
  )
}
