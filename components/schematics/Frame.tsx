import type { CSSProperties, ReactNode } from 'react'

/**
 * Drafting-style schematic. One visual vocabulary for every figure:
 * ink-blue linework, terracotta (dashed) for the guardrail, sage for verified evidence.
 * Text sizes are in viewBox units: 16 for labels, 15 for annotations. With the plate bleeding to
 * the screen edges on phones, the smallest renders at 12+ px at 390 px and 11+ px at 360 px
 * (home.spec checks 390 px).
 *
 * Motion lives in globals.css. Scroll-linked: lines draw as a drawing enters and checks resolve after
 * the flow. Endless while on screen (MotionGate): a bead slides along each connector that has a
 * `seq` (its place in the flow) and guardrail dashes march. Both animate transform only (GPU).
 */
export const WIDTH = 440

/** A drawing element's place in the flow, read by the scroll-linked motion as --seq. */
const flowOrder = (seq: number) => ({ '--seq': seq }) as CSSProperties

export function Schematic({
  id,
  title,
  desc,
  height,
  children,
}: {
  id: string
  title: string
  desc: string
  height: number
  children: ReactNode
}) {
  return (
    <svg className="sch" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{desc}</desc>
      <defs>
        <marker
          id={`${id}-head`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 1 9 5 0 9z" className="sch-head" />
        </marker>
        <marker
          id={`${id}-head-guard`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 1 9 5 0 9z" className="sch-head-guard" />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

interface BoxProps {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  quiet?: boolean
}

/** A component box with a label and an optional code-like annotation. */
export function Box({ x, y, w, h, label, sub, quiet = false }: BoxProps) {
  const cx = x + w / 2
  const cy = y + h / 2
  return (
    <g>
      <rect className={quiet ? 'sch-box sch-box--quiet' : 'sch-box'} x={x} y={y} width={w} height={h} rx={4} />
      <text className="sch-label" x={cx} y={sub ? cy - 3 : cy + 5.5} textAnchor="middle">
        {label}
      </text>
      {sub ? (
        <text className="sch-mono" x={cx} y={cy + 15} textAnchor="middle">
          {sub}
        </text>
      ) : null}
    </g>
  )
}

/** One dash period of the guardrail pattern (7 on, 6 off; see .sch-guard). */
const DASH_PERIOD = 13

type Segment = { x1: number; y1: number; x2: number; y2: number }

/** A straight connector ("M x y H x2" or "M x y V y2"); anything else has no bead. */
function straight(d: string): Segment | null {
  const m = /^M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*([HV])\s*(-?[\d.]+)$/.exec(d.trim())
  if (!m) return null
  const [x1, y1, to] = [Number(m[1]), Number(m[2]), Number(m[4])]
  return m[3] === 'H' ? { x1, y1, x2: to, y2: y1 } : { x1, y1, x2: x1, y2: to }
}

const direction = ({ x1, y1, x2, y2 }: Segment) =>
  x2 > x1 ? 'right' : x2 < x1 ? 'left' : y2 > y1 ? 'down' : 'up'

/**
 * A straight guardrail line whose dashes march from its start to its end. A line one dash period
 * longer slides along itself by exactly one period, clipped to the segment, so the loop is seamless
 * and only transform animates (GPU-composited; stroke-dashoffset would repaint every frame).
 * At rest (reduced motion, off-screen, no JavaScript) it is a plain dashed line.
 */
export function GuardLine({ id, x1, y1, x2, y2 }: Segment & { id: string }) {
  const dir = direction({ x1, y1, x2, y2 })
  const [ux, uy] = [Math.sign(x2 - x1), Math.sign(y2 - y1)]
  const pad = 3
  const clip = `${id}-clip-${x1}-${y1}-${x2}-${y2}`
  return (
    <g clipPath={`url(#${clip})`}>
      <clipPath id={clip}>
        <rect
          x={Math.min(x1, x2) - pad}
          y={Math.min(y1, y2) - pad}
          width={Math.abs(x2 - x1) + 2 * pad}
          height={Math.abs(y2 - y1) + 2 * pad}
        />
      </clipPath>
      <line
        className={`sch-guard sch-march sch-march--${dir}`}
        x1={x1 - ux * DASH_PERIOD}
        y1={y1 - uy * DASH_PERIOD}
        x2={x2}
        y2={y2}
      />
    </g>
  )
}

/** A guardrail rectangle: four marching edges, clockwise. */
export function GuardRect({ id, x, y, w, h }: { id: string; x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <GuardLine id={id} x1={x} y1={y} x2={x + w} y2={y} />
      <GuardLine id={id} x1={x + w} y1={y} x2={x + w} y2={y + h} />
      <GuardLine id={id} x1={x + w} y1={y + h} x2={x} y2={y + h} />
      <GuardLine id={id} x1={x} y1={y + h} x2={x} y2={y} />
    </g>
  )
}

/**
 * A connector. `both` draws heads at both ends; `guard` draws it in the guardrail style, marching;
 * `seq` (its place in the flow) adds a bead that slides along it while the drawing is on screen.
 */
export function Arrow({
  id,
  d,
  both = false,
  guard = false,
  seq,
}: {
  id: string
  d: string
  both?: boolean
  guard?: boolean
  seq?: number
}) {
  const marker = `url(#${id}-head${guard ? '-guard' : ''})`
  const segment = straight(d)
  if (guard && segment) {
    const [ux, uy] = [Math.sign(segment.x2 - segment.x1), Math.sign(segment.y2 - segment.y1)]
    return (
      <g>
        <GuardLine id={id} {...segment} />
        {/* The head alone, on a one-unit stub at the end (markers paint without a stroke). */}
        <path
          className="sch-head-carrier"
          d={`M${segment.x2 - ux} ${segment.y2 - uy} L${segment.x2} ${segment.y2}`}
          markerEnd={marker}
        />
      </g>
    )
  }
  const line = (
    <path
      className={guard ? 'sch-guard' : 'sch-line sch-draw'}
      pathLength={guard ? undefined : 1}
      d={d}
      markerEnd={marker}
      markerStart={both ? marker : undefined}
    />
  )
  if (seq === undefined || !segment) return line
  const bead = {
    ...flowOrder(seq),
    '--bx': `${segment.x2 - segment.x1}px`,
    '--by': `${segment.y2 - segment.y1}px`,
  } as CSSProperties
  return (
    <>
      {line}
      <circle className="sch-bead" cx={segment.x1} cy={segment.y1} r={3.5} style={bead} />
    </>
  )
}

/** The guardrail: a dashed terracotta boundary with its name; its dashes march. */
export function Boundary({
  id,
  x,
  y,
  w,
  h,
  label,
  labelAt = 'top',
}: {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  labelAt?: 'top' | 'bottom'
}) {
  return (
    <g>
      <GuardRect id={id} x={x} y={y} w={w} h={h} />
      <text className="sch-guard-label" x={x + 14} y={labelAt === 'top' ? y + 23 : y + h - 14}>
        {label}
      </text>
    </g>
  )
}

/** Verified evidence: a sage disc with a tick, and the claim beside it. `seq` resolves it after the flow. */
export function Check({ x, y, text, seq = 0 }: { x: number; y: number; text: string; seq?: number }) {
  return (
    <g style={flowOrder(seq)}>
      <circle className="sch-ok-disc" cx={x + 8} cy={y - 5} r={8} />
      <path className="sch-ok-tick" pathLength={1} d={`M${x + 4.5} ${y - 5} l2.4 2.4 l4.6 -5`} />
      <text className="sch-ok" x={x + 22} y={y}>
        {text}
      </text>
    </g>
  )
}

/** A code-like annotation in the margin of a drawing. */
export function Note({
  x,
  y,
  text,
  anchor = 'start',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text className="sch-mono" x={x} y={y} textAnchor={anchor}>
      {text}
    </text>
  )
}
