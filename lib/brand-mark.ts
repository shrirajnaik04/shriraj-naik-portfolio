/**
 * The site's mark: SN as single strokes on a 64-unit ink square, no font. The N's right stem is light
 * sage, the site's evidence colour on ink ("verified"). app/icon.svg (static) and the generated Apple
 * icon use these exact paths; tests/unit/assets.test.ts keeps them in sync.
 */
export const MARK = {
  viewBox: '0 0 64 64',
  ink: '#18233a',
  paper: '#f1efe9',
  tick: '#9fc0aa',
  strokeWidth: 5,
  /** The S, as one calligraphic stroke. */
  s: 'M27 21.5c-1.4-3.4-4.6-5-8.6-5-4.8 0-8.2 2.8-8.2 6.8 0 4.4 3.9 5.9 8.4 7.3 4.7 1.5 8.9 3.3 8.9 8.1 0 4.4-3.8 7.3-8.9 7.3-4.6 0-8-2.1-9.4-5.6',
  /** The N: left stem up, then the diagonal down to the baseline. */
  n: 'M37 47V17l17 30',
  /** The N's right stem, in sage. */
  stem: 'M54 47V17',
} as const
