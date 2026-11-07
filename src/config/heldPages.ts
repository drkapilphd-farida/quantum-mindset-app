// Owner (Nov 2026): business focus is Sharp Brain (₹2,999 Self / ₹8,999
// Live) and 1-on-1 Personal Sessions. The telepathy workshop pages (and
// the traders and Vadodara pages) are on hold: every link to them leads to
// the Personal Sessions page. TEMPORARY (307) redirects, not 301 — the
// pages stay in the code and come back by deleting entries here.
// /telepathy-workshop/booked (the thank-you page after a ₹1,000 booking)
// stays reachable for anyone who already paid.

type HeldRedirect = { source: string; destination: string; permanent: false }

export const PERSONAL_SESSIONS_PATH = '/personal-sessions'

const HELD_SOURCES = [
  '/telepathy-workshop',
  '/telepathy-workshop/en',
  '/telepathy-workshop/hi',
  '/telepathy-workshop/online',
  '/telepathy-workshop/traders',
  '/vadodara',
  // Old WordPress telepathy URLs (were 301 → /telepathy-workshop).
  '/telepathy',
  '/telepathycourse',
  '/telepathy-mind-reading-offline',
] as const

export const HELD_PAGE_REDIRECTS: HeldRedirect[] = HELD_SOURCES.map((source) => ({ source, destination: PERSONAL_SESSIONS_PATH, permanent: false }))
