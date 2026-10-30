import { IconExternal } from '@/components/icons'
import { profile } from '@/content'
import { REPO_URL } from '@/lib/site'

/** Separate items laid out with space, not joined by separators. */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="band">
      <div className="page t-small flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <p className="text-ink-soft">Vibe engineered with AI agents. Human-reviewed, test-gated.</p>
        <p>
          <a href={REPO_URL} rel="noopener noreferrer" className="link inline-flex items-center gap-1.5">
            Source on GitHub
            <IconExternal />
          </a>
        </p>
      </div>
    </footer>
  )
}
