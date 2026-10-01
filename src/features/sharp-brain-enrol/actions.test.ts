import { afterEach, describe, expect, it, vi } from 'vitest'

const ist = (iso: string): number => new Date(`${iso}+05:30`).getTime()
const OFFER_ID = '7f0c2f5e-9a51-4c43-9d8a-2a9c4b1f0e11'

type Offer = { id: string; whatsapp_number: string; expires_at: string; redeemed_at: string | null }

async function load(options: { api: boolean; offer?: Offer | null }): Promise<{ actions: typeof import('./actions'); created: unknown[] }> {
  const created: unknown[] = []
  vi.resetModules()
  vi.stubEnv('VERCEL_ENV', 'preview')
  vi.doMock('@/lib/rateLimit', () => ({ checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }), getClientIp: () => Promise.resolve('1.1.1.1') }))
  vi.doMock('@/lib/razorpay/paymentLinksApi', () => ({
    hasPaymentLinksApi: () => options.api,
    createPaymentLink: (input: unknown) => {
      created.push(input)
      return Promise.resolve({ ok: true, id: 'plink_new', url: 'https://rzp.io/rzp/NEW' })
    },
  }))
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => ({
      from: () => {
        const b: Record<string, unknown> = { select: () => b, eq: () => b, maybeSingle: () => Promise.resolve({ data: options.offer ?? null, error: null }) }
        return b
      },
    }),
  }))
  return { actions: await import('./actions'), created }
}

describe('startSharpBrainCheckout', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('creates an early-bird link that expires at the early-bird deadline, with batch and offer in the notes', async () => {
    const { actions, created } = await load({ api: true })
    const result = await actions.startSharpBrainCheckout({ batch: '2026-10-15', simulateNow: '2026-10-05T10:00:00+05:30' })
    expect(result).toEqual({ ok: true, url: 'https://rzp.io/rzp/NEW' })
    expect(created[0]).toMatchObject({
      amountInr: 8999,
      expireAtMs: ist('2026-10-11T00:00:00'),
      notes: { program: 'sharp_brain_30', batch: '2026-10-15', offer: 'earlybird' },
    })
  })

  it('charges the regular price after the deadline', async () => {
    const { actions, created } = await load({ api: true })
    await actions.startSharpBrainCheckout({ batch: '2026-10-15', simulateNow: '2026-10-12T10:00:00+05:30' })
    expect(created[0]).toMatchObject({ amountInr: 9999, notes: { offer: 'regular' } })
  })

  it('prices each batch separately: the 25th batch is still early-bird on the 12th', async () => {
    const { actions, created } = await load({ api: true })
    await actions.startSharpBrainCheckout({ batch: '2026-10-25', simulateNow: '2026-10-12T10:00:00+05:30' })
    expect(created[0]).toMatchObject({ amountInr: 8999, notes: { offer: 'earlybird', batch: '2026-10-25' } })
  })

  it('refuses a batch that is not one of the next two', async () => {
    const { actions, created } = await load({ api: true })
    expect(await actions.startSharpBrainCheckout({ batch: '2026-11-25', simulateNow: '2026-10-05T10:00:00+05:30' })).toEqual({ ok: false, reason: 'batch_closed' })
    expect(created).toHaveLength(0)
  })

  it('applies an active test offer: ₹8,999, phone prefilled, link expires with the offer', async () => {
    const expires = '2026-10-14T04:30:00.000Z'
    const { actions, created } = await load({ api: true, offer: { id: OFFER_ID, whatsapp_number: '919876543210', expires_at: expires, redeemed_at: null } })
    await actions.startSharpBrainCheckout({ batch: '2026-10-15', offerId: OFFER_ID, simulateNow: '2026-10-12T10:00:00+05:30' })
    expect(created[0]).toMatchObject({
      amountInr: 8999,
      customerContact: '919876543210',
      expireAtMs: Date.parse(expires),
      notes: { offer: 'test1000', offer_id: OFFER_ID },
    })
  })

  it('ignores an expired or used test offer', async () => {
    const used = { id: OFFER_ID, whatsapp_number: '919876543210', expires_at: '2026-10-14T04:30:00.000Z', redeemed_at: '2026-10-12T05:00:00.000Z' }
    const { actions, created } = await load({ api: true, offer: used })
    await actions.startSharpBrainCheckout({ batch: '2026-10-15', offerId: OFFER_ID, simulateNow: '2026-10-12T10:00:00+05:30' })
    expect(created[0]).toMatchObject({ amountInr: 9999, notes: { offer: 'regular' } })

    const expired = { ...used, redeemed_at: null }
    const second = await load({ api: true, offer: expired })
    await second.actions.startSharpBrainCheckout({ batch: '2026-10-15', offerId: OFFER_ID, simulateNow: '2026-10-14T10:00:01+05:30' })
    expect(second.created[0]).toMatchObject({ amountInr: 9999 })
  })

  it('without API keys uses the fixed regular link', async () => {
    const { actions, created } = await load({ api: false })
    const result = await actions.startSharpBrainCheckout({ batch: '2026-10-15', simulateNow: '2026-10-12T10:00:00+05:30' })
    expect(result).toEqual({ ok: true, url: 'https://rzp.io/rzp/ydVYaANF' })
    expect(created).toHaveLength(0)
  })

  it('without API keys and without a fixed ₹8,999 link, a discounted checkout is unavailable (WhatsApp instead)', async () => {
    const { actions } = await load({ api: false })
    expect(await actions.startSharpBrainCheckout({ batch: '2026-10-15', simulateNow: '2026-10-05T10:00:00+05:30' })).toEqual({ ok: false, reason: 'unavailable' })
  })
})
