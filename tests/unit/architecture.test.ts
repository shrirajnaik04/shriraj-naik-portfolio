import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const SOURCE_DIRS = ['app', 'components', 'content', 'lib']

/** Every TypeScript source file the site is built from, with forward slashes. */
function sourceFiles(): string[] {
  return SOURCE_DIRS.flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => join(dir, file).replaceAll('\\', '/')),
  )
}

describe('architecture', () => {
  test('only two client components: the mobile navigation and the contact form', () => {
    const client = sourceFiles().filter((file) => /^\s*['"]use client['"]/.test(readFileSync(file, 'utf8')))
    expect(client.sort()).toEqual(['components/contact/ContactForm.tsx', 'components/site/MobileNav.tsx'])
  })

  test('no legacy UI libraries or component folders', () => {
    const imports = sourceFiles().filter((file) =>
      /from ['"](framer-motion|motion|lucide-react)['"/]|components\/ui/.test(readFileSync(file, 'utf8')),
    )
    expect(imports).toEqual([])
    expect(existsSync('components/ui')).toBe(false)
  })
})
