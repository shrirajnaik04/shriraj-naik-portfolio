import Link from 'next/link'
import { IconDownload } from '@/components/icons'
import { NAV, RESUME_PATH, sectionHref } from '@/lib/site'
import { MobileNav } from './MobileNav'

/**
 * Rendered once in the root layout. Section links are `/#section`, so the same header works on
 * every page. The header has its own view-transition name, so route transitions never slide it.
 */
export function Header() {
  const items = NAV.map((n) => ({ label: n.label, href: sectionHref(n.hash) }))
  return (
    <header className="site-header sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="page relative flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          prefetch={false}
          className="font-display text-[1.375rem] leading-none tracking-[-0.01em]"
          aria-label="Shriraj Naik, home"
        >
          Shriraj Naik
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] font-medium">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ink-soft transition-colors duration-150 hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={RESUME_PATH} download className="btn btn-secondary min-h-10 px-3.5 py-2">
                Resume <IconDownload />
              </a>
            </li>
          </ul>
        </nav>
        <MobileNav items={items} resumeHref={RESUME_PATH} />
      </div>
    </header>
  )
}
