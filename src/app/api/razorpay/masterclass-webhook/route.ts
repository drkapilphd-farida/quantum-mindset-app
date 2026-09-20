import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/verifyWebhookSignature'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { revokeMasterclassAccessForPayment } from '../revokeMasterclassAccess'

// Automated Masterclass Access™ — sibling to /api/razorpay/webhook, not an
// extension of it: that route handles tenant/school Subscription
// lifecycle events (schools table); this one handles a single consumer
// Payment event (payment.captured) from RAZORPAY_MASTERCLASS_PAYMENT_LINK
// (a static, unauthenticated Payment Link — see masterclassPaymentLink.ts)
// and grants access via the REAL paywall (public.subscriptions +
// getIsPaidUser(), see 20260826000001_add_masterclass_entitlement_and_device_binding.sql),
// not a separate has_paid flag nothing else in the app would check.
//
// Uses its own webhook secret (RAZORPAY_MASTERCLASS_WEBHOOK_SECRET) —
// register a second webhook endpoint in the Razorpay Dashboard subscribed
// to "payment.captured" only, so a bug here can't affect the tenant
// billing webhook or vice versa.
//
// Refund revocation (see the "Pre-Launch Audit Fix Pass" task, Phase 2)
// — "refund.processed" now revokes the matching user's masterclass
// subscription via the same revokeMasterclassAccessForPayment() an admin
// can also call manually (see revokeMasterclassAccess.ts). This webhook
// endpoint must ALSO be subscribed to "refund.processed" in the Razorpay
// Dashboard (Settings > Webhooks > this endpoint > Active Events) — it
// is not automatically included just because "payment.captured" already
// is; both need to be checked explicitly for refunds to actually revoke
// access.
const WEBHOOK_RATE_LIMIT = { max: 60, windowMs: 60_000 }

const RazorpayPaymentCapturedPayloadSchema = z.object({
  event: z.literal('payment.captured'),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string(),
        amount: z.number(),
        currency: z.string(),
        // Razorpay's payment entity field names, not ours — email/contact
        // are whatever the payer entered on Razorpay's own checkout form,
        // which is why matching to an app account can fail (see the
        // migration's doc comment on masterclass_payments).
        email: z.string().nullable().optional(),
        contact: z.string().nullable().optional(),
      }),
    }),
  }),
})

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

  if (envelope.data.event === 'payment.captured') {
    return handlePaymentCaptured(json)
  }

  // Only ever subscribed to payment.captured + refund.processed in the
  // Razorpay Dashboard, but ack (200) anything else defensively rather
  // than 400 — same "don't make Razorpay retry a webhook we simply
  // don't act on" posture as the tenant billing webhook.
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

async function handlePaymentCaptured(json: unknown): Promise<NextResponse> {
  const parsed = RazorpayPaymentCapturedPayloadSchema.safeParse(json)
  if (!parsed.success) {
    logger.warn('[razorpay-masterclass-webhook] payment.captured payload failed validation')
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const { id: razorpayPaymentId, amount, currency, email, contact } = parsed.data.payload.payment.entity
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
      email: email ?? null,
      phone: contact ?? null,
      amount_cents: amount,
      currency,
    })
    .select('id')
    .single()

  if (insertError || !insertedPayment) {
    // A unique-violation redelivery race (two webhook deliveries landing
    // concurrently) is the one expected case here — already logged via
    // the SELECT above in the common case; anything else is a real
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

  // Try to match an existing account immediately (signup-before-payment
  // case). If no match, the row sits unclaimed — handle_new_user() picks
  // it up the moment a matching account is created (payment-before-
  // signup case, the more common real-world ordering for a static,
  // unauthenticated Payment Link).
  let matchedUserId: string | null = null
  if (email !== null && email !== undefined) {
    const { data } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle()
    matchedUserId = data?.id ?? null
  }
  if (matchedUserId === null && contact !== null && contact !== undefined) {
    const { data } = await supabase.from('profiles').select('id').eq('phone', contact).maybeSingle()
    matchedUserId = data?.id ?? null
  }

  if (matchedUserId !== null) {
    const { data: plan } = await supabase.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()

    if (plan) {
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert(
          { user_id: matchedUserId, plan_id: plan.id, status: 'active', current_period_start: new Date().toISOString() },
          { onConflict: 'user_id,plan_id' },
        )

      if (subscriptionError) {
        logger.error('[razorpay-masterclass-webhook] failed to grant subscription', {
          razorpayPaymentId,
          userId: matchedUserId,
          error: subscriptionError.message,
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
