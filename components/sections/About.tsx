import { IconDownload } from '@/components/icons'
import { Section } from '@/components/site/Section'
import { profile } from '@/content'
import { RESUME_PATH } from '@/lib/site'

/** Splits "term (pos) — sense" into its parts; fails the build if the copy loses that shape. */
function parseDefinition(definition: string) {
  const match = /^(.+?) \((.+?)\) — (.+)$/.exec(definition)
  if (!match) throw new Error('profile.vibeDefinition must read "term (pos) — sense"')
  const [, term, partOfSpeech, sense] = match
  return { term, partOfSpeech, sense }
}

export function About() {
  const { term, partOfSpeech, sense } = parseDefinition(profile.vibeDefinition)
  return (
    <Section id="about" title="About" surface="deep" layout="split" deferRendering>
      <p className="t-lede max-w-[40ch]">{profile.about.intro}</p>

      <div className="mt-12 border-l-2 border-signal py-1 pl-6 sm:pl-8">
        <p className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight">
          <dfn className="not-italic">{term}</dfn>{' '}
          <span className="font-sans text-base text-ink-soft">({partOfSpeech})</span>
        </p>
        <p className="t-body mt-3">{sense}</p>
      </div>

      <p className="t-body mt-12 text-ink-soft">{profile.about.outro}</p>
      <p className="mt-8">
        <a href={RESUME_PATH} download className="btn btn-secondary">
          Download resume (PDF) <IconDownload />
        </a>
      </p>
    </Section>
  )
}
