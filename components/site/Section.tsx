import type { ReactNode } from 'react'

type Surface = 'paper' | 'deep' | 'band'

const SURFACE_CLASS: Record<Surface, string> = {
  paper: '',
  deep: 'surface-deep',
  band: 'band',
}

/**
 * A page section: a serif h2 and its content. No eyebrow labels or numbering.
 * `split` puts the heading in a left column on wide screens. `deferRendering` skips layout and
 * paint until the section nears the viewport (below-the-fold sections only).
 */
export function Section({
  id,
  title,
  intro,
  surface = 'paper',
  layout = 'stacked',
  deferRendering = false,
  children,
}: {
  id: string
  title: string
  intro?: string
  surface?: Surface
  layout?: 'stacked' | 'split'
  deferRendering?: boolean
  children: ReactNode
}) {
  const heading = (
    <div>
      <h2 id={`${id}-title`} className="t-h2">
        {title}
      </h2>
      {intro ? <p className="t-lede mt-5 max-w-[42ch] text-ink-soft">{intro}</p> : null}
    </div>
  )
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`section ${SURFACE_CLASS[surface]} ${deferRendering ? 'cv-auto' : ''}`}
    >
      <div className="page">
        {layout === 'split' ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">{heading}</div>
            <div className="lg:col-span-8">{children}</div>
          </div>
        ) : (
          <>
            {heading}
            <div className="mt-12 lg:mt-16">{children}</div>
          </>
        )}
      </div>
    </section>
  )
}
