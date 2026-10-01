import { beforeEach, describe, expect, it, vi } from 'vitest'

type Call = { table: string; op: string; values?: unknown }
type Existing = { payment?: { id: string } | null; profile?: { id: string } | null; subscription?: { id: string; status: string } | null }

function fakeService(existing: Existing): { calls: Call[]; client: { from: (t: string) => unknown } } {
  const calls: Call[] = []
  const from = (table: string): unknown => {
    const call: Call = { table, op: 'select' }
    calls.push(call)
    const result = (): { data: unknown; error: null } => {
      if (call.op === 'insert' && table === 'masterclass_payments') return { data: { id: 'row-1' }, error: null }
      if (call.op !== 'select') return { data: null, error: null }
      if (table === 'masterclass_payments') return { data: existing.payment ?? null, error: null }
      if (table === 'profiles') return { data: existing.profile ?? null, error: null }
      if (table === 'plans') return { data: { id: 'plan-1' }, error: null }
      if (table === 'subscriptions') return { data: existing.subscription ?? null, error: null }
      return { data: null, error: null }
    }
    const b: Record<string, unknown> = {
      select: () => b,
      eq: () => b,
      is: () => b,
      insert: (v: unknown) => ((call.op = 'insert'), (call.values = v), b),
      update: (v: unknown) => ((call.op = 'update'), (call.values = v), b),
      single: () => Promise.resolve(result()),
      maybeSingle: () => Promise.resolve(result()),
      then: (f: (r: unknown) => unknown) => Promise.resolve(result()).then(f),
    }
    return b
  }
  return { calls, client: { from } }
}

async function post(body: unknown, existing: Existing = {}): Promise<{ status: number; calls: Call[] }> {
  const { calls, client } = fakeService(existing)
  vi.resetModules()
  vi.stubEnv('RAZORPAY_MASTERCLASS_WEBHOOK_SECRET', 'secret')
  vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => client }))
  vi.doMock('@/lib/razorpay/verifyWebhookSignature', () => ({ verifyRazorpayWebhookSignature: () => true }))
  vi.doMock('@/lib/rateLimit', () => ({ checkRateLimit: () => ({ allowed: true, retryAfterMs: 0 }), getClientIp: () => Promise.resolve('1.1.1.1') }))
  const { POST } = await import('./route')
  const request = new Request('https://example.com/api/razorpay/masterclass-webhook', {
    method: 'POST',
    headers: { 'x-razorpay-signature': 'sig' },
    body: JSON.stringify(body),
  })
  const response = await POST(request as never)
  return { status: response.status, calls }
}

const linkPaid = (shortUrl: string, notes: unknown = [], customer: unknown = null): unknown => ({
  event: 'payment_link.paid',
  payload: {
    payment_link: { entity: { id: 'plink_1', short_url: shortUrl, notes, customer } },
    payment: { entity: { id: 'pay_1', amount: 999900, currency: 'INR', email: 'buyer@example.com', contact: null } },
  },
})
const PROGRAM = 'https://rzp.io/rzp/ydVYaANF'
const writes = (calls: Call[], table: string): Call[] => calls.filter((c) => c.table === table && c.op !== 'select')

describe('masterclass webhook — program payments only, manual grants preserved', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('ignores payment.captured (no link information) without touching the database', async () => {
    const { status, calls } = await post({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_x', amount: 699900, currency: 'INR' } } } })
    expect(status).toBe(200)
    expect(calls).toHaveLength(0)
  })

  it('ignores payments for any other product link', async () => {
    const { status, calls } = await post(linkPaid('https://rzp.io/rzp/vecVC7sx'))
    expect(status).toBe(200)
    expect(calls).toHaveLength(0)
  })

  it('leaves a hand-granted (active) subscription untouched, but records the payment against that learner', async () => {
    const { status, calls } = await post(linkPaid(PROGRAM), { profile: { id: 'user-1' }, subscription: { id: 'sub-1', status: 'active' } })
    expect(status).toBe(200)
    expect(writes(calls, 'subscriptions')).toHaveLength(0)
    expect(writes(calls, 'masterclass_payments').map((c) => c.op)).toEqual(['insert', 'update'])
    expect(writes(calls, 'masterclass_payments')[1]?.values).toMatchObject({ user_id: 'user-1' })
  })

  it('reactivates a cancelled subscription instead of creating a second one', async () => {
    const { calls } = await post(linkPaid(PROGRAM), { profile: { id: 'user-1' }, subscription: { id: 'sub-1', status: 'canceled' } })
    const subWrites = writes(calls, 'subscriptions')
    expect(subWrites).toHaveLength(1)
    expect(subWrites[0]).toMatchObject({ op: 'update', values: { status: 'active', canceled_at: null } })
  })

  it('creates access for a new buyer', async () => {
    const { calls } = await post(linkPaid(PROGRAM), { profile: { id: 'user-2' }, subscription: null })
    expect(writes(calls, 'subscriptions')).toEqual([{ table: 'subscriptions', op: 'insert', values: expect.objectContaining({ user_id: 'user-2', status: 'active' }) }])
  })

  it('records but does not grant when no account matches yet (claimed on sign-up)', async () => {
    const { calls } = await post(linkPaid(PROGRAM), { profile: null })
    expect(writes(calls, 'masterclass_payments').map((c) => c.op)).toEqual(['insert'])
    expect(writes(calls, 'subscriptions')).toHaveLength(0)
  })

  it('does nothing on a repeated delivery of the same payment', async () => {
    const { calls } = await post(linkPaid(PROGRAM), { payment: { id: 'row-1' } })
    expect(calls.filter((c) => c.op !== 'select')).toHaveLength(0)
  })
})

describe('masterclass webhook — batches and offers (payment links created by our server)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  const OFFER_ID = '7f0c2f5e-9a51-4c43-9d8a-2a9c4b1f0e11'
  const apiLink = (notes: Record<string, string>): unknown => linkPaid('https://rzp.io/rzp/AbC123xy', notes, { name: 'Asha', contact: '+919999999999' })

  it('grants for any link with notes.program = sharp_brain_30 and saves offer, batch, name and link id', async () => {
    const { status, calls } = await post(apiLink({ program: 'sharp_brain_30', batch: '2026-10-15', offer: 'earlybird' }), { profile: { id: 'user-3' }, subscription: null })
    expect(status).toBe(200)
    expect(writes(calls, 'masterclass_payments')[0]?.values).toMatchObject({
      offer: 'earlybird',
      batch_start: '2026-10-15',
      customer_name: 'Asha',
      payment_link_id: 'plink_1',
      sharp_brain_offer_id: null,
    })
    expect(writes(calls, 'subscriptions')).toHaveLength(1)
  })

  it('marks a test offer used when it is paid', async () => {
    const { calls } = await post(apiLink({ program: 'sharp_brain_30', batch: '2026-10-25', offer: 'test1000', offer_id: OFFER_ID }), { profile: null })
    expect(writes(calls, 'masterclass_payments')[0]?.values).toMatchObject({ offer: 'test1000', sharp_brain_offer_id: OFFER_ID })
    expect(writes(calls, 'sharp_brain_offers')).toEqual([
      { table: 'sharp_brain_offers', op: 'update', values: expect.objectContaining({ razorpay_payment_id: 'pay_1' }) },
    ])
  })

  it('ignores links with other notes (another product created through the API)', async () => {
    const { status, calls } = await post(apiLink({ program: 'retreat_11_day' }))
    expect(status).toBe(200)
    expect(calls).toHaveLength(0)
  })

  it('drops note values that are not a known offer, a date or an offer id', async () => {
    const { calls } = await post(apiLink({ program: 'sharp_brain_30', batch: 'soon', offer: 'free', offer_id: 'x' }), { profile: null })
    expect(writes(calls, 'masterclass_payments')[0]?.values).toMatchObject({ offer: null, batch_start: null, sharp_brain_offer_id: null })
    expect(writes(calls, 'sharp_brain_offers')).toHaveLength(0)
  })

  it('still grants for the fixed ₹9,999 link, saved as a regular payment without a batch', async () => {
    const { calls } = await post(linkPaid(PROGRAM), { profile: null })
    expect(writes(calls, 'masterclass_payments')[0]?.values).toMatchObject({ offer: 'regular', batch_start: null })
  })
})
