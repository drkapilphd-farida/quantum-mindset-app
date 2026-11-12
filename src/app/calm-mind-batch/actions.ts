'use server'

import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import { calmMindBatch } from '@/config/site.config'
import { normalizeIndianMobile } from '@/lib/phone/indianMobile'
import { createOrder, isValidPaymentSignature } from '@/lib/razorpay/ordersApi'
import { sendMetaCapiEvent } from '@/lib/analytics/metaCapi'
import { utmToLine } from '@/lib/analytics/utmLine'
import { logger } from '@/lib/logger'
import { batchState } from '@/features/calm-batch/batch'
import { countPaidRegistrations } from '@/features/calm-batch/registrations'
import { finalizeCalmRegistration } from '@/features/calm-batch/finalize'
import { joinedToken } from '@/features/calm-batch/joinedToken'

// 21-Day Calm Mind batch payment (owner's brief): Razorpay Checkout exactly
// like /clarity-session — the order is created here (₹2,999, notes: product
// "calm-mind-batch", batch = start date) and the payment is accepted only with
// a valid Checkout signature. Then: save the registration, email, server-side
// Purchase, and a signed link to /calm-mind-batch/joined (the only place the
// joining links show).

const Buyer = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(20),
  utm: z.record(z.string().max(40), z.string().trim().max(200)).optional(),
})

export type StartCalmCheckoutResult = { ok: true; keyId: string; orderId: string; amountPaise: number; contact: string } | { ok: false; reason: 'invalid' | 'closed' | 'error' }

export async function startCalmCheckout(input: unknown): Promise<StartCalmCheckoutResult> {
  const parsed = Buyer.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid' }
  const phone = normalizeIndianMobile(parsed.data.phone)
  if (phone === null) return { ok: false, reason: 'invalid' }
  // Seats and dates checked again on the server: no checkout for a full or past batch.
  const state = batchState(Date.now(), await countPaidRegistrations(calmMindBatch.nextBatch.startDate))
  if (state.status !== 'open') return { ok: false, reason: 'closed' }
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const notes: Record<string, string> = { product: 'calm-mind-batch', batch: calmMindBatch.nextBatch.startDate, name: parsed.data.name, email: parsed.data.email, phone }
  for (const [key, value] of Object.entries(parsed.data.utm ?? {})) if (key.startsWith('utm_') && value !== '') notes[key] = value
  const order = await createOrder({ amountInr: calmMindBatch.price, receipt: `calm-${Date.now()}`, notes })
  if (!order.ok || keyId === '') {
    logger.warn('[calm-batch] could not create the Razorpay order')
    return { ok: false, reason: 'error' }
  }
  return { ok: true, keyId, orderId: order.orderId, amountPaise: order.amountPaise, contact: phone }
}

const Confirm = Buyer.extend({
  orderId: z.string().min(1).max(64),
  paymentId: z.string().min(1).max(64),
  signature: z.string().min(1).max(256),
  url: z.string().url().max(2000),
  lang: z.enum(['en', 'hi']),
})

export async function confirmCalmPayment(input: unknown): Promise<{ ok: true; href: string } | { ok: false }> {
  const parsed = Confirm.safeParse(input)
  if (!parsed.success) return { ok: false }
  const { orderId, paymentId, signature, url, lang, name, email, utm } = parsed.data
  if (!isValidPaymentSignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET ?? '')) {
    logger.warn('[calm-batch] payment signature did not match')
    return { ok: false }
  }
  const phone = normalizeIndianMobile(parsed.data.phone) ?? parsed.data.phone
  // Saved once (unique on the payment ID) — the Razorpay webhook may have done it already.
  await finalizeCalmRegistration({ name, phone, email, paymentId, orderId, batch: calmMindBatch.nextBatch.startDate, utm: utmToLine(utm) }, 'checkout')

  // Server-side Purchase with the same event_id (payment ID) as the joined page's browser Purchase.
  const requestHeaders = await headers()
  const jar = await cookies()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const userAgent = requestHeaders.get('user-agent') ?? undefined
  const fbp = jar.get('_fbp')?.value
  const fbc = jar.get('_fbc')?.value
  await sendMetaCapiEvent({
    eventName: 'Purchase',
    eventId: paymentId,
    eventSourceUrl: new URL('/calm-mind-batch/joined', url).toString(),
    customData: { value: calmMindBatch.price, currency: 'INR', content_name: 'Calm Mind Batch' },
    phone,
    ...(ip !== undefined && ip !== '' ? { clientIp: ip } : {}),
    ...(userAgent !== undefined ? { userAgent } : {}),
    ...(fbp !== undefined ? { fbp } : {}),
    ...(fbc !== undefined ? { fbc } : {}),
  })

  const params = new URLSearchParams({ pid: paymentId, t: joinedToken(paymentId) })
  if (lang === 'hi') params.set('lang', 'hi')
  return { ok: true, href: `/calm-mind-batch/joined?${params.toString()}` }
}
