/**
 * Runs Lighthouse CI (mobile preset, 3 runs) using Playwright's Chromium, then prints the
 * median run's scores and key metrics per URL.
 *
 * Usage: node scripts/perf/lighthouse.mjs [--assert] [--url <url> ...] [--out <file>] [--throttling devtools]
 * Without --url, the URLs in lighthouserc.json are used.
 */
import { chromium } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const lhciCli = createRequire(import.meta.url).resolve('@lhci/cli/src/cli.js')

const args = process.argv.slice(2)
const urls = args.flatMap((a, i) => (args[i - 1] === '--url' ? [a] : []))
const outIndex = args.indexOf('--out')
const outFile = outIndex !== -1 ? args[outIndex + 1] : undefined
const outDir = '.lighthouseci'

rmSync(outDir, { recursive: true, force: true })
const env = { ...process.env, CHROME_PATH: chromium.executablePath() }
const lhci = (cmd, extra = []) =>
  spawnSync(process.execPath, [lhciCli, cmd, ...extra], { stdio: 'inherit', env })

// --throttling devtools: Chromium is actually throttled (applied) instead of Lantern's simulation.
const throttlingIndex = args.indexOf('--throttling')
const throttling = throttlingIndex !== -1 ? args[throttlingIndex + 1] : undefined
const collect = lhci('collect', [
  ...urls.map((u) => `--url=${u}`),
  ...(throttling ? [`--settings.throttlingMethod=${throttling}`] : []),
])
if (collect.status !== 0) process.exit(collect.status ?? 1)
lhci('upload')

const manifest = JSON.parse(readFileSync(join(outDir, 'manifest.json'), 'utf8'))
const summary = {}
for (const entry of manifest.filter((e) => e.isRepresentativeRun)) {
  const lhr = JSON.parse(readFileSync(entry.jsonPath, 'utf8'))
  const a = lhr.audits
  const bytesOf = (type) =>
    a['resource-summary']?.details?.items?.find((i) => i.resourceType === type)?.transferSize ?? null
  summary[entry.url] = {
    lighthouseVersion: lhr.lighthouseVersion,
    formFactor: lhr.configSettings.formFactor,
    throttlingMethod: lhr.configSettings.throttlingMethod,
    performance: lhr.categories.performance?.score,
    accessibility: lhr.categories.accessibility?.score,
    bestPractices: lhr.categories['best-practices']?.score,
    seo: lhr.categories.seo?.score,
    fcpMs: Math.round(a['first-contentful-paint'].numericValue),
    lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
    cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
    tbtMs: Math.round(a['total-blocking-time'].numericValue),
    speedIndexMs: Math.round(a['speed-index'].numericValue),
    scriptTransferBytes: bytesOf('script'),
    stylesheetTransferBytes: bytesOf('stylesheet'),
    fontTransferBytes: bytesOf('font'),
    totalTransferBytes: bytesOf('total'),
  }
}
const json = JSON.stringify(summary, null, 2)
console.log(json)
if (outFile) {
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, json + '\n')
}

if (args.includes('--assert')) {
  const result = lhci('assert')
  process.exit(result.status ?? 1)
}
