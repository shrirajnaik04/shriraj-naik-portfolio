import { Fragment } from 'react'
import type { Resume, ResumeEntry, ResumeSection, ResumeText } from '../../content/resume'

/**
 * ATS-first print styles: one column, real text in one static family, no glyph substitution
 * (ligatures and contextual alternates off, default numerals), so every parser reads the same
 * characters that are drawn.
 */
export const RESUME_CSS = `
@page { size: A4; margin: 12mm 15mm 10mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html {
  font-family: "Instrument Sans";
  font-size: 10pt;
  line-height: 1.33;
  color: #1d2432;
  font-kerning: normal;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
a { color: inherit; text-decoration: none; }
h1 { font-size: 21pt; font-weight: 600; line-height: 1.1; color: #18233a; letter-spacing: 0.01em; }
.headline { margin-top: 3pt; font-size: 10.5pt; font-weight: 600; color: #18233a; }
.contact { margin-top: 1.5pt; font-size: 9.5pt; color: #3d4656; }
section { margin-top: 10pt; }
h2 {
  margin-bottom: 4pt;
  padding-bottom: 2pt;
  border-bottom: 0.75pt solid #18233a;
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #18233a;
  break-after: avoid;
}
h3, h4, .entry-line { font-size: 10pt; font-weight: 600; color: #18233a; break-after: avoid; }
h4 { margin-top: 4pt; }
.meta { font-weight: 400; color: #3d4656; }
.entry + .entry, .entry-line + .entry-line { margin-top: 4pt; }
.employer > h3 + .entry > h4 { margin-top: 2pt; }
ul { padding-left: 11pt; }
li { margin-top: 1.5pt; padding-left: 1pt; break-inside: avoid; }
li::marker { color: #18233a; }
.labelled + .labelled { margin-top: 1.5pt; }
.label { font-weight: 600; color: #18233a; }
`

function Text({ value }: { value: ResumeText }) {
  return typeof value === 'string' ? <>{value}</> : <a href={value.href}>{value.text}</a>
}

/** Items separated by " | ", the separator parsers keep on one line. */
function Joined({ items }: { items: ResumeText[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && ' | '}
          <Text value={item} />
        </Fragment>
      ))}
    </>
  )
}

function EntryLine({ entry }: { entry: ResumeEntry }) {
  return (
    <>
      {entry.name}
      {entry.meta.length > 0 && (
        <span className="meta">
          {' | '}
          <Joined items={entry.meta} />
        </span>
      )}
    </>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function Body({ section }: { section: ResumeSection }) {
  switch (section.kind) {
    case 'text':
      return <p>{section.text}</p>
    case 'labelled':
      return section.lines.map((line) => (
        <p key={line.label} className="labelled">
          <span className="label">{line.label}:</span> {line.text}
        </p>
      ))
    case 'bullets':
      return <Bullets items={section.bullets} />
    case 'entries':
      return section.entries.map((entry) =>
        entry.bullets ? (
          <div key={entry.name} className="entry">
            <h3>
              <EntryLine entry={entry} />
            </h3>
            <Bullets items={entry.bullets} />
          </div>
        ) : (
          <p key={entry.name} className="entry-line">
            <EntryLine entry={entry} />
          </p>
        ),
      )
    case 'experience':
      return section.employers.map((employer) => (
        <div key={employer.name} className="employer">
          <h3>
            <EntryLine entry={employer} />
          </h3>
          {employer.roles.map((role) => (
            <div key={role.name} className="entry">
              <h4>
                <EntryLine entry={role} />
              </h4>
              {role.bullets && <Bullets items={role.bullets} />}
            </div>
          ))}
        </div>
      ))
  }
}

/** The document body; build.ts sets the shell (language, title from `resume.documentTitle`, CSS). */
export function ResumeBody({ resume }: { resume: Resume }) {
  return (
    <>
      <header>
        <h1>{resume.name}</h1>
        <p className="headline">{resume.headline}</p>
        {resume.contact.map((line, i) => (
          <p key={i} className="contact">
            <Joined items={line} />
          </p>
        ))}
      </header>
      {resume.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <Body section={section} />
        </section>
      ))}
    </>
  )
}
