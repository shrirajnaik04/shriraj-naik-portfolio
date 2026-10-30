import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * The idle-resource budgets on the production build: script, CSS and font bytes, idle main-thread
 * time, timers and animation frames after load, endless animations, heap and heap growth.
 * Measured once, in Chromium (the only engine with these counters), by the same CLI `pnpm perf`
 * runs. The hidden-tab CPU budget is left to `pnpm perf`, which runs alone: here the other engines'
 * tests run in parallel, and a background tab's page load then spills into the measured window
 * (231 ms under load, 0.3–4.4 ms alone, 2026-10-30).
 */
test('the home page stays within the resource budgets', async ({ baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'measured once, in desktop Chromium')
  test.setTimeout(180_000)
  const out = testInfo.outputPath('measure.json')
  const run = spawnSync(
    process.execPath,
    [
      'node_modules/tsx/dist/cli.mjs',
      'scripts/perf/measure.ts',
      baseURL!,
      '--build-dir',
      '.next',
      '--assert',
      '--out',
      out,
      '--no-hidden',
    ],
    { encoding: 'utf8' },
  )
  await testInfo.attach('measure.json', { path: out, contentType: 'application/json' }).catch(() => {})
  expect(run.stderr.match(/Budget violations:[\s\S]*/)?.[0] ?? '').toBe('')
  expect(run.status).toBe(0)
  expect(JSON.parse(readFileSync(out, 'utf8')).url).toBe(baseURL)
})
