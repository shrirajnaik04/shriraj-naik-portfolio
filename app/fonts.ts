import { Instrument_Sans, JetBrains_Mono, Newsreader } from 'next/font/google'

/**
 * Self-hosted at build time (no runtime requests to Google).
 * Newsreader: two static weights (400, and 600 for the header name), roman only. The opsz axis (+74 KB) and the italic (+65 KB) are
 * deliberately not loaded; nothing on the site is set in italic (font-synthesis: none).
 */
export const newsreader = Newsreader({
  subsets: ['latin'],
  // Static instances: 400 for every serif use, 600 for the header wordmark only (+~22 KB).
  weight: ['400', '600'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-newsreader',
})

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
})

/**
 * Code-like tokens only (stack identifiers, schematic annotations): not preloaded, and display
 * "optional", so a late arrival never reflows the page (it used to shift section links by up to 50 px).
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'optional',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'Cascadia Mono', 'Consolas', 'monospace'],
  variable: '--font-jetbrains-mono',
})

export const fontVariables = `${newsreader.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`
