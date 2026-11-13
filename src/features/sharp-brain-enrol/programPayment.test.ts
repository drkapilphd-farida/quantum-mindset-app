import { describe, expect, it } from 'vitest'
import { RAZORPAY_MASTERCLASS_PAYMENT_LINK } from '@/config/masterclassPaymentLink'
import { RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK } from '@/config/quantumMindsetHabitBuilderPaymentLink'
import { TELEPATHY_SEAT_PAYMENT_LINK } from '@/config/site.config'
import { paymentForLink } from '@/lib/razorpay/paymentLinkEvent'
import { SHARP_BRAIN_PROGRAM_NOTE, programPaymentFromEvent } from './programPayment'

// Razorpay webhooks are account-wide, so the Sharp Brain webhook (and the
// Habit Builder one) also receive the Telepathy Workshop ₹1,000 seat
// payments. Those must never grant app access or count as a Sharp Brain sale.

const linkPaid = (shortUrl: string, notes: Record<string, string> | [] = []): unknown => ({
  event: 'payment_link.paid',
  payload: {
    payment_link: { entity: { id: 'plink_TW1', short_url: shortUrl, notes, customer: { name: 'Asha', email: 'asha@example.com' } } },
    payment: { entity: { id: 'pay_TW1', amount: 100000, currency: 'INR', email: 'asha@example.com', contact: '+919999999999' } },
  },
})

const options = { programNote: SHARP_BRAIN_PROGRAM_NOTE, fixedLinks: [{ url: RAZORPAY_MASTERCLASS_PAYMENT_LINK, offer: 'regular' as const, plan: 'live' as const }] }

describe('Telepathy Workshop seat payment', () => {
  it('is ignored by the Sharp Brain webhook (no access, not recorded as a sale)', () => {
    expect(programPaymentFromEvent(linkPaid(TELEPATHY_SEAT_PAYMENT_LINK), options)).toEqual({ ok: false, reason: 'other_link' })
    expect(programPaymentFromEvent(linkPaid(`${TELEPATHY_SEAT_PAYMENT_LINK}/`, { workshop: 'telepathy' }), options)).toEqual({ ok: false, reason: 'other_link' })
  })
  it('is ignored by the Habit Builder webhook', () => {
    expect(paymentForLink(linkPaid(TELEPATHY_SEAT_PAYMENT_LINK), RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK)).toEqual({ ok: false, reason: 'other_link' })
  })
  it('the real Sharp Brain link still grants (control)', () => {
    expect(programPaymentFromEvent(linkPaid(RAZORPAY_MASTERCLASS_PAYMENT_LINK), options).ok).toBe(true)
  })
})
