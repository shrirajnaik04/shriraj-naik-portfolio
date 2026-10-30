/**
 * `pnpm perf`: serves the production build on port 3100 and runs every performance gate against it.
 *   1. Lighthouse, simulated throttling (median of 3): lighthouserc.json assertions.
 *   2. Lighthouse, applied throttling (median of 3): LCP <= 2,000 ms (decision of 2026-10-29).
 *   3. measure.ts: resource budgets, including the hidden-tab check (needs a display).
 * Every step runs even if an earlier one fails; the exit code reports all of them.
 *
 * Usage: node scripts/perf/run.mjs [--out-dir <dir>]   (after `pnpm build`; default test-results/perf)
 */
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { createConnection } from 'node:net'
import { join } from 'node:path'

const PORT = 3100
const BASE = `http://localhost:${PORT}/`
const args = process.argv.slice(2)
const outDir = args.includes('--out-dir') ? args[args.indexOf('--out-dir') + 1] : join('test-results', 'perf')
mkdirSync(outDir, { recursive: true })

const portInUse = () =>
  new Promise((resolve) => {
    const socket = createConnection({ port: PORT, host: '127.0.0.1' })
    socket.once('connect', () => (socket.destroy(), resolve(true)))
    socket.once('error', () => resolve(false))
  })

async function waitForServer(timeoutMs = 60_000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`the server did not answer on ${BASE} within ${timeoutMs} ms`)
}

function stop(server) {
  if (server.exitCode !== null) return
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
  else process.kill(-server.pid, 'SIGTERM')
}

// A stray server would mean measuring a stale build.
if (await portInUse()) {
  console.error(`port ${PORT} is in use: stop that server first`)
  process.exit(1)
}

const nextBin = join('node_modules', 'next', 'dist', 'bin', 'next')
const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
  stdio: 'ignore',
  detached: process.platform !== 'win32',
})

const steps = [
  ['Lighthouse (simulated): lighthouserc.json budgets', ['scripts/perf/lighthouse.mjs', '--assert', '--out', join(outDir, 'lighthouse-simulated.json')]],
  [
    'Lighthouse (applied throttling): LCP <= 2000 ms',
    ['scripts/perf/lighthouse.mjs', '--throttling', 'devtools', '--max-lcp', '2000', '--out', join(outDir, 'lighthouse-applied.json')],
  ],
  [
    'Resource budgets (measure.ts)',
    ['node_modules/tsx/dist/cli.mjs', 'scripts/perf/measure.ts', BASE, '--build-dir', '.next', '--assert', '--out', join(outDir, 'measure.json')],
  ],
]

const failures = []
try {
  await waitForServer()
  for (const [name, stepArgs] of steps) {
    console.log(`\n=== ${name}`)
    const result = spawnSync(process.execPath, stepArgs, { stdio: 'inherit' })
    if (result.status !== 0) failures.push(name)
  }
} catch (error) {
  failures.push(String(error))
} finally {
  stop(server)
}

console.log(failures.length ? `\nperf: FAILED\n  ${failures.join('\n  ')}` : `\nperf: all gates passed (results in ${outDir})`)
process.exit(failures.length ? 1 : 0)
