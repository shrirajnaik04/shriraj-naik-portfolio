import { Instrument_Sans, JetBrains_Mono, Newsreader } from 'next/font/google'

/**
 * Self-hosted at build time (no runtime requests to Google).
 * Newsreader: one static weight (400), roman only. The opsz axis (+74 KB) and the italic (+65 KB) are
 * deliberately not loaded; nothing on the site is set in italic (font-synthesis: none).
 */
export const newsreader = Newsreader({
  subsets: ['latin'],
  // Every serif use on the site is weight 400; a static instance is far smaller than the variable range.
  weight: ['400'],
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
