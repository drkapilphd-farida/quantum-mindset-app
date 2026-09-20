import { createServiceClient } from '@/lib/supabase/service'

// Shared revocation logic (see the "Pre-Launch Audit Fix Pass" task,
// Phase 2) — used by the masterclass webhook's refund.processed handler
// AND by scripts/admin/revokeUserAccess.mjs as the documented manual
// fallback (e.g. a refund issued by phone/WhatsApp, or a chargeback
// Razorpay doesn't webhook for the same way). One real implementation,
// not two that could drift.
//
// Sets status: 'canceled' specifically (not 'expired') — this codebase
// uses 'expired' to mean "a recurring plan's period lapsed naturally"
// (see Phase 5A's auto-expiry, which ONLY applies to the qsr-app-continued
// monthly plan) and 'canceled' to mean "access was explicitly terminated"
// (a refund, or an admin-initiated revocation). isCurriculumDayUnlocked's
// permanent-access rule (Phase 4) reads this same distinction: a
// natural 'expired' lapse still honors previously-completed days, but an
// explicit 'canceled' revocation does not — a refund is a stronger
// signal than a routine non-renewal.
export type RevokeMasterclassAccessResult =
  | { ok: true; userId: string }
  | { ok: false; reason: 'payment_not_found' | 'no_matched_user' | 'plan_not_found' | 'db_error'; detail?: string }

export async function revokeMasterclassAccessForPayment(razorpayPaymentId: string): Promise<RevokeMasterclassAccessResult> {
  const supabase = createServiceClient()

  const { data: payment, error: paymentError } = await supabase
    .from('masterclass_payments')
    .select('user_id')
    .eq('razorpay_payment_id', razorpayPaymentId)
    .maybeSingle()

  if (paymentError) {
    return { ok: false, reason: 'db_error', detail: paymentError.message }
  }
  if (!payment) {
    return { ok: false, reason: 'payment_not_found' }
  }
  if (!payment.user_id) {
    // A real payment this app never actually matched/granted for — there
    // is no subscription row to revoke. Not an error: refunding an
    // unclaimed payment is a legitimate outcome (see the Phase 1
    // unclaimed-payments cron for the OTHER half of that scenario).
    return { ok: false, reason: 'no_matched_user' }
  }

  const { data: plan, error: planError } = await supabase.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()
  if (planError) {
    return { ok: false, reason: 'db_error', detail: planError.message }
  }
  if (!plan) {
    return { ok: false, reason: 'plan_not_found' }
  }

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled', canceled_at: new Date().toISOString() })
    .eq('user_id', payment.user_id)
    .eq('plan_id', plan.id)

  if (updateError) {
    return { ok: false, reason: 'db_error', detail: updateError.message }
  }

  return { ok: true, userId: payment.user_id }
}
