import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "Shriraj Naik | QA Automation & AI Engineer Portfolio",
  description: "Shriraj Naik - Expert QA Automation Engineer, AI Developer, and MCP Context Engineering Specialist. Building scalable QA frameworks, RAG AI chatbots, and enterprise automation solutions. Contact Shriraj for QA consulting and AI development services.",
  keywords: [
    "Shriraj Naik",
    "Shriraj Naik QA Engineer", 
    "Shriraj Naik Portfolio",
    "QA Automation Engineer",
    "AI Developer",
    "MCP Context Engineering",
    "RAG AI Chatbot",
    "Selenium Automation",
    "Playwright Testing",
    "Python Developer",
    "Flask Developer",
    "QA Consultant",
    "Test Automation Expert",
    "Goa India",
    "Software Testing Professional"
  ].join(", "),
  authors: [{ name: "Shriraj Naik", url: "https://shrirajnaik.dev" }],
  creator: "Shriraj Naik",
  publisher: "Shriraj Naik",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Add your Google Search Console verification
  },
  alternates: {
    canonical: 'https://shrirajnaik.dev',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shrirajnaik.dev",
    title: "Shriraj Naik | QA Automation & AI Engineer Portfolio",
    description: "Expert QA Automation Engineer and AI Developer specializing in MCP Context Engineering, RAG AI Chatbots, and enterprise automation solutions.",
    siteName: "Shriraj Naik Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/dfvyqtli8/image/upload/v1756014604/profile-image_kcrna3.png",
        width: 1200,
        height: 630,
        alt: "Shriraj Naik - QA Automation & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shriraj Naik | QA Automation & AI Engineer",
    description: "Expert QA Automation Engineer and AI Developer from Goa, India. Specializing in enterprise testing solutions and AI chatbot development.",
  images: ["https://res.cloudinary.com/dfvyqtli8/image/upload/v1756014604/profile-image_kcrna3.png"],
    creator: "@ShrirajNaik", // Add your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "Portfolio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://shrirajnaik.dev/#person",
        "name": "Shriraj Naik",
        "givenName": "Shriraj",
        "familyName": "Naik",
        "url": "https://shrirajnaik.dev",
        "image": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dfvyqtli8/image/upload/v1756014604/profile-image_kcrna3.png",
          "width": 400,
          "height": 400
        },
        "sameAs": [
          "https://www.linkedin.com/in/shriraj-naik-494421154/",
          "https://github.com/shrirajnaik04",
          "mailto:nykshriraj4nov@gmail.com"
        ],
        "jobTitle": "QA Automation & AI Engineer",
        "description": "Expert QA Automation Engineer and AI Developer specializing in MCP Context Engineering, RAG AI Chatbots, and enterprise automation solutions.",
        "knowsAbout": [
          "QA Automation",
          "AI Development", 
          "MCP Context Engineering",
          "RAG AI Chatbots",
          "Selenium",
          "Playwright",
          "Python",
          "Flask",
          "Test Automation"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Educational Institution" // Add your education details
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Goa",
          "addressCountry": "India"
        },
        "telephone": "+91 9764904641",
        "email": "nykshriraj4nov@gmail.com"
      },
      {
        "@type": "WebSite",
        "@id": "https://shrirajnaik.dev/#website",
        "url": "https://shrirajnaik.dev",
        "name": "Shriraj Naik Portfolio",
        "description": "Professional portfolio of Shriraj Naik - QA Automation Engineer, AI Developer, and MCP Context Engineering Expert",
        "publisher": {
          "@id": "https://shrirajnaik.dev/#person"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://shrirajnaik.dev/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://shrirajnaik.dev/#service",
        "name": "Shriraj Naik QA Automation Services",
        "provider": {
          "@id": "https://shrirajnaik.dev/#person"
        },
        "serviceType": "QA Automation & AI Development",
        "description": "Professional QA automation, AI chatbot development, and MCP context engineering services",
        "areaServed": "Global",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "QA & AI Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "QA Automation Testing",
                "description": "Comprehensive test automation using Selenium, Playwright, and custom frameworks"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "AI Chatbot Development",
                "description": "RAG AI chatbot development using Flask, Together AI, and enterprise solutions"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "MCP Context Engineering",
                "description": "Model Context Protocol engineering for rapid AI testing and validation"
              }
            }
          ]
        }
      }
    ]
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
