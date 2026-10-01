import { z } from 'zod'

// Razorpay Payment Links API — server only (uses RAZORPAY_KEY_SECRET).
// https://razorpay.com/docs/api/payments/payment-links/create-standard/
// Each Sharp Brain checkout creates its own single-use link, so the amount,
// the chosen batch and the offer travel in the link's notes and come back
// in the payment_link.paid webhook.

const API_URL = 'https://api.razorpay.com/v1/payment_links'
// Razorpay rejects expire_by less than 15 minutes ahead.
const MIN_EXPIRY_LEAD_MS = 16 * 60_000

export type PaymentLinkNotes = Record<string, string>

export type CreatePaymentLinkInput = {
  amountInr: number
  description: string
  notes: PaymentLinkNotes
  /** When the link stops accepting payment. Clamped to at least 16 minutes ahead. */
  expireAtMs: number
  /** Prefilled on the Razorpay page, e.g. the test-offer WhatsApp number ("91XXXXXXXXXX"). */
  customerContact?: string
  referenceId?: string
}

const CreatedLinkSchema = z.object({ id: z.string(), short_url: z.string().url() })

export function hasPaymentLinksApi(): boolean {
  return (process.env.RAZORPAY_KEY_ID ?? '') !== '' && (process.env.RAZORPAY_KEY_SECRET ?? '') !== ''
}

export function buildPaymentLinkBody(input: CreatePaymentLinkInput, now: number): Record<string, unknown> {
  const expireBy = Math.max(input.expireAtMs, now + MIN_EXPIRY_LEAD_MS)
  return {
    amount: Math.round(input.amountInr * 100),
    currency: 'INR',
    accept_partial: false,
    description: input.description,
    expire_by: Math.floor(expireBy / 1000),
    reminder_enable: false,
    notify: { sms: false, email: false },
    notes: input.notes,
    ...(input.referenceId !== undefined ? { reference_id: input.referenceId } : {}),
    ...(input.customerContact !== undefined ? { customer: { contact: `+${input.customerContact}` } } : {}),
  }
}

export async function createPaymentLink(
  input: CreatePaymentLinkInput,
  now: number = Date.now(),
): Promise<{ ok: true; id: string; url: string } | { ok: false; status: number | null }> {
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
  if (keyId === '' || keySecret === '') return { ok: false, status: null }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
    },
    body: JSON.stringify(buildPaymentLinkBody(input, now)),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) return { ok: false, status: response.status }
  const parsed = CreatedLinkSchema.safeParse(await response.json())
  if (!parsed.success) return { ok: false, status: response.status }
  return { ok: true, id: parsed.data.id, url: parsed.data.short_url }
}
