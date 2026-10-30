import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  engines?: { node?: string }
}

const ALLOWED_RUNTIME = ['next', 'react', 'react-dom', 'nodemailer']

describe('dependency policy', () => {
  test('no floating "latest" or wildcard ranges', () => {
    for (const [name, range] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
      expect(range, name).not.toMatch(/latest|\*/)
    }
  })

  test('runtime dependencies are only the approved set', () => {
    expect(Object.keys(pkg.dependencies).sort()).toEqual([...ALLOWED_RUNTIME].sort())
  })

  test('platform versions are pinned', () => {
    expect(pkg.dependencies.next).toBe('16.4.3')
    expect(pkg.dependencies.react).toBe('19.3.1')
    expect(pkg.dependencies['react-dom']).toBe('19.3.1')
    expect(pkg.devDependencies.typescript).toBe('5.9.3')
    expect(pkg.engines?.node).toBe('>=22.12 <25')
  })
})
