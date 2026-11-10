import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { buildOrderBody, isValidPaymentSignature } from './ordersApi'

describe('Razorpay orders (Clarity Session)', () => {
  it('builds a ₹1,100 order in paise', () => {
    expect(buildOrderBody({ amountInr: 1100, receipt: 'clarity-1', notes: { product: 'Clarity Session (60 min)' } })).toEqual({
      amount: 110000,
      currency: 'INR',
      receipt: 'clarity-1',
      notes: { product: 'Clarity Session (60 min)' },
    })
  })

  it('accepts only a payment whose Checkout signature matches', () => {
    const good = createHmac('sha256', 'secret').update('order_1|pay_1').digest('hex')
    expect(isValidPaymentSignature('order_1', 'pay_1', good, 'secret')).toBe(true)
    expect(isValidPaymentSignature('order_1', 'pay_2', good, 'secret')).toBe(false)
    expect(isValidPaymentSignature('order_1', 'pay_1', good, 'other')).toBe(false)
    expect(isValidPaymentSignature('order_1', 'pay_1', '', 'secret')).toBe(false)
    expect(isValidPaymentSignature('order_1', 'pay_1', good, '')).toBe(false)
  })
})
