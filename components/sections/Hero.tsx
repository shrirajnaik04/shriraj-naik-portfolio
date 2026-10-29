import Image from 'next/image'
import { IconDownload } from '@/components/icons'
import { profile } from '@/content'
import { RESUME_PATH } from '@/lib/site'

/**
 * QA is the entry point: the name, the rule ("it isn't done until it's tested"), and a test report
 * whose marks resolve once on load (the page's single orchestrated motion).
 */
export function Hero() {
  const [first, ...rest] = profile.name.split(' ')
  return (
    <section id="home" aria-labelledby="home-title" className="page pt-12 pb-[clamp(5rem,3rem+6vw,9rem)] lg:pt-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 lg:pt-6">
          <h1 id="home-title" className="t-name">
            <span className="block">{first}</span> <span className="block">{rest.join(' ')}</span>
          </h1>
          <p className="mt-6 text-[1.0625rem] font-medium text-ink-soft">{profile.hero.subtitle}</p>
          <p className="t-lede mt-10 max-w-[31ch]">{profile.hero.statement}</p>
          <p className="t-body mt-5 text-ink-soft">{profile.hero.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              See selected work
            </a>
            <a href={RESUME_PATH} download className="btn btn-secondary">
              Download resume (PDF) <IconDownload />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="plate mx-auto w-[min(100%,20rem)] lg:mr-0 lg:w-[min(100%,24rem)]">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={480}
              height={600}
              preload
              sizes="(min-width: 1024px) 24rem, 20rem"
              className="block h-auto w-full"
            />
          </div>
          <div className="report relative mx-auto -mt-10 w-[min(100%,22rem)] lg:mr-[10rem] lg:-mt-24 lg:w-[22rem]">
            <p id="report-title" className="font-semibold">
              Test report
            </p>
            <dl aria-labelledby="report-title" className="mt-2">
              {profile.facts.map((fact) => (
                <div key={fact.label} className="ledger-row">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="ledger-summary">
              <span aria-hidden="true" className="mark-pass" />
              {profile.facts.length} checks passed
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
