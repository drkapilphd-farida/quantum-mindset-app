import { createClient } from '@/lib/supabase/server'

// Real, RLS-respecting check against the `subscriptions` table (see
// supabase/migrations/20260711000005_create_plans_subscriptions_entitlements.sql).
// No free-access window: a user is paid if and only if they have a real
// `active`/`trialing` subscription row — qsr-masterclass (₹9,999,
// granted by the masterclass webhook on payment) or qsr-app-continued
// (₹499/mo). Every existing paid gate in the app calls this one
// function (directly or via hasQuantumSpeedReadingProAccess), so this
// applies everywhere at once — QSR journey pages, the
// habit.mindurmind.org.in dashboard, and the Quantum Mind App login
// check — with no call-site changes.
//
// Previously layered a 60-day free window on top of this (computed from
// profiles.created_at) — removed per explicit correction: there is no
// free-access tier to the program itself. What's free is the Reading
// Speed Test and the live intro session, neither of which are gated by
// this function.
//
// Subscription lapse policy (see the "Pre-Launch Audit Fix Pass" task,
// Phase 5A — a DEFAULT-TO-IMPLEMENT decision the user still needs to
// confirm or override, not a settled call) — an `active`/`trialing` row
// alone used to be sufficient forever, even long after its real billing
// period ended, because nothing here ever re-checked `current_period_end`.
// A ₹499/mo qsr-app-continued subscriber whose renewal silently failed
// (or who cancelled at the payment gateway directly, bypassing this
// app's own cancel flow) would keep full access indefinitely.
//
// ⚠️ ONLY the recurring monthly plan (billing_interval = 'month' —
// qsr-app-continued today) is subject to this expiry check. The
// one-time qsr-masterclass plan is billing_interval = 'lifetime' by
// design (see 20260826000001_add_masterclass_entitlement_and_device_binding.sql)
// and is DELIBERATELY EXEMPT — it must remain permanent regardless of
// `current_period_end` (which for a lifetime plan is typically null
// anyway, but this checks billing_interval directly rather than relying
// on that). DO NOT extend this expiry branch to cover 'lifetime' (or any
// future non-recurring interval) — that would silently revoke access
// customers paid once, in full, to keep forever.
export async function getIsPaidUser(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('plan_id, current_period_end')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])

  if (!subscriptions || subscriptions.length === 0) return false

  const planIds = [...new Set(subscriptions.map((subscription) => subscription.plan_id))]
  const { data: plans } = await supabase.from('plans').select('id, billing_interval').in('id', planIds)
  const billingIntervalByPlanId = new Map((plans ?? []).map((plan) => [plan.id, plan.billing_interval]))

  const now = Date.now()

  return subscriptions.some((subscription) => {
    // Any plan that isn't the recurring monthly one (lifetime, year,
    // free, or an unrecognized/missing plan row) is exempt from this
    // check entirely — see the doc comment above for why 'lifetime'
    // must never be touched here.
    if (billingIntervalByPlanId.get(subscription.plan_id) !== 'month') return true
    // No period end recorded is a data gap, not a lapse — never
    // penalize a real subscriber for a missing timestamp.
    if (subscription.current_period_end === null) return true
    return new Date(subscription.current_period_end).getTime() > now
  })
}
