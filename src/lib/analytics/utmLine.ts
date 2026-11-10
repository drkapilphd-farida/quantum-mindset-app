// UTM params saved with each lead (owner's conversion brief): one line,
// "utm_source=meta, utm_campaign=…", only the utm_* keys, or null when none.
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export function utmToLine(utm: Record<string, string> | undefined): string | null {
  if (utm === undefined) return null
  const parts = KEYS.filter((key) => (utm[key] ?? '') !== '').map((key) => `${key}=${utm[key] ?? ''}`)
  return parts.length === 0 ? null : parts.join(', ')
}
