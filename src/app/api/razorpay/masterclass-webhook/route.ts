import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/verifyWebhookSignature'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { sharpBrainEnrolment } from '@/config/site.config'
import { linkIdsFromEnv } from '@/lib/razorpay/paymentLinkEvent'
import { SHARP_BRAIN_PROGRAM_NOTE, programPaymentFromEvent, type FixedProgramLink, type ProgramPayment } from '@/features/sharp-brain-enrol/programPayment'
import { revokeMasterclassAccessForPayment } from '../revokeMasterclassAccess'

// Automated Masterclass Access™ — sibling to /api/razorpay/webhook, not an
// extension of it: that route handles tenant/school Subscription
// lifecycle events (schools table); this one handles a single consumer
// payment (payment_link.paid) from RAZORPAY_MASTERCLASS_PAYMENT_LINK
// (a static, unauthenticated Payment Link — see masterclassPaymentLink.ts)
// and grants access via the REAL paywall (public.subscriptions +
// getIsPaidUser(), see 20260826000001_add_masterclass_entitlement_and_device_binding.sql),
// not a separate has_paid flag nothing else in the app would check.
//
// Uses its own webhook secret (RAZORPAY_MASTERCLASS_WEBHOOK_SECRET) —
// register a second webhook endpoint in the Razorpay Dashboard subscribed
// to "payment_link.paid" (+ "refund.processed"), so a bug here can't affect
// the tenant billing webhook or vice versa.
//
// Refund revocation (see the "Pre-Launch Audit Fix Pass" task, Phase 2)
// — "refund.processed" now revokes the matching user's masterclass
// subscription via the same revokeMasterclassAccessForPayment() an admin
// can also call manually (see revokeMasterclassAccess.ts). This webhook
// endpoint must ALSO be subscribed to "refund.processed" in the Razorpay
// Dashboard (Settings > Webhooks > this endpoint > Active Events) — it
// is not automatically included just because "payment_link.paid" already
// is; both need to be checked explicitly for refunds to actually revoke
// access.
//
// Program payments only (28 Sep 2026): Razorpay webhooks are account-wide,
// so this endpoint also receives retreat, workshop and Starter payments.
// Access is granted ONLY from "payment_link.paid" events for the 30-Day
// Program link (RAZORPAY_MASTERCLASS_PAYMENT_LINK, plus optional extra link
// ids in RAZORPAY_MASTERCLASS_EXTRA_LINK_IDS, e.g. a test-mode link).
// "payment.captured" is acknowledged and ignored — it doesn't say which link
// was paid. An already-active subscription (e.g. granted by hand) is never
// overwritten; the payment is still recorded against that learner.
//
// Batches and offers (1 Oct 2026): the program is now also sold through
// links our server creates per checkout (Razorpay Payment Links API) —
// recognised by notes.program = "sharp_brain_30" — and an optional fixed
// ₹8,999 link. The buyer name, offer (earlybird | regular | test1000) and
// chosen batch are saved with the payment, and a redeemed Reading Speed
// Test offer is marked used. See src/features/sharp-brain-enrol.
const WEBHOOK_RATE_LIMIT = { max: 60, windowMs: 60_000 }

// Razorpay's documented refund.processed shape — the refund entity
// carries `payment_id`, the original payment this refund belongs to,
// which is exactly what masterclass_payments.razorpay_payment_id is
// keyed on.
const RazorpayRefundProcessedPayloadSchema = z.object({
  event: z.literal('refund.processed'),
  payload: z.object({
    refund: z.object({
      entity: z.object({
        id: z.string(),
        payment_id: z.string(),
        amount: z.number(),
      }),
    }),
  }),
})

const EventEnvelopeSchema = z.object({ event: z.string() })

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = await getClientIp()
  const rateLimitDecision = checkRateLimit(`razorpay-masterclass-webhook:${clientIp}`, WEBHOOK_RATE_LIMIT)
  if (!rateLimitDecision.allowed) {
    logger.warn('[razorpay-masterclass-webhook] rate limit exceeded', { clientIp })
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitDecision.retryAfterMs / 1000)) } },
    )
  }

  try {
    return await handleMasterclassWebhook(request)
  } catch (error) {
    logger.error('[razorpay-masterclass-webhook] unhandled exception', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}

async function handleMasterclassWebhook(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (signature === null) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const webhookSecret = process.env.RAZORPAY_MASTERCLASS_WEBHOOK_SECRET
  if (webhookSecret === undefined) {
    logger.error('[razorpay-masterclass-webhook] RAZORPAY_MASTERCLASS_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    logger.warn('[razorpay-masterclass-webhook] signature verification failed')
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  let json: unknown
  try {
    json = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const envelope = EventEnvelopeSchema.safeParse(json)
  if (!envelope.success) {
    logger.warn('[razorpay-masterclass-webhook] payload failed validation')
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  if (envelope.data.event === 'refund.processed') {
    return handleRefundProcessed(json)
  }

  if (envelope.data.event === 'payment_link.paid') {
    return handlePaymentLinkPaid(json)
  }

  // Subscribe this endpoint to payment_link.paid + refund.processed only.
  // Anything else (including payment.captured, which doesn't say which link
  // was paid) is acknowledged (200) and ignored, so Razorpay doesn't retry.
  return NextResponse.json({ received: true })
}

async function handleRefundProcessed(json: unknown): Promise<NextResponse> {
  const parsed = RazorpayRefundProcessedPayloadSchema.safeParse(json)
  if (!parsed.success) {
    logger.warn('[razorpay-masterclass-webhook] refund.processed payload failed validation')
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const { payment_id: razorpayPaymentId, id: razorpayRefundId } = parsed.data.payload.refund.entity
  const result = await revokeMasterclassAccessForPayment(razorpayPaymentId)

  if (!result.ok) {
    logger.error('[razorpay-masterclass-webhook] failed to revoke access after refund', {
      razorpayPaymentId,
      razorpayRefundId,
      reason: result.reason,
    })
    // Still ack 200 for "no matching payment/subscription found" — that's
    // a real, non-retryable state (e.g. a refund for a payment this app
    // never actually granted access for), not a transient failure worth
    // Razorpay retrying. A genuine DB error inside revokeMasterclassAccessForPayment
    // is surfaced as reason: 'db_error' and DOES return a 500 below so
    // Razorpay retries it.
    if (result.reason === 'db_error') {
      return NextResponse.json({ error: 'Failed to revoke access.' }, { status: 500 })
    }
    return NextResponse.json({ received: true })
  }

  logger.warn('[razorpay-masterclass-webhook] access revoked after refund', {
    razorpayPaymentId,
    razorpayRefundId,
    userId: result.userId,
  })
  return NextResponse.json({ received: true })
}

function fixedProgramLinks(): FixedProgramLink[] {
  const { regular, discounted } = sharpBrainEnrolment.fallbackLinks
  return [{ url: regular, offer: 'regular' }, ...(discounted !== null ? [{ url: discounted, offer: 'earlybird' as const }] : [])]
}

async function handlePaymentLinkPaid(json: unknown): Promise<NextResponse> {
  const result = programPaymentFromEvent(json, {
    programNote: SHARP_BRAIN_PROGRAM_NOTE,
    fixedLinks: fixedProgramLinks(),
    extraLinkIds: linkIdsFromEnv(process.env.RAZORPAY_MASTERCLASS_EXTRA_LINK_IDS),
  })
  if (!result.ok) {
    if (result.reason === 'invalid_payload') {
      logger.warn('[razorpay-masterclass-webhook] payment_link.paid payload failed validation')
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
    }
    // Another product's payment link (retreat, Starter, workshop …): not ours.
    return NextResponse.json({ received: true })
  }
  return recordAndGrant(result.payment)
}

async function recordAndGrant(payment: ProgramPayment): Promise<NextResponse> {
  const { id: razorpayPaymentId, amount, currency, email, contact } = payment
  const supabase = createServiceClient()

  // Idempotent on razorpay_payment_id — Razorpay's documented
  // at-least-once redelivery, or a manual resend from the Dashboard,
  // must never grant a second subscription row or double-count revenue.
  const { data: existingPayment } = await supabase
    .from('masterclass_payments')
    .select('id, granted_at')
    .eq('razorpay_payment_id', razorpayPaymentId)
    .maybeSingle()

  if (existingPayment) {
    logger.warn('[razorpay-masterclass-webhook] duplicate delivery, already recorded', { razorpayPaymentId })
    return NextResponse.json({ received: true })
  }

  const { data: insertedPayment, error: insertError } = await supabase
    .from('masterclass_payments')
    .insert({
      razorpay_payment_id: razorpayPaymentId,
      email,
      phone: contact,
      amount_cents: amount,
      currency,
      customer_name: payment.customerName,
      offer: payment.offer,
      batch_start: payment.batchStart,
      payment_link_id: payment.paymentLinkId,
      sharp_brain_offer_id: payment.offerId,
    })
    .select('id')
    .single()

  if (insertError || !insertedPayment) {
    // A unique-violation redelivery race (two webhook deliveries landing
    // concurrently) is the one expected case here; anything else is a real
    // failure worth surfacing as a 500 so Razorpay retries.
    if (insertError?.code === '23505') {
      return NextResponse.json({ received: true })
    }
    logger.error('[razorpay-masterclass-webhook] failed to record payment', {
      razorpayPaymentId,
      error: insertError?.message,
    })
    return NextResponse.json({ error: 'Failed to record payment.' }, { status: 500 })
  }

  // A Reading Speed Test offer can be used once.
  if (payment.offerId !== null) {
    await supabase
      .from('sharp_brain_offers')
      .update({ redeemed_at: new Date().toISOString(), razorpay_payment_id: razorpayPaymentId })
      .eq('id', payment.offerId)
      .is('redeemed_at', null)
  }

  // Try to match an existing account immediately (signup-before-payment
  // case). If no match, the row sits unclaimed — handle_new_user() picks
  // it up the moment a matching account is created (payment-before-
  // signup case, the more common real-world ordering for a static,
  // unauthenticated Payment Link).
  let matchedUserId: string | null = null
  if (email !== null) {
    const { data } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle()
    matchedUserId = data?.id ?? null
  }
  if (matchedUserId === null && contact !== null) {
    const { data } = await supabase.from('profiles').select('id').eq('phone', contact).maybeSingle()
    matchedUserId = data?.id ?? null
  }

  if (matchedUserId !== null) {
    const { data: plan } = await supabase.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()

    if (plan) {
      const granted = await grantWithoutOverwriting(supabase, matchedUserId, plan.id)
      if (!granted.ok) {
        logger.error('[razorpay-masterclass-webhook] failed to grant subscription', {
          razorpayPaymentId,
          userId: matchedUserId,
          error: granted.error,
        })
        return NextResponse.json({ error: 'Failed to grant access.' }, { status: 500 })
      }

      await supabase
        .from('masterclass_payments')
        .update({ user_id: matchedUserId, granted_at: new Date().toISOString() })
        .eq('id', insertedPayment.id)
    } else {
      logger.error('[razorpay-masterclass-webhook] qsr-masterclass plan not found — was the migration applied?', { razorpayPaymentId })
    }
  }

  return NextResponse.json({ received: true })
}

/**
 * Active access (e.g. granted by hand before the webhook existed) is left
 * exactly as it is; cancelled access is reactivated; otherwise a new
 * subscription is created. Never a second row (unique user_id + plan_id).
 */
async function grantWithoutOverwriting(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  planId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data: existing, error: readError } = await supabase
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .maybeSingle()
  if (readError) return { ok: false, error: readError.message }

  if (existing && (existing.status === 'active' || existing.status === 'trialing')) return { ok: true }

  const now = new Date().toISOString()
  const { error } = existing
    ? await supabase.from('subscriptions').update({ status: 'active', canceled_at: null, current_period_start: now }).eq('id', existing.id)
    : await supabase.from('subscriptions').insert({ user_id: userId, plan_id: planId, status: 'active', current_period_start: now })
  return error ? { ok: false, error: error.message } : { ok: true }
}
