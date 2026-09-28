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

const linkPaid = (shortUrl: string): unknown => ({
  event: 'payment_link.paid',
  payload: {
    payment_link: { entity: { id: 'plink_1', short_url: shortUrl } },
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
