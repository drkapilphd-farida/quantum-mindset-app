import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// A tiny in-memory sharp_brain_offers table with the real UNIQUE
// (whatsapp_number) behaviour of upsert(…, { ignoreDuplicates: true }).
type Row = { id: string; whatsapp_number: string; expires_at: string; redeemed_at: string | null; created_at: string }

function fakeOffers(rows: Row[]): { from: (t: string) => unknown } {
  return {
    from: () => {
      let filter: [keyof Row, string] | null = null
      const b: Record<string, unknown> = {
        upsert: (v: Omit<Row, 'id' | 'redeemed_at'>) => {
          if (!rows.some((r) => r.whatsapp_number === v.whatsapp_number)) {
            rows.push({ ...v, id: `00000000-0000-4000-8000-00000000000${rows.length + 1}`, redeemed_at: null })
          }
          return Promise.resolve({ error: null })
        },
        select: () => b,
        eq: (k: keyof Row, v: string) => ((filter = [k, v]), b),
        maybeSingle: () => Promise.resolve({ data: rows.find((r) => filter !== null && r[filter[0]] === filter[1]) ?? null, error: null }),
      }
      return b
    },
  }
}

// The early-bird / regular engine is tested with a two-price fixture
// (₹9,999 regular, ₹8,999 early-bird). The real config is one flat
// ₹8,999 since Nov 2026 — see the "real price" test at the bottom.
function mockTwoPriceConfig(): void {
  vi.doMock('@/config/site.config', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/config/site.config')>()
    return { ...original, sharpBrainEnrolment: { ...original.sharpBrainEnrolment, regularInr: 9999 } }
  })
}

async function load(rows: Row[]): Promise<typeof import('./server')> {
  vi.resetModules()
  mockTwoPriceConfig()
  vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => fakeOffers(rows) }))
  return import('./server')
}

const ist = (iso: string): number => new Date(`${iso}+05:30`).getTime()

describe('Reading Speed Test offer', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
  })

  it('is created once per WhatsApp number, valid 48 hours', async () => {
    vi.setSystemTime(ist('2026-10-12T10:00:00'))
    const rows: Row[] = []
    const { getOrCreateTestOffer } = await load(rows)
    const offer = await getOrCreateTestOffer('919876543210', null)
    expect(offer?.expiresAtMs).toBe(ist('2026-10-14T10:00:00'))
    expect(rows).toHaveLength(1)
  })

  it('a retake later never creates a second offer or restarts the 48 hours', async () => {
    const rows: Row[] = []
    const { getOrCreateTestOffer } = await load(rows)
    vi.setSystemTime(ist('2026-10-12T10:00:00'))
    const first = await getOrCreateTestOffer('919876543210', null)
    vi.setSystemTime(ist('2026-10-13T22:00:00'))
    const again = await getOrCreateTestOffer('919876543210', null)
    expect(again).toEqual(first)
    expect(rows).toHaveLength(1)
  })

  it('after expiry the same number gets no new offer', async () => {
    const rows: Row[] = []
    const { getOrCreateTestOffer, activeOffer } = await load(rows)
    vi.setSystemTime(ist('2026-10-12T10:00:00'))
    await getOrCreateTestOffer('919876543210', null)
    vi.setSystemTime(ist('2026-10-20T10:00:00'))
    const later = await getOrCreateTestOffer('919876543210', null)
    expect(activeOffer(later, Date.now())).toBeNull()
    expect(rows).toHaveLength(1)
  })

  it('a different number gets its own offer', async () => {
    const rows: Row[] = []
    const { getOrCreateTestOffer } = await load(rows)
    await getOrCreateTestOffer('919876543210', null)
    await getOrCreateTestOffer('919812345678', null)
    expect(rows).toHaveLength(2)
  })

  it('a redeemed offer is no longer active', async () => {
    const { activeOffer } = await load([])
    expect(activeOffer({ id: 'x', whatsappNumber: '91', expiresAtMs: Date.now() + 1000, redeemed: true }, Date.now())).toBeNull()
  })
})

describe('server clock', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('ignores ?now= on production', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    const { resolveNow } = await load([])
    expect(Math.abs(resolveNow('2030-01-01T00:00:00+05:30') - Date.now())).toBeLessThan(1000)
  })

  it('simulates ?now= on preview', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    const { resolveNow } = await load([])
    expect(resolveNow('2026-10-12T10:00:00+05:30')).toBe(ist('2026-10-12T10:00:00'))
  })

  it('does not offer discounts on production until they can be charged', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    vi.stubEnv('RAZORPAY_KEY_ID', '')
    const { pricingSnapshot } = await load([])
    expect(pricingSnapshot(ist('2026-10-01T10:00:00')).batches[0]).toMatchObject({ amountInr: 9999, offer: 'regular' })
    vi.stubEnv('RAZORPAY_KEY_ID', 'rzp_live_x')
    vi.stubEnv('RAZORPAY_KEY_SECRET', 'secret')
    expect(pricingSnapshot(ist('2026-10-01T10:00:00')).batches[0]).toMatchObject({ amountInr: 8999, offer: 'earlybird' })
  })
})

describe('real price (owner, Nov 2026)', () => {
  it('charges one flat ₹8,999 for the live batch, with no early-bird countdown', async () => {
    vi.resetModules()
    vi.doUnmock('@/config/site.config')
    vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => fakeOffers([]) }))
    vi.stubEnv('VERCEL_ENV', 'preview')
    const { pricingSnapshot } = await import('./server')
    for (const at of ['2026-11-07T10:00:00', '2026-11-12T10:00:00', '2026-11-22T10:00:00']) {
      const batch = pricingSnapshot(new Date(`${at}+05:30`).getTime()).batches[0]
      expect(batch).toMatchObject({ amountInr: 8999, regularInr: 8999, offer: 'regular' })
    }
    vi.unstubAllEnvs()
  })
})
