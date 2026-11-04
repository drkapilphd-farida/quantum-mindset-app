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

// ── Access check after "Give full access" ─────────────────────────────────
// What the admin page learned about one learner. `paid` is the app's own
// check (getIsPaidUser), the same one every gated page uses.
export type AccessFacts =
  | { account: 'lookup-failed' }
  | { account: 'none'; pendingPayment: boolean }
  | {
      account: 'found'
      paid: boolean
      blocked: boolean
      /** The learner's Sharp Brain program subscription, if any. */
      programSubscription: { status: string } | null
    }

export type AccessVerdict = { ok: true; when: 'now' | 'first-sign-in'; text: string } | { ok: false; text: string }

/** Turns the facts into "✅ Access verified" or a red warning with the reason. */
export function accessVerdict(facts: AccessFacts, email: string): AccessVerdict {
  if (facts.account === 'lookup-failed') return { ok: false, text: 'Could not look up the learner’s account, so access is not verified. Press “Check access” again.' }
  if (facts.account === 'none') {
    return facts.pendingPayment
      ? { ok: true, when: 'first-sign-in', text: `✅ Access verified — no account yet; full access switches on the moment they first sign in with ${email}.` }
      : { ok: false, text: `No account and no open payment for ${email}, so access would NOT switch on at sign-in. Check the entry is not refunded or deleted.` }
  }
  if (facts.blocked) return { ok: false, text: 'Their login is blocked (banned) in Supabase Auth, so they cannot sign in. Unblock the user first.' }
  if (facts.paid) return { ok: true, when: 'now', text: '✅ Access verified — full access is on now on every page (one page reload if they have the app open).' }
  if (facts.programSubscription === null) return { ok: false, text: 'Access is NOT on: their account has no Sharp Brain program subscription. Press “Check access” to retry; if it stays red, tell support.' }
  if (facts.programSubscription.status !== 'active') return { ok: false, text: `Access is NOT on: their program subscription is “${facts.programSubscription.status}”, not active.` }
  return { ok: false, text: 'Access is NOT on: the app’s access check says no. Tell support.' }
}
