import { ContactForm } from '@/components/contact/ContactForm'
import { IconExternal, IconGitHub, IconLinkedIn, IconMail } from '@/components/icons'
import { Section } from '@/components/site/Section'
import { profile } from '@/content'

/** The close of the page, on the ink-blue band. Second person only here. No phone number (resume only). */
export function Contact() {
  const links = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <IconMail />, external: false },
    { href: profile.links.linkedin, label: 'LinkedIn', icon: <IconLinkedIn />, external: true },
    { href: profile.links.github, label: 'GitHub', icon: <IconGitHub />, external: true },
  ]
  return (
    <Section id="contact" title="Get in touch" surface="band" deferRendering>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="t-lede">
            Hiring for QA automation or quality engineering, or want to talk about a product? Send a message or email
            me directly.
          </p>
          <ul className="mt-8 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="link inline-flex items-center gap-2.5 font-medium"
                >
                  {link.icon}
                  {link.label}
                  {link.external ? <IconExternal className="text-ink-soft" /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative lg:col-span-7">
          <ContactForm email={profile.email} />
          <noscript>
            {/* One text node: React would otherwise split it with comment markers in the HTML. */}
            <p className="t-body mt-6">{`The form needs JavaScript. Email me at ${profile.email} instead.`}</p>
          </noscript>
        </div>
      </div>
    </Section>
  )
}
