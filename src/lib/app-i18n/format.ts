// Locale-aware formatting for the app languages (dates, relative times).

/** "2 days ago" / "yesterday" in the given locale, same buckets as formatRelativeDate. */
export function relativeDate(isoDate: string, locale: string, now: number = Date.now()): string {
  const diffDays = Math.floor((now - new Date(isoDate).getTime()) / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (diffDays < 7) return rtf.format(-diffDays, 'day')
  const weeks = Math.floor(diffDays / 7)
  if (weeks < 5) return rtf.format(-weeks, 'week')
  const months = Math.floor(diffDays / 30)
  if (months < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.floor(diffDays / 365), 'year')
}
