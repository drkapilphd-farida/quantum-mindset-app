import { type NextRequest, NextResponse } from 'next/server'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/verifyWebhookSignature'
import { RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK } from '@/config/quantumMindsetHabitBuilderPaymentLink'
import { linkIdsFromEnv, paymentForLink } from '@/lib/razorpay/paymentLinkEvent'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'

// Automated Habit Builder Access™ — sibling to /api/razorpay/masterclass-webhook,
// same shape, deliberately NOT reusing its grant mechanism. That route
// grants via public.subscriptions (read by getIsPaidUser(), which every
// other paid gate in the app also reads); this one must NOT — a Habit
// Builder purchase is required to stay fully isolated from QSR
// Masterclass-gated content (explicit founder decision), so this grants
// via public.entitlements instead — see
// 20260903000002_create_habit_builder_payments_and_entitlement.sql's own
// comment for the full reasoning. hasHabitBuilderAccess() is the only
// reader of that entitlement.
//
// Uses its own webhook secret (RAZORPAY_HABIT_BUILDER_WEBHOOK_SECRET) —
// register a THIRD webhook endpoint in the Razorpay Dashboard subscribed
// to "payment_link.paid", so a bug here can't affect the tenant billing or
// Masterclass webhooks or vice versa.
//
// CLOSED (29 Sep 2026): the ₹99 Starter is no longer sold. This route now
// acknowledges every event and grants nothing; existing entitlements are
// untouched. A Starter payment that still arrives (before the link is
// deactivated in Razorpay) is logged for a manual refund.
//
// Starter payments only (28 Sep 2026): Razorpay webhooks are account-wide,
// so this endpoint also receives program, retreat and workshop payments.
// Access is granted ONLY from "payment_link.paid" for the ₹99 Starter link
// (RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK, plus optional extra
// link ids in RAZORPAY_HABIT_BUILDER_EXTRA_LINK_IDS). Everything else,
// including payment.captured, is acknowledged and ignored.
const WEBHOOK_RATE_LIMIT = { max: 60, windowMs: 60_000 }

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = await getClientIp()
  const rateLimitDecision = checkRateLimit(`razorpay-habit-builder-webhook:${clientIp}`, WEBHOOK_RATE_LIMIT)
  if (!rateLimitDecision.allowed) {
    logger.warn('[razorpay-habit-builder-webhook] rate limit exceeded', { clientIp })
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitDecision.retryAfterMs / 1000)) } },
    )
  }

  try {
    return await handleHabitBuilderWebhook(request)
  } catch (error) {
    logger.error('[razorpay-habit-builder-webhook] unhandled exception', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}

async function handleHabitBuilderWebhook(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (signature === null) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const webhookSecret = process.env.RAZORPAY_HABIT_BUILDER_WEBHOOK_SECRET
  if (webhookSecret === undefined) {
    logger.error('[razorpay-habit-builder-webhook] RAZORPAY_HABIT_BUILDER_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    logger.warn('[razorpay-habit-builder-webhook] signature verification failed')
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  let json: unknown
  try {
    json = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const result = paymentForLink(json, RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK, linkIdsFromEnv(process.env.RAZORPAY_HABIT_BUILDER_EXTRA_LINK_IDS))
  if (result.ok) {
    // Starter closed: never grant, never record (a recorded unclaimed row
    // would be granted at sign-up by handle_new_user()). Logged so a late
    // payment can be refunded by hand. Payment id and amount only, no PII.
    logger.warn('[razorpay-habit-builder-webhook] Starter payment received after closing; no access granted', {
      razorpayPaymentId: result.payment.id,
      amount: result.payment.amount,
    })
  }
  return NextResponse.json({ received: true })
}
