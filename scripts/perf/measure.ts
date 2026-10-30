/**
 * Page resource meter. Loads a URL in Chromium and reports what the page costs a visitor:
 * bytes by type (as served, and re-compressed with gzip/brotli so local and CDN numbers compare),
 * framework vs app-owned JavaScript, fonts, perpetual animations, timers and animation frames
 * scheduled after load, main-thread work while idle (visible and hidden tab), during a scroll,
 * and JS heap.
 *
 * CLI:
 *   tsx scripts/perf/measure.ts <url> [--out <file>] [--assert] [--build-dir <.next>] [--no-hidden]
 *   tsx scripts/perf/measure.ts --self-test   # proves every detector on positive/negative fixtures
 */
import { chromium, type Page } from '@playwright/test'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib'

export interface PageMetrics {
  url: string
  requestCount: number
  totalBytes: number
  /** Transfer bytes as served by this server (encoding depends on the server). */
  scriptBytes: number
  stylesheetBytes: number
  fontBytes: number
  /** Font bytes referenced by <link rel="preload" as="font">. */
  preloadedFontBytes: number
  /** Script bodies re-compressed locally, so `next start` (gzip) and a CDN (brotli) compare. */
  scriptGzipBytes: number
  scriptBrotliBytes: number
  /** Present when --build-dir is given: framework floor vs app-owned, gzip level 6. */
  frameworkScriptGzipBytes: number | null
  appScriptGzipBytes: number | null
  infiniteAnimations: number
  /** Main-thread task time over the idle window, tab visible. */
  idleTaskMs: number
  /** Timer (setTimeout/setInterval) and animation-frame callbacks that ran during the idle window. */
  timersAfterLoad: number
  rafAfterLoad: number
  /** Main-thread task time while scripted-scrolling the whole page. */
  scrollTaskMs: number
  jsHeapUsedMB: number
  /** Heap growth (MB, after GC) from cycle 2 to cycle 10 of opening/closing every disclosure; null if none. */
  heapGrowthMB: number | null
  /** Hidden background tab: visibility observed and task time over the idle window. */
  hidden: { visibility: string; taskMs: number } | null
}

/** Budgets (plan: framework floor + 20 KB app JS; spec §10 for the rest). */
export const BUDGETS = {
  appScriptGzipBytes: 20_480,
  stylesheetBytes: 15_360,
  fontBytes: 204_800,
  preloadedFontBytes: 102_400,
  idleTaskMs: 50,
  timersAfterLoad: 0,
  rafAfterLoad: 0,
  infiniteAnimations: 0,
  jsHeapUsedMB: 10,
  heapGrowthMB: 1,
  hiddenTaskMs: 10,
} as const

const SETTLE_MS = 2000
const IDLE_MS = 10_000

/**
 * Wraps scheduling APIs so the page reports how many timer and animation-frame callbacks actually
 * ran after a reset point. Counting runs (not scheduling calls) catches an interval registered at
 * load that keeps firing forever.
 */
const COUNTERS_INIT = `(() => {
  const c = { timers: 0, raf: 0 };
  Object.defineProperty(window, '__perfCounters', { value: c });
  const wrap = (name, key) => {
    const orig = window[name].bind(window);
    window[name] = (fn, ...rest) => orig(
      typeof fn === 'function' ? function (...a) { c[key] += 1; return fn.apply(this, a); } : fn,
      ...rest,
    );
  };
  wrap('setTimeout', 'timers'); wrap('setInterval', 'timers'); wrap('requestAnimationFrame', 'raf');
})();`

const round1 = (n: number) => Math.round(n * 10) / 10

function frameworkFiles(buildDir: string): Set<string> {
  const manifest = JSON.parse(readFileSync(join(buildDir, 'build-manifest.json'), 'utf8'))
  // rootMainFiles = framework runtime loaded on every App Router page. Polyfills load with
  // `nomodule`, so modern browsers never request them; they are excluded on purpose.
  return new Set<string>((manifest.rootMainFiles ?? []).map((f: string) => `/_next/${f}`))
}

async function taskSeconds(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Performance.enable')
  return async () => {
    const { metrics } = await cdp.send('Performance.getMetrics')
    const get = (name: string) => metrics.find((m) => m.name === name)?.value ?? 0
    return { task: get('TaskDuration'), heap: get('JSHeapUsedSize') }
  }
}

export async function measure(
  url: string,
  opts: { buildDir?: string; hidden?: boolean; settleMs?: number; idleMs?: number } = {},
): Promise<PageMetrics> {
  const settleMs = opts.settleMs ?? SETTLE_MS
  const idleMs = opts.idleMs ?? IDLE_MS
  const framework = opts.buildDir ? frameworkFiles(opts.buildDir) : null
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.addInitScript(COUNTERS_INIT)
    const pending: Promise<void>[] = []
    const bytes = { script: 0, stylesheet: 0, font: 0, total: 0, scriptGz: 0, scriptBr: 0, frameworkGz: 0 }
    const fontBytesByUrl = new Map<string, number>()
    let requestCount = 0

    page.on('requestfinished', (request) => {
      pending.push(
        (async () => {
          const s = await request.sizes()
          const size = s.responseBodySize + s.responseHeadersSize
          requestCount += 1
          bytes.total += size
          const type = request.resourceType()
          if (type === 'stylesheet') bytes.stylesheet += size
          if (type === 'font') {
            bytes.font += size
            fontBytesByUrl.set(request.url(), size)
          }
          if (type === 'script') {
            bytes.script += size
            const body = await (await request.response())?.body().catch(() => null)
            if (body) {
              const gz = gzipSync(body, { level: 6 }).length
              bytes.scriptGz += gz
              bytes.scriptBr += brotliCompressSync(body, {
                params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
              }).length
              if (framework?.has(new URL(request.url()).pathname)) bytes.frameworkGz += gz
            }
          }
        })(),
      )
    })

    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(settleMs)
    await Promise.all(pending)

    const preloadHrefs = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="preload"][as="font"]')].map((l) => l.href),
    )
    const preloadedFontBytes = preloadHrefs.reduce((sum, href) => sum + (fontBytesByUrl.get(href) ?? 0), 0)

    // Idle window, tab visible: nothing should run.
    const sample = await taskSeconds(page)
    await page.evaluate(() => {
      const c = (window as unknown as { __perfCounters: { timers: number; raf: number } }).__perfCounters
      c.timers = 0
      c.raf = 0
    })
    const idleStart = await sample()
    await page.waitForTimeout(idleMs)
    const idleEnd = await sample()
    const counters = await page.evaluate(
      () => (window as unknown as { __perfCounters: { timers: number; raf: number } }).__perfCounters,
    )
    const infiniteAnimations = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations === Infinity && a.playState === 'running').length,
    )

    // Scripted scroll through the whole page: how much main-thread work does scrolling cost?
    const scrollStart = await sample()
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 400) {
      await page.mouse.wheel(0, 400)
      await page.waitForTimeout(50)
    }
    await page.waitForTimeout(500)
    const scrollEnd = await sample()

    const heapGrowthMB = await interactionHeapGrowth(page)

    return {
      url,
      requestCount,
      totalBytes: bytes.total,
      scriptBytes: bytes.script,
      stylesheetBytes: bytes.stylesheet,
      fontBytes: bytes.font,
      preloadedFontBytes,
      scriptGzipBytes: bytes.scriptGz,
      scriptBrotliBytes: bytes.scriptBr,
      frameworkScriptGzipBytes: framework ? bytes.frameworkGz : null,
      appScriptGzipBytes: framework ? bytes.scriptGz - bytes.frameworkGz : null,
      infiniteAnimations,
      idleTaskMs: round1((idleEnd.task - idleStart.task) * 1000),
      timersAfterLoad: counters.timers,
      rafAfterLoad: counters.raf,
      scrollTaskMs: round1((scrollEnd.task - scrollStart.task) * 1000),
      jsHeapUsedMB: Math.round((idleEnd.heap / 2 ** 20) * 100) / 100,
      heapGrowthMB,
      hidden: opts.hidden === false ? null : await measureHidden(url, { settleMs, idleMs }),
    }
  } finally {
    await browser.close()
  }
}

/**
 * Leak check for in-page interaction: open and close every visible disclosure (<details>) for
 * 10 cycles, force garbage collection, and compare the heap after cycle 2 with cycle 10.
 * Page navigations are full loads (fresh documents), so in-page interaction is where a leak could
 * accumulate. Returns null when the page has no visible disclosure.
 */
async function interactionHeapGrowth(page: Page): Promise<number | null> {
  const summaries = page.locator('details > summary:visible')
  const count = await summaries.count()
  if (count === 0) return null
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('HeapProfiler.enable')
  const heapAfterGc = async () => {
    await cdp.send('HeapProfiler.collectGarbage')
    const { usedSize } = await cdp.send('Runtime.getHeapUsage')
    return usedSize / 2 ** 20
  }
  let atCycle2 = 0
  for (let cycle = 1; cycle <= 10; cycle++) {
    for (let i = 0; i < count; i++) {
      const summary = summaries.nth(i)
      await summary.click()
      await summary.click()
    }
    if (cycle === 2) atCycle2 = await heapAfterGc()
  }
  const atCycle10 = await heapAfterGc()
  return Math.round((atCycle10 - atCycle2) * 100) / 100
}

/**
 * Background-tab cost. Playwright keeps every page "visible" (flags, focus emulation, per-page
 * windows), so this drives the same Chromium binary over raw CDP: a headed window parked
 * off-screen, with the page opened as a background tab. The page stays `hidden` for its whole
 * life, which is what a backgrounded tab costs. Proven by --self-test on a busy fixture.
 */
export async function measureHidden(
  url: string,
  opts: { settleMs?: number; idleMs?: number } = {},
): Promise<{ visibility: string; taskMs: number }> {
  const settleMs = opts.settleMs ?? SETTLE_MS
  const idleMs = opts.idleMs ?? IDLE_MS
  const userDir = mkdtempSync(join(tmpdir(), 'measure-hidden-'))
  const port = 9400 + Math.floor(Math.random() * 400)
  const proc = spawn(
    chromium.executablePath(),
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--window-position=-32000,-32000',
      '--window-size=1280,800',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  let ws: WebSocket | undefined
  try {
    let version: { webSocketDebuggerUrl: string } | undefined
    for (let i = 0; i < 100 && !version; i++) {
      try {
        version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
      } catch {
        await sleep(100)
      }
    }
    if (!version) throw new Error('hidden-tab browser did not start')
    const socket = new WebSocket(version.webSocketDebuggerUrl)
    ws = socket
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true })
      socket.addEventListener('error', reject, { once: true })
    })
    let nextId = 0
    const waiters = new Map<number, (m: { result?: unknown; error?: { message: string } }) => void>()
    socket.addEventListener('message', (event) => {
      const msg = JSON.parse(String(event.data))
      if (msg.id && waiters.has(msg.id)) {
        waiters.get(msg.id)!(msg)
        waiters.delete(msg.id)
      }
    })
    const send = <T>(method: string, params: object = {}, sessionId?: string) =>
      new Promise<T>((resolve, reject) => {
        const id = ++nextId
        waiters.set(id, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result as T)))
        socket.send(JSON.stringify({ id, method, params, sessionId }))
      })

    const { targetId } = await send<{ targetId: string }>('Target.createTarget', { url, background: true })
    const { sessionId } = await send<{ sessionId: string }>('Target.attachToTarget', { targetId, flatten: true })
    await sleep(settleMs + 3000) // load in the background, then settle
    await send('Performance.enable', {}, sessionId)
    const task = async () =>
      (await send<{ metrics: { name: string; value: number }[] }>('Performance.getMetrics', {}, sessionId)).metrics.find(
        (m) => m.name === 'TaskDuration',
      )?.value ?? 0
    const visibility = async () =>
      (
        await send<{ result: { value: string } }>(
          'Runtime.evaluate',
          { expression: 'document.visibilityState', returnByValue: true },
          sessionId,
        )
      ).result.value
    const start = await task()
    await sleep(idleMs)
    const end = await task()
    return { visibility: await visibility(), taskMs: round1((end - start) * 1000) }
  } finally {
    ws?.close()
    proc.kill()
    await sleep(300)
    try {
      rmSync(userDir, { recursive: true, force: true })
    } catch {
      // Chromium may still hold the profile briefly on Windows; the OS temp dir is cleaned later.
    }
  }
}

/** Returns the list of budget violations (empty when within budget). */
/**
 * Budget misses, as readable lines. The hidden-tab measurement needs a headed browser, so
 * environments without a display (CI) pass `requireHidden: false`; `pnpm perf` always requires it.
 */
export function budgetViolations(m: PageMetrics, { requireHidden = true }: { requireHidden?: boolean } = {}): string[] {
  const out: string[] = []
  const check = (key: string, value: number | null, max: number) => {
    if (value !== null && value > max) out.push(`${key} ${value} > ${max}`)
  }
  check('appScriptGzipBytes', m.appScriptGzipBytes, BUDGETS.appScriptGzipBytes)
  check('stylesheetBytes', m.stylesheetBytes, BUDGETS.stylesheetBytes)
  check('fontBytes', m.fontBytes, BUDGETS.fontBytes)
  check('preloadedFontBytes', m.preloadedFontBytes, BUDGETS.preloadedFontBytes)
  check('idleTaskMs', m.idleTaskMs, BUDGETS.idleTaskMs)
  check('timersAfterLoad', m.timersAfterLoad, BUDGETS.timersAfterLoad)
  check('rafAfterLoad', m.rafAfterLoad, BUDGETS.rafAfterLoad)
  check('infiniteAnimations', m.infiniteAnimations, BUDGETS.infiniteAnimations)
  check('jsHeapUsedMB', m.jsHeapUsedMB, BUDGETS.jsHeapUsedMB)
  check('heapGrowthMB', m.heapGrowthMB, BUDGETS.heapGrowthMB)
  if (m.hidden) {
    if (m.hidden.visibility !== 'hidden') out.push(`hidden tab reported visibility "${m.hidden.visibility}"`)
    check('hidden.taskMs', m.hidden.taskMs, BUDGETS.hiddenTaskMs)
  } else if (requireHidden) {
    out.push('hidden-tab measurement missing')
  }
  return out
}

/** Positive and negative controls: every detector must fire on the busy page and stay quiet on the quiet one. */
async function selfTest() {
  const html = (body: string) => 'data:text/html,' + encodeURIComponent(body)
  const quiet = html(
    '<!doctype html><title>quiet</title><p>Nothing runs here.</p><details><summary>More</summary><p>Static.</p></details>',
  )
  const busy = html(
    '<!doctype html><title>busy</title><style>@keyframes s{to{transform:rotate(1turn)}}' +
      'div{width:20px;height:20px;background:#000;animation:s 1s linear infinite}</style><div></div>' +
      '<script>setInterval(()=>{const t=performance.now();while(performance.now()-t<5){}},100);' +
      '(function f(){requestAnimationFrame(f)})()</script>' +
      '<details id="leaky"><summary>More</summary><p>Leaks on every toggle.</p></details>' +
      '<script>window.leak=[];document.getElementById("leaky").addEventListener("toggle",()=>window.leak.push(new Array(200000).fill(1)))</script>',
  )
  const q = await measure(quiet, { settleMs: 500, idleMs: 3000 })
  const b = await measure(busy, { settleMs: 500, idleMs: 3000 })
  const results = [
    ['quiet: no timers', q.timersAfterLoad === 0],
    ['quiet: no rAF', q.rafAfterLoad === 0],
    ['quiet: no infinite animations', q.infiniteAnimations === 0],
    ['quiet: idle < 15ms', q.idleTaskMs < 15],
    ['quiet: hidden tab really hidden', q.hidden?.visibility === 'hidden'],
    ['quiet: hidden < 5ms', (q.hidden?.taskMs ?? 99) < 5],
    ['quiet: no heap growth over interaction cycles', (q.heapGrowthMB ?? 99) < 1],
    ['busy: timers counted', b.timersAfterLoad > 0],
    ['busy: rAF counted', b.rafAfterLoad > 0],
    ['busy: infinite animation found', b.infiniteAnimations >= 1],
    ['busy: idle work measured (> 100ms)', b.idleTaskMs > 100],
    ['busy: hidden tab really hidden', b.hidden?.visibility === 'hidden'],
    ['busy: hidden work measured (> 5ms)', (b.hidden?.taskMs ?? 0) > 5],
    ['busy: leak found by interaction cycles (> 5 MB)', (b.heapGrowthMB ?? 0) > 5],
  ] as const
  for (const [name, ok] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  console.log(JSON.stringify({ quiet: q, busy: b }, null, 2))
  if (results.some(([, ok]) => !ok)) process.exit(1)
}

async function main(argv: string[]) {
  if (argv.includes('--self-test')) return selfTest()
  const url = argv.find((a) => /^https?:\/\//.test(a))
  if (!url) {
    console.error('usage: tsx scripts/perf/measure.ts <url> [--out <file>] [--assert] [--build-dir <dir>] [--no-hidden]')
    process.exit(2)
  }
  const flag = (name: string) => {
    const i = argv.indexOf(name)
    return i !== -1 ? argv[i + 1] : undefined
  }
  const buildDir = flag('--build-dir')
  if (buildDir && !existsSync(join(buildDir, 'build-manifest.json'))) {
    console.error(`no build-manifest.json in ${buildDir}`)
    process.exit(2)
  }
  const hidden = !argv.includes('--no-hidden')
  const metrics = await measure(url, { buildDir, hidden })
  const json = JSON.stringify(metrics, null, 2)
  console.log(json)
  const out = flag('--out')
  if (out) {
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, json + '\n')
  }
  if (argv.includes('--assert')) {
    const violations = budgetViolations(metrics, { requireHidden: hidden })
    if (violations.length) {
      console.error('Budget violations:\n  ' + violations.join('\n  '))
      process.exit(1)
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
