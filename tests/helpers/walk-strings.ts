export interface StringAt {
  path: string
  value: string
}

/** Every string reachable inside `value`, with a dotted path (`projects.0.built.2`). */
export function walkStrings(value: unknown, skip: (path: string) => boolean = () => false, path = ''): StringAt[] {
  if (skip(path)) return []
  if (typeof value === 'string') return [{ path, value }]
  if (Array.isArray(value)) return value.flatMap((v, i) => walkStrings(v, skip, path ? `${path}.${i}` : String(i)))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => walkStrings(v, skip, path ? `${path}.${k}` : k))
  }
  return []
}

/** Case- and punctuation-insensitive form used for term matching. */
export function normalize(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}
