export interface RateLimiter {
  check(key: string): { allowed: boolean; retryAfterSec: number }
  /** Number of tracked keys (for tests and bounds). */
  size(): number
}

/**
 * Sliding-window limiter held in memory. Best effort on serverless: each instance has its own
 * memory, so the effective limit is per instance. Memory is bounded: past `maxKeys`, the least
 * recently seen key is evicted (a Map keeps insertion order; touching a key re-inserts it).
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
  now = Date.now,
}: {
  limit: number
  windowMs: number
  maxKeys?: number
  now?: () => number
}): RateLimiter {
  const hits = new Map<string, number[]>()
  const touch = (key: string, times: number[]) => {
    hits.delete(key)
    hits.set(key, times)
    while (hits.size > maxKeys) {
      const oldest = hits.keys().next().value
      if (oldest === undefined) break
      hits.delete(oldest)
    }
  }
  return {
    check(key) {
      const t = now()
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs)
      if (recent.length >= limit) {
        touch(key, recent)
        return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((recent[0] + windowMs - t) / 1000)) }
      }
      recent.push(t)
      touch(key, recent)
      return { allowed: true, retryAfterSec: 0 }
    },
    size: () => hits.size,
  }
}
