import { beforeEach, describe, expect, it, vi } from 'vitest'

const calmCalls: unknown[][] = []
const clarityCalls: unknown[][] = []
vi.mock('@/features/calm-batch/finalize', () => ({ finalizeCalmRegistration: async (...args: unknown[]) => (calmCalls.push(args), 'created') }))
vi.mock('@/features/clarity-session/paidRecords', () => ({ finalizeClarityPayment: async (...args: unknown[]) => (clarityCalls.push(args), 'created') }))

const { handlePaymentCaptured } = await import('./paymentCaptured')
const { idFromKey } = await import('@/lib/idFromKey')

const event = (entity: Record<string, unknown>): Record<string, unknown> => ({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1', currency: 'INR', email: 'a@b.in', contact: '+919999999999', ...entity } } } })
const noOrderNotes = async (): Promise<Record<string, string>> => ({})

describe('Razorpay payment.captured (owner, Nov 2026)', () => {
  beforeEach(() => {
    calmCalls.length = 0
    clarityCalls.length = 0
  })

  it('saves a Calm Mind batch payment (from the webhook) with the buyer details from the notes', async () => {
    const outcome = await handlePaymentCaptured(event({ amount: 399900, notes: { product: 'calm-mind-batch', batch: '2027-01-01', name: 'Asha', email: 'asha@x.in', phone: '+919811111111', utm_source: 'meta' } }), noOrderNotes)
    expect(outcome).toBe('calm')
    expect(calmCalls[0]).toEqual([{ name: 'Asha', phone: '+919811111111', email: 'asha@x.in', paymentId: 'pay_1', orderId: 'order_1', batch: '2027-01-01', utm: 'utm_source=meta' }, 'webhook'])
  })

  it('falls back to the order notes when the payment has none', async () => {
    const outcome = await handlePaymentCaptured(event({ amount: 399900, notes: [] }), async () => ({ product: 'calm-mind-batch', batch: '2027-01-01', name: 'Ravi' }))
    expect(outcome).toBe('calm')
    expect((calmCalls[0]?.[0] as { name: string }).name).toBe('Ravi')
  })

  it('saves a Clarity Session payment', async () => {
    const outcome = await handlePaymentCaptured(event({ amount: 110000, notes: { product: 'Clarity Session (60 min)', program: 'telepathy' } }), noOrderNotes)
    expect(outcome).toBe('clarity')
    expect(clarityCalls[0]).toEqual([{ paymentId: 'pay_1', orderId: 'order_1', email: 'a@b.in', phone: '+919999999999', program: 'telepathy', utm: null }, 'webhook'])
  })

  it('refuses a wrong amount and ignores other payments', async () => {
    expect(await handlePaymentCaptured(event({ amount: 100, notes: { product: 'calm-mind-batch' } }), noOrderNotes)).toBe('amount-mismatch')
    expect(await handlePaymentCaptured(event({ amount: 899900, notes: { product: 'sharp-brain' } }), noOrderNotes)).toBe('ignored')
    expect(await handlePaymentCaptured({ event: 'payment.captured', payload: {} }, noOrderNotes)).toBe('ignored')
    expect(calmCalls).toHaveLength(0)
    expect(clarityCalls).toHaveLength(0)
  })

  it('follows up Razorpay payment-link payments, matched by amount (owner, 24 Nov 2026)', async () => {
    const seen: { id: string; email: string; phone: string; amountInr: number }[] = []
    const followUp = async (pay: { product: { id: string }; email: string; phone: string; amountInr: number }): Promise<void> => {
      seen.push({ id: pay.product.id, email: pay.email, phone: pay.phone, amountInr: pay.amountInr })
    }
    expect(await handlePaymentCaptured(event({ amount: 49900, order_id: null }), noOrderNotes, followUp)).toBe('link')
    expect(await handlePaymentCaptured(event({ amount: 499900, order_id: null }), noOrderNotes, followUp)).toBe('link')
    expect(await handlePaymentCaptured(event({ amount: 300000, order_id: null }), noOrderNotes, followUp)).toBe('link')
    expect(await handlePaymentCaptured(event({ amount: 99900, order_id: null }), noOrderNotes, followUp)).toBe('link')
    expect(seen.map((x) => x.id)).toEqual(['sb-workshop-499', 'sb-live-4999', 'sb-offline-registration', 'telepathy-999'])
    expect(seen[0]).toMatchObject({ email: 'a@b.in', phone: '+919999999999', amountInr: 499 })
    // An unknown amount, or a product-tagged payment, is not a payment-link product.
    expect(await handlePaymentCaptured(event({ amount: 12300, order_id: null }), noOrderNotes, followUp)).toBe('ignored')
    expect(await handlePaymentCaptured(event({ amount: 499900, notes: { product: 'sharp-brain' } }), noOrderNotes, followUp)).toBe('ignored')
    expect(seen).toHaveLength(4)
  })

  it('derives one stable row id per payment, so the database refuses a duplicate', () => {
    expect(idFromKey('calm-batch:pay_1')).toBe(idFromKey('calm-batch:pay_1'))
    expect(idFromKey('calm-batch:pay_1')).not.toBe(idFromKey('calm-batch:pay_2'))
    expect(idFromKey('calm-batch:pay_1')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
})
