import { beforeEach, describe, expect, it, vi } from 'vitest'

let saveResult: 'created' | 'exists' | 'failed' = 'created'
const confirmations: string[] = []
const notices: unknown[] = []
vi.mock('./registrations', () => ({ saveRegistration: async () => saveResult }))
vi.mock('@/lib/email/sendCalmBatchEmails', () => ({
  sendCalmConfirmation: async (reg: { paymentId: string }) => void confirmations.push(reg.paymentId),
  sendCalmAdminNotice: async (_reg: unknown, ctx: unknown) => void notices.push(ctx),
}))

const { finalizeCalmRegistration } = await import('./finalize')
const reg = { name: 'Asha', phone: '+919811111111', email: 'a@x.in', paymentId: 'pay_1', orderId: 'order_1', batch: '2026-12-01', utm: null }

describe('finalizeCalmRegistration', () => {
  beforeEach(() => {
    confirmations.length = 0
    notices.length = 0
  })

  it('emails only when this call created the registration (browser and webhook never double-email)', async () => {
    saveResult = 'created'
    expect(await finalizeCalmRegistration(reg, 'checkout')).toBe('created')
    saveResult = 'exists'
    expect(await finalizeCalmRegistration(reg, 'webhook')).toBe('exists')
    expect(confirmations).toEqual(['pay_1'])
  })

  it('tells the owner about webhook-only payments', async () => {
    saveResult = 'created'
    await finalizeCalmRegistration(reg, 'webhook')
    expect(notices).toHaveLength(1)
    expect(notices[0]).toMatchObject({ source: 'webhook', saved: true })
  })
})
