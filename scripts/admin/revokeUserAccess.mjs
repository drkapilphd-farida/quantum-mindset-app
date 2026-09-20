// Manual access revocation — the admin-triggered fallback for a refund/
// cancellation Razorpay doesn't (or can't) webhook for automatically
// (see the "Pre-Launch Audit Fix Pass" task, Phase 2). Sets the user's
// qsr-masterclass subscription to status: 'canceled', the exact same
// real mechanism the masterclass webhook's own refund.processed handler
// uses (src/app/api/razorpay/revokeMasterclassAccess.ts) — one real
// revocation path, not a second one that could drift.
//
// Uses 'canceled', not 'expired' — this codebase distinguishes a
// recurring plan's natural lapse ('expired', see Phase 5A) from an
// explicit termination ('canceled', a refund or this script). Once
// Phase 4's server-side day-completion tracking lands, 'canceled'
// specifically blocks even previously-completed days; 'expired' does
// not. Confirm you actually mean "revoke everything" before running this
// — for a routine non-renewal, do nothing and let auto-expiry handle it.
//
// Usage:
//   node scripts/admin/revokeUserAccess.mjs --email user@example.com
//   node scripts/admin/revokeUserAccess.mjs --razorpayPaymentId pay_xxx
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the
// environment (both already present in .env.local for local runs).

import { createClient } from '@supabase/supabase-js'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '')
    out[key] = args[i + 1]
  }
  return out
}

async function main() {
  const { email, razorpayPaymentId, plan = 'qsr-masterclass' } = parseArgs()

  if (!email && !razorpayPaymentId) {
    console.error('Usage: node revokeUserAccess.mjs --email <email> | --razorpayPaymentId <pay_id> [--plan <plan-key>]')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1. Resolve the target user_id, either directly (--email) or via the
  //    payment ledger (--razorpayPaymentId), mirroring how the webhook's
  //    own revokeMasterclassAccessForPayment() resolves it.
  let userId = null
  if (email) {
    const { data: profile, error } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle()
    if (error) {
      console.error(`Failed to look up profile for ${email}:`, error.message)
      process.exit(1)
    }
    if (!profile) {
      console.error(`No profile found for email ${email}. Nothing to revoke.`)
      process.exit(1)
    }
    userId = profile.id
  } else {
    const { data: payment, error } = await supabase
      .from('masterclass_payments')
      .select('user_id')
      .eq('razorpay_payment_id', razorpayPaymentId)
      .maybeSingle()
    if (error) {
      console.error(`Failed to look up payment ${razorpayPaymentId}:`, error.message)
      process.exit(1)
    }
    if (!payment || !payment.user_id) {
      console.error(`No matched user for payment ${razorpayPaymentId}. Nothing to revoke (it may have never been claimed — check the Phase 1 unclaimed-payments report).`)
      process.exit(1)
    }
    userId = payment.user_id
  }

  // 2. Look up the plan.
  const { data: planRow, error: planError } = await supabase.from('plans').select('id, key').eq('key', plan).maybeSingle()
  if (planError || !planRow) {
    console.error(`Plan "${plan}" not found in public.plans. Aborting.`)
    process.exit(1)
  }

  // 3. Revoke.
  const { data: updated, error: updateError } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled', canceled_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('plan_id', planRow.id)
    .select('id, status')

  if (updateError) {
    console.error(`Failed to revoke access for user ${userId}:`, updateError.message)
    process.exit(1)
  }
  if (!updated || updated.length === 0) {
    console.error(`No "${plan}" subscription row exists for user ${userId} — nothing to revoke. (They may never have had this plan, or already had it revoked.)`)
    process.exit(1)
  }

  console.log(`Revoked "${plan}" access for user ${userId} — subscription status is now 'canceled'.`)
}

main()
