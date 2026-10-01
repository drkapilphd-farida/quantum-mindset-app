import { describe, expect, it } from 'vitest'
import { linkIdsFromEnv, normaliseShortUrl, paymentForLink } from './paymentLinkEvent'

const PROGRAM = 'https://rzp.io/rzp/ydVYaANF'
const event = (shortUrl: string | null, linkId = 'plink_A'): unknown => ({
  event: 'payment_link.paid',
  payload: {
    payment_link: { entity: { id: linkId, short_url: shortUrl } },
    payment: { entity: { id: 'pay_1', amount: 999900, currency: 'INR', email: 'a@b.com', contact: '+919999999999' } },
  },
})

describe('paymentForLink', () => {
  it('accepts a payment made through the expected link', () => {
    const result = paymentForLink(event('https://rzp.io/rzp/ydVYaANF'), PROGRAM)
    expect(result).toEqual({ ok: true, payment: { id: 'pay_1', amount: 999900, currency: 'INR', email: 'a@b.com', contact: '+919999999999', paymentLinkId: 'plink_A', notes: {}, customerName: null } })
  })

  it('ignores payments from any other link (retreat, Starter, workshop…)', () => {
    expect(paymentForLink(event('https://rzp.io/rzp/vecVC7sx'), PROGRAM)).toEqual({ ok: false, reason: 'other_link' })
    expect(paymentForLink(event(null), PROGRAM)).toEqual({ ok: false, reason: 'other_link' })
  })

  it('never grants from payment.captured, which does not say which link was paid', () => {
    expect(paymentForLink({ event: 'payment.captured', payload: {} }, PROGRAM)).toEqual({ ok: false, reason: 'not_payment_link_paid' })
  })

  it('rejects malformed payloads', () => {
    expect(paymentForLink({ event: 'payment_link.paid', payload: {} }, PROGRAM)).toEqual({ ok: false, reason: 'invalid_payload' })
    expect(paymentForLink('nope', PROGRAM)).toEqual({ ok: false, reason: 'invalid_payload' })
  })

  it('accepts an extra link id (e.g. a test-mode link) only when configured', () => {
    expect(paymentForLink(event('https://rzp.io/rzp/test123', 'plink_TEST'), PROGRAM).ok).toBe(false)
    expect(paymentForLink(event('https://rzp.io/rzp/test123', 'plink_TEST'), PROGRAM, linkIdsFromEnv(' plink_TEST , ')).ok).toBe(true)
  })

  it('compares short URLs without scheme, trailing slash or host case — but keeps the code case-sensitive', () => {
    expect(normaliseShortUrl('HTTPS://RZP.IO/rzp/ydVYaANF/')).toBe('rzp.io/rzp/ydVYaANF')
    expect(normaliseShortUrl('rzp.io/rzp/ydvyaanf')).not.toBe(normaliseShortUrl(PROGRAM))
  })
})
