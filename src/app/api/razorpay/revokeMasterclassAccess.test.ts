import { describe, expect, it, vi, beforeEach } from 'vitest'

// Real revocation logic test (see the "Pre-Launch Audit Fix Pass" task,
// Phase 2) — mirrors the mocking convention deleteDocument.test.ts
// already established for service-role-client code: a small per-table
// mock keyed by whatever `.from(table)` is called with, since this
// function touches three real tables (masterclass_payments, plans,
// subscriptions) in sequence.

type PaymentRow = { user_id: string | null }
type PlanRow = { id: string; key: string }

const PAYMENT_ROW: PaymentRow = { user_id: 'user-1' }
const PLAN_ROW: PlanRow = { id: 'plan-1', key: 'qsr-masterclass' }

type MockConfig = {
  payment?: PaymentRow | null
  paymentError?: { message: string } | null
  plan?: PlanRow | null
  updateError?: { message: string } | null
}

function makeServiceClient({ payment = PAYMENT_ROW, paymentError = null, plan = PLAN_ROW, updateError = null }: MockConfig = {}): {
  from: (table: string) => unknown
} {
  const updateEq2 = vi.fn(() => Promise.resolve({ error: updateError }))
  const updateEq1 = vi.fn(() => ({ eq: updateEq2 }))
  const update = vi.fn(() => ({ eq: updateEq1 }))

  return {
    from: (table: string) => {
      if (table === 'masterclass_payments') {
        return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: payment, error: paymentError }) }) }) }
      }
      if (table === 'plans') {
        return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: plan, error: null }) }) }) }
      }
      if (table === 'subscriptions') {
        return { update }
      }
      throw new Error(`Unexpected table in test mock: ${table}`)
    },
  }
}

async function importRevoke(client: ReturnType<typeof makeServiceClient>): Promise<typeof import('./revokeMasterclassAccess')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => client }))
  return import('./revokeMasterclassAccess')
}

describe('revokeMasterclassAccessForPayment', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('revokes access (status: canceled) for the real user a payment was granted to', async () => {
    const client = makeServiceClient()
    const { revokeMasterclassAccessForPayment } = await importRevoke(client)

    const result = await revokeMasterclassAccessForPayment('pay_123')

    expect(result).toEqual({ ok: true, userId: 'user-1' })
  })

  it('does not throw or falsely succeed when the payment was never claimed by any user', async () => {
    const client = makeServiceClient({ payment: { user_id: null } })
    const { revokeMasterclassAccessForPayment } = await importRevoke(client)

    const result = await revokeMasterclassAccessForPayment('pay_unclaimed')

    expect(result).toEqual({ ok: false, reason: 'no_matched_user' })
  })

  it('reports payment_not_found for a refund on a payment this app never recorded', async () => {
    const client = makeServiceClient({ payment: null })
    const { revokeMasterclassAccessForPayment } = await importRevoke(client)

    const result = await revokeMasterclassAccessForPayment('pay_unknown')

    expect(result).toEqual({ ok: false, reason: 'payment_not_found' })
  })

  it('reports plan_not_found rather than silently no-op-ing if the qsr-masterclass plan is missing', async () => {
    const client = makeServiceClient({ plan: null })
    const { revokeMasterclassAccessForPayment } = await importRevoke(client)

    const result = await revokeMasterclassAccessForPayment('pay_123')

    expect(result).toEqual({ ok: false, reason: 'plan_not_found' })
  })

  it('surfaces a db_error (not a false success) if the subscription update itself fails', async () => {
    const client = makeServiceClient({ updateError: { message: 'connection reset' } })
    const { revokeMasterclassAccessForPayment } = await importRevoke(client)

    const result = await revokeMasterclassAccessForPayment('pay_123')

    expect(result).toEqual({ ok: false, reason: 'db_error', detail: 'connection reset' })
  })
})
