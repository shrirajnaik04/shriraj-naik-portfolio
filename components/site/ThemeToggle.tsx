'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { IconMoon, IconSun } from '@/components/icons'

export const THEME_KEY = 'theme'
const THEME_COLOR = { light: '#f1efe9', dark: '#101827' }

/** Re-renders when <html data-theme> changes (this switch, or the script that ran before paint). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
const isDark = () => document.documentElement.dataset.theme === 'dark'

/** Every theme-color tag (Next can add its own after the pre-paint script has run). */
function setThemeColor(dark: boolean) {
  for (const meta of document.querySelectorAll('meta[name="theme-color"]'))
    meta.setAttribute('content', dark ? THEME_COLOR.dark : THEME_COLOR.light)
}
const noSubscription = () => () => {}

/**
 * Light by default; dark only when the visitor asks for it. The choice is remembered (localStorage)
 * and applied before first paint by the script in app/layout.tsx, so there is no flash.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)
  const hydrated = useSyncExternalStore(noSubscription, () => true, () => false)

  useEffect(() => setThemeColor(dark), [dark])

  const toggle = () => {
    const next = !dark
    const root = document.documentElement
    if (next) root.dataset.theme = 'dark'
    else delete root.dataset.theme
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage can be blocked; the switch still works for this page.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={dark}
      disabled={!hydrated}
      onClick={toggle}
      aria-label="Dark theme"
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {/* The current theme's icon: a sun in light, a moon in dark; they turn into each other. */}
      <IconSun className="theme-icon theme-icon--sun" />
      <IconMoon className="theme-icon theme-icon--moon" />
    </button>
  )
}
