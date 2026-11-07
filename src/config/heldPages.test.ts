import { describe, expect, it } from 'vitest'
import { HELD_PAGE_REDIRECTS } from './heldPages'
import { LEGACY_REDIRECTS } from './legacyRedirects'

describe('held pages (Nov 2026)', () => {
  const sources = HELD_PAGE_REDIRECTS.map((r) => r.source)

  it('sends every telepathy, traders and Vadodara page to Personal Sessions, temporarily', () => {
    for (const path of ['/telepathy-workshop', '/telepathy-workshop/hi', '/telepathy-workshop/en', '/telepathy-workshop/online', '/telepathy-workshop/traders', '/vadodara', '/telepathy']) {
      expect(HELD_PAGE_REDIRECTS).toContainEqual({ source: path, destination: '/personal-sessions', permanent: false })
    }
  })

  it('keeps the ₹1,000 booking thank-you page reachable', () => {
    expect(sources).not.toContain('/telepathy-workshop/booked')
  })

  it('never clashes with a permanent redirect', () => {
    const legacy = new Set(LEGACY_REDIRECTS.map((r) => r.source))
    expect(sources.filter((s) => legacy.has(s))).toEqual([])
  })
})
