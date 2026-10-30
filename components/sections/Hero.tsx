import Image from 'next/image'
import { profile } from '@/content'

/**
 * QA is the entry point: the name, the standard ("if it isn't tested, it doesn't ship"), and a test
 * report whose marks resolve once on load (the page's single load-time motion). The report is its
 * own bar, never laid over the portrait. Narrow phones: the portrait first, full width (visible on
 * load), then the text and the report. From 480 px the portrait sits beside the text and the report
 * runs below, so no column is left empty.
 */
export function Hero() {
  const [first, ...rest] = profile.name.split(' ')
  return (
    <section id="home" aria-labelledby="home-title" className="page pt-12 pb-[clamp(2.5rem,1.5rem+3vw,4.5rem)] lg:pt-16">
      <div className="grid grid-cols-1 gap-10 min-[30rem]:grid-cols-12 min-[30rem]:gap-x-6 min-[30rem]:gap-y-12 md:gap-x-10 md:gap-y-14 lg:gap-x-12">
        <div className="min-[30rem]:col-span-7 min-[30rem]:row-start-1">
          <h1 id="home-title" className="t-name">
            <span className="block">{first}</span> <span className="block">{rest.join(' ')}</span>
          </h1>
          <p className="mt-6 text-[clamp(1.125rem,1rem+0.55vw,1.375rem)] leading-snug font-medium text-ink">{profile.hero.subtitle}</p>
          <p className="t-lede mt-8 max-w-[31ch]">{profile.hero.statement}</p>
          <p className="t-body mt-5 text-ink-soft">{profile.hero.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary w-full sm:w-auto">
              See selected work
            </a>
            <a href="#contact" className="btn btn-secondary w-full sm:w-auto">
              Get in touch
            </a>
          </div>
        </div>

        <div className="report min-[30rem]:col-span-12 min-[30rem]:row-start-2">
          <p id="report-title" className="report-title font-semibold">
            Test report
          </p>
          <dl aria-labelledby="report-title" className="report-rows">
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

        <div className="order-first min-[30rem]:order-none min-[30rem]:col-span-5 min-[30rem]:col-start-8 min-[30rem]:row-start-1">
          <div className="plate w-full max-w-[24rem] min-[30rem]:ml-auto md:w-[min(100%,20rem)] lg:w-[min(100%,24rem)]">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={480}
              height={600}
              preload
              sizes="(min-width: 1024px) 24rem, (min-width: 768px) 20rem, (min-width: 480px) 40vw, min(100vw, 24rem)"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
