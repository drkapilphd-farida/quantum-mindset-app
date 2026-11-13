import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import type { Json } from '@/lib/supabase/types'

// Payments the program webhook did not recognise as Sharp Brain are never
// dropped: they are saved here and listed on /admin/unmatched-payments.
// Fields are read loosely — a payload we could not validate is still saved
// with whatever it carries.

export type UnmatchedReason = 'other_link' | 'invalid_payload'

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, 500) : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null)

export type UnmatchedRow = {
  razorpay_payment_id: string
  event: string
  reason: UnmatchedReason
  payment_link_id: string | null
  short_url: string | null
  amount_cents: number | null
  currency: string | null
  email: string | null
  phone: string | null
  customer_name: string | null
  notes: { [key: string]: Json }
}

/** The row saved for a webhook payload (pure — tested). */
export function unmatchedRowFromEvent(json: unknown, reason: UnmatchedReason, fallbackId: string): UnmatchedRow {
  const root = obj(json)
  const payload = obj(root['payload'])
  const link = obj(obj(payload['payment_link'])['entity'])
  const payment = obj(obj(payload['payment'])['entity'])
  const customer = obj(link['customer'])
  const linkNotes = obj(link['notes'])
  const real = (v: unknown): string | null => {
    const e = str(v)?.toLowerCase() ?? null
    return e === null || e === 'void@razorpay.com' ? null : e
  }
  const email = real(payment['email']) ?? real(customer['email'])
  return {
    razorpay_payment_id: str(payment['id']) ?? fallbackId,
    event: (str(root['event']) ?? 'unknown').slice(0, 80),
    reason,
    payment_link_id: str(link['id']),
    short_url: str(link['short_url']),
    amount_cents: num(payment['amount']),
    currency: str(payment['currency']),
    email,
    phone: str(payment['contact']),
    customer_name: str(customer['name']),
    notes: Object.fromEntries(Object.entries(linkNotes).slice(0, 30).map(([k, v]): [string, Json] => [k.slice(0, 60), typeof v === 'number' || typeof v === 'boolean' ? v : (typeof v === 'string' ? v : JSON.stringify(v) ?? '').slice(0, 300)])),
  }
}

/** Saves the payment once (a redelivery is a no-op). True when it is stored. */
export async function saveUnmatchedPayment(json: unknown, reason: UnmatchedReason): Promise<boolean> {
  const row = unmatchedRowFromEvent(json, reason, `unknown-${Date.now()}`)
  const { error } = await createServiceClient().from('unmatched_payments').upsert(row, { onConflict: 'razorpay_payment_id', ignoreDuplicates: true })
  if (error) {
    logger.error('saveUnmatchedPayment: insert failed', { code: error.code, reason })
    return false
  }
  return true
}
