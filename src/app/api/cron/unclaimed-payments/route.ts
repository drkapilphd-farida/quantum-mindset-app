import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

// Unclaimed Masterclass Payments Reconciliation™ (see the "Pre-Launch
// Audit Fix Pass" task, Phase 1) — the masterclass webhook
// (src/app/api/razorpay/masterclass-webhook/route.ts) already stages
// every real payment.captured event in masterclass_payments before
// trying to grant access, specifically so a payment that arrives before
// the payer's account exists (or that fails to grant for any reason) has
// somewhere to sit rather than being lost. Until now nothing ever
// checked that staging table for a row that's been sitting too long —
// this is that check. A real customer who paid ₹9,999 and doesn't get
// access is the single worst failure mode this app has; this route
// exists so someone finds out about it within the cron's own interval,
// not only when the customer complains on WhatsApp.
//
// "Unclaimed" here means EITHER failure mode: user_id still null (never
// matched to a signed-up account) OR granted_at still null despite a
// matched user_id (matched, but the subscription upsert itself failed —
// see the "qsr-masterclass plan not found" branch in the webhook route).
// 30 minutes is deliberately generous — real signup-after-payment or
// payment-after-signup ordering resolves within seconds via
// handle_new_user()/the webhook's own immediate-match query; anything
// still unresolved half an hour later is a genuine anomaly worth a
// human look, not normal latency.
//
// Reports via logger.error (which, after this same phase's logger.ts
// change, also reports to Sentry) rather than acting on the payments
// itself — this route only surfaces the problem for a human to resolve
// (e.g. via scripts/admin/provisionUser.mjs), it never silently grants
// access on unverified information.
const UNCLAIMED_THRESHOLD_MINUTES = 30

function isAuthorized(request: NextRequest): { authorized: true } | { authorized: false; status: number; error: string } {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return { authorized: false, status: 500, error: 'CRON_SECRET is not configured.' }

  // Same convention as /api/processing/advance-all — Vercel Cron sends
  // `Authorization: Bearer <CRON_SECRET>` automatically; x-cron-secret is
  // accepted too only so this route can be exercised directly.
  const authHeader = request.headers.get('authorization')
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null
  const providedSecret = bearerSecret ?? request.headers.get('x-cron-secret')

  if (!providedSecret) return { authorized: false, status: 400, error: 'Missing Authorization (Bearer) or x-cron-secret header.' }
  if (providedSecret !== cronSecret) return { authorized: false, status: 401, error: 'Invalid secret.' }

  return { authorized: true }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authResult = isAuthorized(request)
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  const cutoff = new Date(Date.now() - UNCLAIMED_THRESHOLD_MINUTES * 60_000).toISOString()
  const supabase = createServiceClient()

  // No PII in logs (project rule) — email/phone are deliberately excluded
  // from the payload below. masterclass_payment_id is enough for whoever
  // gets paged to open this exact row in the Supabase dashboard and see
  // the full record, including contact details, there.
  const { data: unclaimed, error } = await supabase
    .from('masterclass_payments')
    .select('id, razorpay_payment_id, amount_cents, user_id, created_at')
    .is('granted_at', null)
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })

  if (error) {
    logger.error('[cron/unclaimed-payments] failed to query masterclass_payments', { error: error.message })
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 })
  }

  if (unclaimed !== null && unclaimed.length > 0) {
    // One error event per stale payment — each is independently
    // actionable (a specific razorpay_payment_id needs a specific
    // person's account fixed), not one vague "N payments unclaimed"
    // summary that would need someone to go dig for the details anyway.
    for (const payment of unclaimed) {
      logger.error('[cron/unclaimed-payments] payment unclaimed past threshold — real money paid, access not yet granted', {
        masterclassPaymentId: payment.id,
        razorpayPaymentId: payment.razorpay_payment_id,
        amountCents: payment.amount_cents,
        matchedUserId: payment.user_id,
        paidAt: payment.created_at,
      })
    }
  }

  return NextResponse.json({ checked: true, unclaimedCount: unclaimed?.length ?? 0 })
}
