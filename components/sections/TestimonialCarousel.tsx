'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from '@/components/icons'
import type { Testimonial } from '@/content/types'

const noSubscription = () => () => {}

/** Time each view stays before the carousel moves on by itself. */
export const AUTOPLAY_MS = 7000

const REDUCED = '(prefers-reduced-motion: reduce)'

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

/** False in the server HTML and during hydration, true once the buttons can work. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
}

/**
 * Tech professionals' words, verbatim, as a carousel: one quote at a time on phones, two side by side
 * from 768 px. It moves on by itself every 7 s, looping, but only while it is on screen in a visible
 * tab, not hovered, not holding keyboard focus and not paused; with reduced motion it starts paused.
 * A Pause/Play button comes first (WCAG 2.2.2). Swipe, the arrow keys on the focused track and the
 * buttons always work. Every quote is in the server HTML, so without JavaScript the track still
 * scrolls. Only the visitor's own moves are announced; autoplay never is.
 */
export function TestimonialCarousel({ items, labelledBy }: { items: Testimonial[]; labelledBy: string }) {
  const hydrated = useHydrated()
  const trackId = useId()
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState({ first: 0, last: 0 })
  const [moved, setMoved] = useState(false)
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => true)
  const tabVisible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === 'visible', () => false)
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null) // null: the visitor hasn't chosen
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const paused = choice ? choice === 'pause' : reduced

  // Which slides are in view: an IntersectionObserver on the track, so no scroll listener runs.
  useEffect(() => {
    const element = track.current
    if (!element) return
    const visible = new Set<number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index)
          if (entry.isIntersecting) visible.add(index)
          else visible.delete(index)
        }
        if (visible.size) setShown({ first: Math.min(...visible), last: Math.max(...visible) })
      },
      { root: element, threshold: 0.6 },
    )
    for (const slide of element.children) observer.observe(slide)
    return () => observer.disconnect()
  }, [])

  // Autoplay only runs while the carousel itself is on screen.
  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const total = items.length
  const atEnd = shown.last === total - 1

  const move = (direction: 1 | -1, byVisitor: boolean) => {
    const element = track.current
    const slide = element?.firstElementChild as HTMLElement | null
    if (!element || !slide) return
    const step = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || '0')
    const behavior = window.matchMedia(REDUCED).matches ? 'auto' : 'smooth'
    // Autoplay loops back to the start after the last view.
    if (!byVisitor && atEnd) element.scrollTo({ left: 0, behavior })
    else element.scrollBy({ left: direction * step, behavior })
    if (byVisitor) setMoved(true)
  }

  // One timer at a time, re-armed after every move; none while anything says "hold".
  const running = hydrated && !paused && inView && tabVisible && !hovered && !focused
  const position = `${shown.first}-${shown.last}`
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => move(1, false), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-armed for each new position
  }, [running, position])

  const label =
    shown.first === shown.last ? `${shown.first + 1} of ${total}` : `${shown.first + 1}–${shown.last + 1} of ${total}`

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      className="carousel"
      data-autoplay={running ? 'running' : 'held'}
      // Focus inside holds the autoplay, except on the Pause/Play button itself (WAI carousel pattern).
      onFocus={(event) => setFocused(!(event.target as HTMLElement).hasAttribute('data-rotation'))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="t-meta" aria-live={moved ? 'polite' : 'off'} aria-atomic="true">
          {label}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-rotation
            className="carousel-button"
            aria-controls={trackId}
            aria-label={paused ? 'Play quotes automatically' : 'Pause automatic quotes'}
            disabled={!hydrated}
            onClick={() => setChoice(paused ? 'play' : 'pause')}
          >
            {paused ? <IconPlay /> : <IconPause />}
          </button>
          <button
            type="button"
            className="carousel-button"
            aria-controls={trackId}
            aria-label="Previous quotes"
            disabled={!hydrated || shown.first === 0}
            onClick={() => move(-1, true)}
          >
            <IconArrowLeft />
          </button>
          <button
            type="button"
            className="carousel-button"
            aria-controls={trackId}
            aria-label="Next quotes"
            disabled={!hydrated || atEnd}
            onClick={() => move(1, true)}
          >
            <IconArrowRight />
          </button>
        </div>
      </div>
      <div
        id={trackId}
        ref={track}
        tabIndex={0}
        aria-label="Quotes, scroll sideways for more"
        className="carousel-track mt-6"
        // A mouse resting on the quotes (reading) holds the autoplay; the controls and taps don't.
        onPointerEnter={(event) => setHovered(event.pointerType === 'mouse')}
        onPointerLeave={() => setHovered(false)}
      >
        {items.map((t, i) => (
          <figure
            key={t.name}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
            className="carousel-slide flex flex-col"
          >
            <blockquote className="quote mb-6 font-display text-[1.1875rem] leading-[1.55] text-pretty">{t.quote}</blockquote>
            <figcaption className="mt-auto border-t border-rule pt-4">
              <span className="block font-semibold">{t.name}</span>
              <span className="t-small block text-ink-soft">
                {t.role}, {t.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
