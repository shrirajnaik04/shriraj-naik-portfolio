import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], display: 'swap' })

const SITE_URL = "https://shrirajnaik.dev"
const OG_IMAGE = "https://res.cloudinary.com/dfvyqtli8/image/upload/c_pad,w_1200,h_630,b_rgb:0f172a/v1777649066/profile.jpg"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f172a',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shriraj Naik | Agentic AI Engineer & QA Automation Architect",
    template: "%s | Shriraj Naik",
  },
  description: "Shriraj Naik — Agentic AI Engineer, Generative AI Developer and QA Automation Architect from Goa, India. Building autonomous agents, RAG chatbots, Vision-AI testing platforms and Playwright MCP frameworks for production SaaS.",
  applicationName: "Shriraj Naik Portfolio",
  keywords: [
    "Shriraj Naik",
    "Shriraj Naik Portfolio",
    "Shriraj Naik QA Engineer",
    "Agentic AI Engineer",
    "Generative AI Developer",
    "Vision AI QA",
    "Vision-AI Test Architect",
    "RAG AI Engineer",
    "RAG Chatbot Developer",
    "MCP Context Engineering",
    "Playwright MCP",
    "QA Automation Engineer",
    "Test Automation Architect",
    "AI Powered Automation QA Framework",
    "Multi-Tenant SaaS Developer",
    "Next.js Developer",
    "Python Developer",
    "TypeScript Developer",
    "FastAPI Developer",
    "Google Gemini Developer",
    "Together AI Developer",
    "Goa India Developer",
    "Software Testing Professional",
  ].join(", "),
  authors: [{ name: "Shriraj Naik", url: SITE_URL }],
  creator: "Shriraj Naik",
  publisher: "Shriraj Naik",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Shriraj Naik | Agentic AI Engineer & QA Automation Architect",
    description: "Building Agentic AI Systems, Generative AI Chatbots and Scalable QA Frameworks. Travel-OTA RAG widgets, Vision-AI test platforms and multi-tenant SaaS — engineered end to end.",
    siteName: "Shriraj Naik Portfolio",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Shriraj Naik — Agentic AI Engineer & QA Automation Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shriraj Naik | Agentic AI Engineer & QA Automation Architect",
    description: "Agentic AI, Generative AI and QA Automation engineer from Goa, India. Building RAG chatbots, Vision-AI testing platforms and Playwright MCP frameworks.",
    images: [OG_IMAGE],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shriraj Naik",
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
        "@id": `${SITE_URL}/#person`,
        "name": "Shriraj Naik",
        "givenName": "Shriraj",
        "familyName": "Naik",
        "url": SITE_URL,
        "image": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dfvyqtli8/image/upload/v1777649066/profile.jpg",
          "width": 400,
          "height": 400
        },
        "sameAs": [
          "https://www.linkedin.com/in/shriraj-naik-494421154/",
          "https://github.com/shrirajnaik04"
        ],
        "jobTitle": "Agentic AI Engineer & QA Automation Architect",
        "description": "Agentic AI Engineer, Generative AI Developer and QA Automation Architect specializing in MCP Context Engineering, RAG chatbots, Vision-AI testing and Playwright MCP frameworks.",
        "knowsAbout": [
          "Agentic AI",
          "Generative AI",
          "Vision AI",
          "RAG",
          "MCP Context Engineering",
          "QA Automation",
          "Test Automation",
          "Playwright MCP",
          "Playwright",
          "JMeter",
          "Python",
          "TypeScript",
          "Next.js",
          "FastAPI",
          "Google Gemini",
          "Together AI",
          "Multi-Tenant SaaS"
        ],
        "award": "Quality Analyst of the Quarter — FinTech Company, Goa",
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
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "Shriraj Naik Portfolio",
        "description": "Professional portfolio of Shriraj Naik — Agentic AI Engineer, Generative AI Developer and QA Automation Architect.",
        "inLanguage": "en-US",
        "publisher": {
          "@id": `${SITE_URL}/#person`
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        "name": "Shriraj Naik AI & QA Engineering Services",
        "provider": {
          "@id": `${SITE_URL}/#person`
        },
        "serviceType": "Agentic AI, Generative AI & QA Automation Engineering",
        "description": "Agentic AI development, Generative AI chatbot delivery, Vision-AI test automation and Playwright MCP framework engineering for production SaaS.",
        "areaServed": "Global",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI & QA Engineering Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Agentic AI Development",
                "description": "Autonomous agents for outreach pipelines, content extraction and workflow automation using multi-provider LLM orchestration."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Generative AI & RAG Chatbot Development",
                "description": "Production-grade Generative AI and RAG chatbots using Google Gemini, Together AI, Qdrant and MongoDB Atlas vector search."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "QA Automation & Vision-AI Testing",
                "description": "Test automation across Web, Mobile and API using Playwright MCP, Vision-AI element detection and JMeter performance frameworks."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "MCP Context Engineering",
                "description": "Model Context Protocol engineering and Agentic AI test generation for rapid LLM evaluation and delivery cycles."
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
