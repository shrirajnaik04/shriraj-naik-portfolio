import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <section className="page section">
      <h1 className="t-h2">Page not found</h1>
      <p className="t-body mt-5 text-ink-soft">
        That address doesn’t match any page on this site. The work, approach and contact details are all on the home
        page.
      </p>
      <p className="mt-10">
        <Link href="/" prefetch={false} className="btn btn-primary">
          Back to the home page
        </Link>
      </p>
    </section>
  )
}
