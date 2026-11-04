// Manual enrolments (payments taken outside Razorpay): pure rules.

export const PAYMENT_MODES = ['gpay', 'cash', 'bank'] as const
export type PaymentMode = (typeof PAYMENT_MODES)[number]
export const PAYMENT_MODE_LABEL: Record<PaymentMode, string> = { gpay: 'GPay', cash: 'Cash', bank: 'Bank transfer' }

export const REFUND_WINDOW_DAYS = 7

/** The last day a refund can be asked for ("YYYY-MM-DD"): 7 days after the payment date. */
export function refundBy(paidOn: string): string {
  const d = new Date(`${paidOn}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + REFUND_WINDOW_DAYS)
  return d.toISOString().slice(0, 10)
}

export function inRefundWindow(paidOn: string, todayIst: string): boolean {
  return todayIst <= refundBy(paidOn)
}

export type ManualStatus = 'active' | 'waiting-for-signup' | 'refunded'

export function manualStatus(row: { refunded_at: string | null; user_id: string | null; granted_at: string | null }): ManualStatus {
  if (row.refunded_at !== null) return 'refunded'
  return row.user_id !== null && row.granted_at !== null ? 'active' : 'waiting-for-signup'
}

/** Today's date in India ("YYYY-MM-DD"). */
export function todayIst(now: number = Date.now()): string {
  return new Date(now + 5.5 * 3_600_000).toISOString().slice(0, 10)
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Which seat a manual payment is (counted in the "Seats left at ₹2,999" counter when it is the intro seat). */
export const SEAT_OFFERS = ['parent_2999', 'parent_3999'] as const
export type SeatOffer = (typeof SEAT_OFFERS)[number]
export const SEAT_LABEL: Record<SeatOffer | 'none', string> = {
  parent_2999: '₹2,999 seat (first 100)',
  parent_3999: '₹3,999 seat',
  none: 'Other (not counted as a seat)',
}
