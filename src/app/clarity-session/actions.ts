'use server'

import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import { CLARITY_SESSION } from '@/config/site.config'
import { createOrder, isValidPaymentSignature } from '@/lib/razorpay/ordersApi'
import { sendMetaCapiEvent } from '@/lib/analytics/metaCapi'
import { logger } from '@/lib/logger'
import { isProgramSlug } from '@/features/programs/programs'

// Clarity Session payment (owner's conversion brief): Razorpay Checkout when
// RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET are set. The order carries the
// program and the visitor's UTM params in its notes, so they show in the
// Razorpay dashboard next to the payment.

const StartSchema = z.object({
  program: z.string().max(60).optional(),
  utm: z.record(z.string().max(40), z.string().trim().max(200)).optional(),
})

export type StartClarityCheckoutResult = { ok: true; keyId: string; orderId: string; amountPaise: number } | { ok: false }

export async function startClarityCheckout(input: unknown): Promise<StartClarityCheckoutResult> {
  const parsed = StartSchema.safeParse(input)
  if (!parsed.success) return { ok: false }
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const notes: Record<string, string> = { product: 'Clarity Session (60 min)' }
  if (parsed.data.program !== undefined && isProgramSlug(parsed.data.program)) notes.program = parsed.data.program
  for (const [key, value] of Object.entries(parsed.data.utm ?? {})) if (key.startsWith('utm_') && value !== '') notes[key] = value
  const order = await createOrder({ amountInr: CLARITY_SESSION.priceInr, receipt: `clarity-${Date.now()}`, notes })
  if (!order.ok || keyId === '') {
    logger.warn('[clarity-session] could not create the Razorpay order')
    return { ok: false }
  }
  return { ok: true, keyId, orderId: order.orderId, amountPaise: order.amountPaise }
}

const ConfirmSchema = z.object({
  orderId: z.string().min(1).max(64),
  paymentId: z.string().min(1).max(64),
  signature: z.string().min(1).max(256),
  url: z.string().url().max(2000),
})

/** Accepts the payment only with a valid Checkout signature; then sends the server-side Purchase (same event_id as the thank-you page's Pixel event). */
export async function confirmClarityPayment(input: unknown): Promise<{ ok: boolean }> {
  const parsed = ConfirmSchema.safeParse(input)
  if (!parsed.success) return { ok: false }
  const { orderId, paymentId, signature, url } = parsed.data
  if (!isValidPaymentSignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET ?? '')) {
    logger.warn('[clarity-session] payment signature did not match')
    return { ok: false }
  }
  const requestHeaders = await headers()
  const jar = await cookies()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const userAgent = requestHeaders.get('user-agent') ?? undefined
  const fbp = jar.get('_fbp')?.value
  const fbc = jar.get('_fbc')?.value
  await sendMetaCapiEvent({
    eventName: 'Purchase',
    eventId: paymentId,
    eventSourceUrl: new URL('/clarity-session/booked', url).toString(),
    customData: { value: CLARITY_SESSION.priceInr, currency: 'INR', content_name: 'Clarity Session' },
    ...(ip !== undefined && ip !== '' ? { clientIp: ip } : {}),
    ...(userAgent !== undefined ? { userAgent } : {}),
    ...(fbp !== undefined ? { fbp } : {}),
    ...(fbc !== undefined ? { fbc } : {}),
  })
  return { ok: true }
}
