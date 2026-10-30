import Link from 'next/link'
import { IconDownload } from '@/components/icons'
import { NAV, RESUME_PATH, sectionHref } from '@/lib/site'
import { MobileNav } from './MobileNav'
import { ThemeToggle } from './ThemeToggle'

/**
 * Rendered once in the root layout. Section links are `/#section`, so the same header works on
 * every page. The header has its own view-transition name, so route transitions never slide it.
 */
export function Header() {
  const items = NAV.map((n) => ({ label: n.label, href: sectionHref(n.hash) }))
  return (
    <header className="site-header sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="page relative flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 lg:gap-x-6">
        {/* /#home: on the home page it scrolls to the very top; elsewhere it opens the home page there. */}
        <Link
          href="/#home"
          prefetch={false}
          className="font-display text-[1.25rem] leading-none font-semibold tracking-[-0.01em] sm:text-[1.375rem]"
          aria-label="Shriraj Naik, home"
        >
          Shriraj Naik
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 lg:gap-7">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.9375rem] font-medium">
              {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-ink-soft transition-colors duration-150 hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={RESUME_PATH} download className="btn btn-secondary min-h-11 px-3.5 py-2">
                  Resume<span className="sr-only"> (PDF)</span> <IconDownload />
                </a>
              </li>
            </ul>
          </nav>
          {/* Phones keep the switch in the menu, so the header stays one row from 360 px. */}
          <span className="hidden lg:inline-flex">
            <ThemeToggle />
          </span>
          {/* Small screens: the resume stays one tap away, beside the menu (they wrap at 320 px with 200 % text). */}
          <div className="flex flex-wrap items-center justify-end gap-2 lg:hidden">
            <a href={RESUME_PATH} download className="btn btn-secondary min-h-11 px-3 py-2">
              Resume<span className="sr-only"> (PDF)</span> <IconDownload />
            </a>
            <MobileNav items={items} />
          </div>
        </div>
      </div>
    </header>
  )
}
