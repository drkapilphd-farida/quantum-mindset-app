'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { PLAN_TYPES } from '../rules'

// /admin/unmatched-payments: payments the program webhook did not recognise
// as Sharp Brain (saved, never dropped). The founder can mark one reviewed
// (another product, nothing to do) or give Sharp Brain access for it as Live
// or Self-paced — instantly if the email has an account, else at sign-up.

type Result = { ok: true; message: string } | { ok: false; error: string }
const PAGE = '/admin/unmatched-payments'

export type UnmatchedPayment = {
  id: string
  paymentId: string
  event: string
  reason: string
  shortUrl: string | null
  amountInr: number | null
  currency: string | null
  email: string | null
  phone: string | null
  name: string | null
  notes: string
  reviewedAt: string | null
  reviewedBy: string | null
  createdAt: string
}

export async function listUnmatchedPayments(): Promise<UnmatchedPayment[]> {
  if ((await currentAdminEmail()) === null) return []
  const { data, error } = await createServiceClient()
    .from('unmatched_payments')
    .select('id, razorpay_payment_id, event, reason, short_url, amount_cents, currency, email, phone, customer_name, notes, reviewed_at, reviewed_by, created_at')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) logger.error('listUnmatchedPayments: read failed', { code: error.code })
  return (data ?? []).map((r) => ({
    id: r.id,
    paymentId: r.razorpay_payment_id,
    event: r.event,
    reason: r.reason,
    shortUrl: r.short_url,
    amountInr: r.amount_cents === null ? null : r.amount_cents / 100,
    currency: r.currency,
    email: r.email,
    phone: r.phone,
    name: r.customer_name,
    notes: r.notes !== null && typeof r.notes === 'object' && !Array.isArray(r.notes) ? Object.entries(r.notes).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join(' · ') : '',
    reviewedAt: r.reviewed_at,
    reviewedBy: r.reviewed_by,
    createdAt: r.created_at,
  }))
}

export async function markUnmatchedReviewed(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid entry.' }
  const { error } = await createServiceClient().from('unmatched_payments').update({ reviewed_at: new Date().toISOString(), reviewed_by: admin }).eq('id', parsed.data.id)
  if (error) return { ok: false, error: 'Could not save.' }
  revalidatePath(PAGE)
  return { ok: true, message: 'Marked as reviewed.' }
}

export async function grantAccessForUnmatched(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ id: z.string().uuid(), plan: z.enum(PLAN_TYPES) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid entry.' }
  const db = createServiceClient()
  const { data: row } = await db.from('unmatched_payments').select('razorpay_payment_id, email, phone, amount_cents, currency, customer_name, payment_link_id').eq('id', parsed.data.id).maybeSingle()
  if (!row) return { ok: false, error: 'Entry not found.' }
  if (row.email === null) return { ok: false, error: 'This payment has no email, so it cannot be linked to an account. Use Manual enrolments with the learner’s email.' }

  const { data: plan } = await db.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()
  if (!plan) return { ok: false, error: 'Program plan not found.' }
  const { data: userId } = await db.rpc('user_id_by_email', { p_email: row.email })
  const accountId = typeof userId === 'string' ? userId : null
  const now = new Date().toISOString()

  const { error: insertError } = await db.from('masterclass_payments').insert({
    razorpay_payment_id: row.razorpay_payment_id,
    email: row.email,
    phone: row.phone,
    amount_cents: row.amount_cents,
    currency: row.currency,
    customer_name: row.customer_name,
    payment_link_id: row.payment_link_id,
    plan_type: parsed.data.plan,
    note: `Given access from unmatched payments by ${admin}`.slice(0, 300),
    ...(accountId !== null ? { user_id: accountId, granted_at: now } : {}),
  })
  if (insertError && insertError.code !== '23505') {
    logger.error('grantAccessForUnmatched: payment insert failed', { code: insertError.code })
    return { ok: false, error: 'Could not save. Please try again.' }
  }
  if (accountId !== null) {
    const { error: subError } = await db
      .from('subscriptions')
      .upsert({ user_id: accountId, plan_id: plan.id, status: 'active', current_period_start: now, canceled_at: null }, { onConflict: 'user_id,plan_id' })
    if (subError) {
      logger.error('grantAccessForUnmatched: access failed', { code: subError.code })
      return { ok: false, error: 'Payment saved, but access could not be switched on. Please tell support.' }
    }
  }
  await db.from('unmatched_payments').update({ reviewed_at: now, reviewed_by: admin }).eq('id', parsed.data.id)
  revalidatePath(PAGE)
  const label = parsed.data.plan === 'live' ? 'Live batch' : 'Self-paced'
  return { ok: true, message: accountId !== null ? `${label} access is on now.` : `${label} access switches on when they sign up with ${row.email}.` }
}
