'use client'

import { useEffect, useRef } from 'react'
import { ThemeToggle } from './ThemeToggle'

interface MobileNavProps {
  items: { label: string; href: string }[]
}

/**
 * A native <details> disclosure, so the menu works without JavaScript.
 * With JavaScript it adds two niceties: Escape closes the menu and returns focus to the toggle,
 * and choosing a link closes it. The listener exists only while the menu is open.
 */
export function MobileNav({ items }: MobileNavProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const details = detailsRef.current
    if (!details) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && details.open) {
        details.open = false
        details.querySelector('summary')?.focus()
      }
    }
    // Any navigation closes it: a tap or focus outside, a hash change (header links included), a page
    // restored from the back/forward cache, or growing to the desktop header.
    const shut = () => {
      details.open = false
    }
    const onOutside = (event: Event) => {
      if (!details.contains(event.target as Node)) shut()
    }
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onToggle = () => {
      if (details.open) {
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('pointerdown', onOutside)
        document.addEventListener('focusin', onOutside)
      } else {
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('pointerdown', onOutside)
        document.removeEventListener('focusin', onOutside)
      }
    }
    const onDesktop = () => desktop.matches && shut()
    details.addEventListener('toggle', onToggle)
    window.addEventListener('hashchange', shut)
    window.addEventListener('pageshow', shut)
    desktop.addEventListener('change', onDesktop)
    return () => {
      details.removeEventListener('toggle', onToggle)
      window.removeEventListener('hashchange', shut)
      window.removeEventListener('pageshow', shut)
      desktop.removeEventListener('change', onDesktop)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [])

  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details ref={detailsRef} data-mobile-nav className="group">
      <summary className="btn btn-secondary min-h-11 cursor-pointer list-none px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <nav aria-label="Menu" className="absolute inset-x-0 top-full border-b border-rule bg-paper shadow-[0_18px_24px_-18px_rgb(0_0_0/0.4)]">
        <ul className="page flex flex-col py-3">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close} className="block py-3 text-lg font-medium">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="page flex items-center justify-between border-t border-rule py-3">
          <span aria-hidden="true" className="text-lg font-medium">
            Dark theme
          </span>
          <ThemeToggle />
        </div>
      </nav>
    </details>
  )
}
