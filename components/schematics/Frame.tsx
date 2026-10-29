import type { ReactNode } from 'react'

/**
 * Drafting-style schematic. One visual vocabulary for every figure:
 * ink-blue linework, terracotta (dashed) for the guardrail, sage for verified evidence.
 * Text sizes are in viewBox units: 16 for labels, 14 for annotations (≥ 11px at a 390px viewport).
 */
export const WIDTH = 440

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

/** A connector. `both` draws heads at both ends; `guard` draws it in the guardrail style. */
export function Arrow({
  id,
  d,
  both = false,
  guard = false,
}: {
  id: string
  d: string
  both?: boolean
  guard?: boolean
}) {
  const marker = `url(#${id}-head${guard ? '-guard' : ''})`
  return (
    <path
      className={guard ? 'sch-guard' : 'sch-line'}
      d={d}
      markerEnd={marker}
      markerStart={both ? marker : undefined}
    />
  )
}

/** The guardrail: a dashed terracotta boundary with its name. */
export function Boundary({
  x,
  y,
  w,
  h,
  label,
  labelAt = 'top',
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  labelAt?: 'top' | 'bottom'
}) {
  return (
    <g>
      <rect className="sch-guard" x={x} y={y} width={w} height={h} rx={8} />
      <text className="sch-guard-label" x={x + 14} y={labelAt === 'top' ? y + 23 : y + h - 14}>
        {label}
      </text>
    </g>
  )
}

/** Verified evidence: a sage disc with a tick, and the claim beside it. */
export function Check({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <circle className="sch-ok-disc" cx={x + 8} cy={y - 5} r={8} />
      <path className="sch-ok-tick" d={`M${x + 4.5} ${y - 5} l2.4 2.4 l4.6 -5`} />
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
