import { describe, expect, test } from 'vitest'
import { createRateLimiter } from '@/lib/contact/rate-limit'

describe('rate limiter (sliding window)', () => {
  test('allows the limit, blocks the next, and allows again after the window', () => {
    let t = 0
    const rl = createRateLimiter({ limit: 5, windowMs: 600_000, now: () => t })
    for (let i = 0; i < 5; i++) expect(rl.check('ip').allowed).toBe(true)
    const blocked = rl.check('ip')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSec).toBeGreaterThan(0)
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(600)
    t = 600_001
    expect(rl.check('ip').allowed).toBe(true)
  })

  test('keys are independent', () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 })
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(false)
    expect(rl.check('b').allowed).toBe(true)
  })

  test('memory stays bounded: the oldest key is evicted', () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3, now: () => 0 })
    for (const k of ['k1', 'k2', 'k3', 'k4']) rl.check(k)
    expect(rl.size()).toBe(3)
    expect(rl.check('k1').allowed).toBe(true) // k1 was evicted, so it starts fresh
  })
})
