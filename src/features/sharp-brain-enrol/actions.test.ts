import { afterEach, describe, expect, it, vi } from 'vitest'

async function load(options: { seats: number | null; linkOk?: boolean }): Promise<{ actions: typeof import('./actions'); created: unknown[] }> {
  const created: unknown[] = []
  vi.resetModules()
  vi.stubEnv('VERCEL_ENV', 'production')
  vi.doMock('@/lib/rateLimit', () => ({ checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }), getClientIp: () => Promise.resolve('1.1.1.1') }))
  vi.doMock('@/lib/razorpay/paymentLinksApi', () => ({
    createPaymentLink: (input: unknown) => {
      created.push(input)
      return Promise.resolve(options.linkOk === false ? { ok: false, status: null } : { ok: true, id: 'plink_new', url: 'https://rzp.io/rzp/NEW' })
    },
  }))
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => ({
      from: () => {
        const b: Record<string, unknown> = {
          select: () => b,
          in: () => b,
          is: () => Promise.resolve(options.seats === null ? { count: null, error: { code: 'XX' } } : { count: options.seats, error: null }),
        }
        return b
      },
    }),
  }))
  return { actions: await import('./actions'), created }
}

describe('startSharpBrainCheckout', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('₹2,999 while intro seats are left — offer parent_2999 in the notes, a short-lived link', async () => {
    const { actions, created } = await load({ seats: 37 })
    const before = Date.now()
    expect(await actions.startSharpBrainCheckout({ email: 'Buyer@Example.com', name: 'Asha' })).toEqual({ ok: true, url: 'https://rzp.io/rzp/NEW', amountInr: 2999, seatsLeft: 63 })
    expect(created[0]).toMatchObject({ amountInr: 2999, notes: { program: 'sharp_brain_30', offer: 'parent_2999' }, customerEmail: 'buyer@example.com', customerName: 'Asha' })
    const expireAtMs = (created[0] as { expireAtMs: number }).expireAtMs
    expect(expireAtMs - before).toBeGreaterThanOrEqual(30 * 60_000 - 1000)
    expect(expireAtMs - before).toBeLessThanOrEqual(30 * 60_000 + 1000)
  })

  it('switches to ₹3,999 at seat 100 — the browser cannot ask for a price', async () => {
    const { actions, created } = await load({ seats: 100 })
    expect(await actions.startSharpBrainCheckout({ email: 'a@b.co', amountInr: 2999, offer: 'parent_2999' })).toMatchObject({ ok: true, amountInr: 3999, seatsLeft: 0 })
    expect(created[0]).toMatchObject({ amountInr: 3999, notes: { offer: 'parent_3999' } })
  })

  it('production ignores ?seats= simulation', async () => {
    const { actions } = await load({ seats: 5 })
    expect(await actions.startSharpBrainCheckout({ email: 'a@b.co', simulateSeats: '100' })).toMatchObject({ amountInr: 2999, seatsLeft: 95 })
  })

  it('never charges when the seat count cannot be read, or the link cannot be made (→ WhatsApp)', async () => {
    const unread = await load({ seats: null })
    expect(await unread.actions.startSharpBrainCheckout({ email: 'a@b.co' })).toEqual({ ok: false, reason: 'unavailable' })
    expect(unread.created).toHaveLength(0)
    const noKeys = await load({ seats: 3, linkOk: false })
    expect(await noKeys.actions.startSharpBrainCheckout({ email: 'a@b.co' })).toEqual({ ok: false, reason: 'unavailable' })
  })

  it('needs a valid email (sent to Razorpay so the payment can be matched to an account)', async () => {
    const { actions, created } = await load({ seats: 0 })
    expect(await actions.startSharpBrainCheckout({ email: 'not-an-email' })).toEqual({ ok: false, reason: 'invalid_email' })
    expect(await actions.startSharpBrainCheckout({})).toEqual({ ok: false, reason: 'invalid_email' })
    expect(created).toHaveLength(0)
  })
})
