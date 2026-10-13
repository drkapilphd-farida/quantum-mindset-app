import { describe, expect, it } from 'vitest'
import { inRefundWindow, manualStatus, normaliseEmail, refundBy, todayIst } from './rules'

describe('manual enrolments', () => {
  it('refund window: 7 days after the payment date, inclusive', () => {
    expect(refundBy('2026-10-13')).toBe('2026-10-20')
    expect(refundBy('2026-12-28')).toBe('2027-01-04')
    expect(inRefundWindow('2026-10-13', '2026-10-20')).toBe(true)
    expect(inRefundWindow('2026-10-13', '2026-10-21')).toBe(false)
  })
  it('status: refunded wins; access on only once claimed by an account', () => {
    expect(manualStatus({ refunded_at: null, user_id: 'u', granted_at: 'x' })).toBe('active')
    expect(manualStatus({ refunded_at: null, user_id: null, granted_at: null })).toBe('waiting-for-signup')
    expect(manualStatus({ refunded_at: 'x', user_id: 'u', granted_at: 'x' })).toBe('refunded')
  })
  it('today in India, and emails matched the way sign-up stores them', () => {
    expect(todayIst(Date.UTC(2026, 9, 13, 19, 0))).toBe('2026-10-14') // 00:30 IST
    expect(normaliseEmail('  Asha.K@GMail.com ')).toBe('asha.k@gmail.com')
  })
})
