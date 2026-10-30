'use client'

import { useEffect, useRef } from 'react'
import { IconDownload } from '@/components/icons'

interface MobileNavProps {
  items: { label: string; href: string }[]
  resumeHref: string
}

/**
 * A native <details> disclosure, so the menu works without JavaScript.
 * With JavaScript it adds two niceties: Escape closes the menu and returns focus to the toggle,
 * and choosing a link closes it. The listener exists only while the menu is open.
 */
export function MobileNav({ items, resumeHref }: MobileNavProps) {
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
    const onToggle = () => {
      if (details.open) document.addEventListener('keydown', onKeyDown)
      else document.removeEventListener('keydown', onKeyDown)
    }
    details.addEventListener('toggle', onToggle)
    return () => {
      details.removeEventListener('toggle', onToggle)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const close = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details ref={detailsRef} data-mobile-nav className="group md:hidden">
      <summary className="btn btn-secondary min-h-11 cursor-pointer list-none px-3.5 py-2 [&::-webkit-details-marker]:hidden">
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
          <li className="mt-1 border-t border-rule">
            <a href={resumeHref} download onClick={close} className="flex items-center gap-2 py-3 text-lg font-medium">
              Resume (PDF) <IconDownload />
            </a>
          </li>
        </ul>
      </nav>
    </details>
  )
}
