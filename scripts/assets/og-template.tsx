import type { Profile } from '../../content/types'

const INK = '#18233a'
const INK_SOFT = '#4a5568'
const PAPER = '#f1efe9'
const CARD = '#faf9f5'
const RULE = '#d3cfc4'
const SIGNAL = '#a3462a'
const SIGNAL_BRIGHT = '#c65f3c'
const EVIDENCE = '#4a6352'

/** The site's evidence mark (a passed check), as used by the hero test report. */
function Pass({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <path
        fill={EVIDENCE}
        fillRule="evenodd"
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.62-10.08a.8.8 0 0 0-1.24-1.01L7.03 8.96 5.6 7.53a.8.8 0 1 0-1.13 1.13l2.06 2.06a.8.8 0 0 0 1.19-.06l3.9-4.74Z"
      />
    </svg>
  )
}

export const OG_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 468px;
  column-gap: 60px;
  padding: 64px 72px 60px;
  background: ${PAPER};
  color: ${INK};
  font-family: "Instrument Sans";
  font-variant-ligatures: none;
}
.identity { display: flex; flex-direction: column; min-width: 0; }
.name { font-family: "Newsreader"; font-weight: 400; font-size: 128px; line-height: 0.94; letter-spacing: -0.01em; }
.role { margin-top: 30px; font-size: 32px; font-weight: 500; line-height: 1.28; color: ${INK_SOFT}; }
.site { margin-top: auto; font-size: 26px; font-weight: 600; }
.site::before { content: ''; display: block; width: 56px; height: 5px; margin-bottom: 16px; border-radius: 3px; background: ${SIGNAL}; }
.report {
  align-self: center;
  padding: 26px 30px 22px;
  background: ${CARD};
  border: 1.5px solid ${RULE};
  border-radius: 10px;
  box-shadow: 0 2px 0 rgba(24, 35, 58, 0.04), 0 36px 64px -40px rgba(24, 35, 58, 0.5);
}
.report-title { font-size: 24px; font-weight: 600; }
.row { display: flex; gap: 14px; padding: 12px 0; border-top: 1.5px solid ${RULE}; font-size: 22px; line-height: 1.3; }
.report-title + .row { margin-top: 10px; }
.row svg { flex: none; margin-top: 3px; }
.value { font-weight: 600; }
.label { color: ${INK_SOFT}; }
.summary { display: flex; align-items: center; gap: 12px; padding-top: 14px; border-top: 1.5px solid ${RULE}; font-size: 21px; font-weight: 600; color: ${EVIDENCE}; }
`

/** The 1200×630 link-preview card: the hero's name, role and test report. Styled by OG_CSS. */
export function OgBody({ profile, site }: { profile: Profile; site: string }) {
  const [first, ...rest] = profile.name.split(' ')
  // "QA Automation Engineer &" / "AI Product Engineer": break after the ampersand, never inside a role.
  const [role, ...more] = profile.headline.split(' & ')
  return (
    <>
      <div className="identity">
        <p className="name">
          {first}
          <br />
          {rest.join(' ')}
        </p>
        <p className="role">
          {role}
          {more.length > 0 && (
            <>
              {' &'}
              <br />
              {more.join(' & ')}
            </>
          )}
        </p>
        <p className="site">{site}</p>
      </div>
      <div className="report">
        <p className="report-title">Test report</p>
        {profile.facts.map((fact) => (
          <div key={fact.label} className="row">
            <Pass size={22} />
            <p>
              <span className="value">{fact.value}</span> <span className="label">{fact.label}</span>
            </p>
          </div>
        ))}
        <p className="summary">
          <Pass size={22} />
          {profile.facts.length} checks passed
        </p>
      </div>
    </>
  )
}

export const APPLE_ICON_CSS = '* { margin: 0; } html, body { width: 180px; height: 180px; overflow: hidden; } svg { display: block; }'

/**
 * The 180×180 Apple touch icon: app/icon.svg drawn full-bleed (iOS rounds the corners itself),
 * with the brand serif embedded instead of the system serif the SVG favicon falls back to.
 */
export function AppleIconBody() {
  return (
    <svg viewBox="0 0 64 64" width="180" height="180">
      <rect width="64" height="64" fill={INK} />
      <text x="32" y="44" textAnchor="middle" fontFamily="Newsreader" fontSize="38" fill={PAPER}>
        S
      </text>
      <rect x="20" y="50" width="24" height="3" rx="1.5" fill={SIGNAL_BRIGHT} />
    </svg>
  )
}
