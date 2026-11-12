import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

// Razorpay Orders API + Checkout signature check — server only (uses
// RAZORPAY_KEY_SECRET). Used by the Clarity Session page (owner's
// conversion brief): the order is created here, Razorpay Checkout opens in
// the browser, and the payment is accepted only once its signature checks out.
// https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/

const ORDERS_URL = 'https://api.razorpay.com/v1/orders'
const OrderSchema = z.object({ id: z.string(), amount: z.number(), currency: z.string() })

export type CreateOrderInput = { amountInr: number; receipt: string; notes: Record<string, string> }

export function buildOrderBody(input: CreateOrderInput): Record<string, unknown> {
  return { amount: Math.round(input.amountInr * 100), currency: 'INR', receipt: input.receipt.slice(0, 40), notes: input.notes }
}

export async function createOrder(input: CreateOrderInput): Promise<{ ok: true; orderId: string; amountPaise: number } | { ok: false }> {
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
  if (keyId === '' || keySecret === '') return { ok: false }
  try {
    const response = await fetch(ORDERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
      body: JSON.stringify(buildOrderBody(input)),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return { ok: false }
    const parsed = OrderSchema.safeParse(await response.json())
    return parsed.success ? { ok: true, orderId: parsed.data.id, amountPaise: parsed.data.amount } : { ok: false }
  } catch {
    return { ok: false }
  }
}

/** Checkout's success signature: HMAC-SHA256(order_id + "|" + payment_id, key secret). */
export function isValidPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  if (secret === '' || signature === '') return false
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

const auth = (): string | null => {
  const keyId = process.env.RAZORPAY_KEY_ID ?? ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? ''
  return keyId === '' || keySecret === '' ? null : `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
}

const NotesSchema = z.record(z.string(), z.union([z.string(), z.number()]).transform(String)).catch({})
const PaymentSchema = z.object({ id: z.string(), order_id: z.string().nullable().optional(), amount: z.number(), email: z.string().nullable().optional(), contact: z.string().nullable().optional(), notes: z.union([NotesSchema, z.array(z.unknown()).transform(() => ({}))]).optional() })

export type RazorpayPayment = { id: string; orderId: string | null; amountPaise: number; email: string; contact: string; notes: Record<string, string> }

/** Reads one payment (email, phone, notes) — server only. null when the keys are missing or the call fails. */
export async function fetchPayment(paymentId: string): Promise<RazorpayPayment | null> {
  const header = auth()
  if (header === null) return null
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers: { Authorization: header }, cache: 'no-store', signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return null
    const parsed = PaymentSchema.safeParse(await response.json())
    if (!parsed.success) return null
    const p = parsed.data
    return { id: p.id, orderId: p.order_id ?? null, amountPaise: p.amount, email: p.email ?? '', contact: p.contact ?? '', notes: (p.notes as Record<string, string> | undefined) ?? {} }
  } catch {
    return null
  }
}

/** An order's notes (product, batch, buyer details we set when creating it) — server only. */
export async function fetchOrderNotes(orderId: string): Promise<Record<string, string>> {
  const header = auth()
  if (header === null) return {}
  try {
    const response = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: header }, cache: 'no-store', signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return {}
    const parsed = z.object({ notes: z.union([NotesSchema, z.array(z.unknown()).transform(() => ({}))]).optional() }).safeParse(await response.json())
    return parsed.success ? ((parsed.data.notes as Record<string, string> | undefined) ?? {}) : {}
  } catch {
    return {}
  }
}
