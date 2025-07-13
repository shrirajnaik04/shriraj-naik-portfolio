import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shriraj Naik - QA Automation & AI Engineer",
  description:
    "Professional portfolio of Shriraj Naik - QA Automation Engineer, AI Developer, MCP Context Engineering Expert, and SaaS AI Chatbot Architect",
  keywords: "QA Automation, AI Developer, MCP Context Engineering, SaaS Chatbot, Playwright, Selenium, Python, Flask",
  authors: [{ name: "Shriraj Naik" }],
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  openGraph: {
    title: "Shriraj Naik - QA Automation & AI Engineer",
    description: "Building Scalable QA Frameworks and SaaS AI Chatbots for Rapid AI Development",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
