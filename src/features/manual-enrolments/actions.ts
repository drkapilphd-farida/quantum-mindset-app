'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { normaliseEmail, PAYMENT_MODES, todayIst } from './rules'

// Admin-only: record a Sharp Brain 30-Day Program payment taken by GPay, cash
// or bank transfer, and give access. If the learner hasn't signed up yet, the
// existing sign-up routine claims the payment (same as a Razorpay payment).

type Result = { ok: true; message: string } | { ok: false; error: string }

const PAGE = '/admin/manual-enrolments'

/** The account for an email, from the real sign-in accounts (profiles.email is empty for many older Google accounts). */
async function accountIdForEmail(email: string): Promise<string | null> {
  const { data, error } = await createServiceClient().rpc('user_id_by_email', { p_email: email })
  if (error) {
    logger.error('manual enrolment: account lookup failed', { code: error.code })
    return null
  }
  return typeof data === 'string' ? data : null
}

async function cancelProgramAccessIfNoOtherPayment(db: ReturnType<typeof createServiceClient>, userId: string, exceptId: string): Promise<void> {
  const { count } = await db.from('masterclass_payments').select('id', { count: 'exact', head: true }).eq('user_id', userId).is('refunded_at', null).neq('id', exceptId)
  if ((count ?? 0) > 0) return
  const { data: plan } = await db.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()
  if (plan) await db.from('subscriptions').update({ status: 'canceled', canceled_at: new Date().toISOString() }).eq('user_id', userId).eq('plan_id', plan.id)
}

const RecordSchema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(20).optional(),
  amountInr: z.number().int().min(1).max(1_000_000),
  mode: z.enum(PAYMENT_MODES),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  batchStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  note: z.string().trim().max(300).optional(),
})

export async function recordManualEnrolment(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = RecordSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check the email, amount and date.' }
  const d = parsed.data
  if (d.paidOn > todayIst()) return { ok: false, error: 'The payment date can’t be in the future.' }
  const email = normaliseEmail(d.email)
  const db = createServiceClient()

  const { data: plan } = await db.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()
  if (!plan) return { ok: false, error: 'Program plan not found.' }
  // One active manual entry per email: correct an entry with Edit instead.
  const { data: existing } = await db.from('masterclass_payments').select('amount_cents, paid_on').eq('source', 'manual').is('refunded_at', null).ilike('email', email).limit(1)
  if (existing && existing.length > 0) {
    const e = existing[0]!
    return { ok: false, error: `This email already has an active manual enrolment (₹${((e.amount_cents ?? 0) / 100).toLocaleString('en-IN')}, ${e.paid_on}). Use Edit on that entry instead.` }
  }
  const userId = await accountIdForEmail(email)
  const now = new Date().toISOString()

  const { error } = await db.from('masterclass_payments').insert({
    razorpay_payment_id: `manual-${randomUUID()}`,
    source: 'manual',
    email,
    customer_name: d.name || null,
    phone: d.phone || null,
    amount_cents: d.amountInr * 100,
    currency: 'INR',
    payment_mode: d.mode,
    paid_on: d.paidOn,
    batch_start: d.batchStart,
    recorded_by: admin,
    note: d.note || null,
    ...(userId !== null ? { user_id: userId, granted_at: now } : {}),
  })
  if (error) {
    logger.error('recordManualEnrolment: insert failed', { code: error.code })
    return { ok: false, error: error.code === '23505' ? 'This email already has an active manual enrolment. Use Edit on that entry instead.' : 'Could not save. Please try again.' }
  }
  if (userId !== null) {
    const { error: subError } = await db
      .from('subscriptions')
      .upsert({ user_id: userId, plan_id: plan.id, status: 'active', current_period_start: now, canceled_at: null }, { onConflict: 'user_id,plan_id' })
    if (subError) {
      logger.error('recordManualEnrolment: access failed', { code: subError.code })
      return { ok: false, error: 'Payment saved, but access could not be switched on. Please tell support.' }
    }
  }
  revalidatePath(PAGE)
  return { ok: true, message: userId !== null ? 'Saved. Access is on now.' : 'Saved. Access switches on when they sign up with this email.' }
}

export async function refundManualEnrolment(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid entry.' }
  const db = createServiceClient()
  const { data: row } = await db.from('masterclass_payments').select('id, user_id, source, refunded_at').eq('id', parsed.data.id).maybeSingle()
  if (!row || row.source !== 'manual') return { ok: false, error: 'Only manual enrolments can be refunded here.' }
  if (row.refunded_at !== null) return { ok: true, message: 'Already refunded.' }
  const now = new Date().toISOString()

  if (row.user_id !== null) await cancelProgramAccessIfNoOtherPayment(db, row.user_id, row.id)
  // granted_at is set too, so a refunded payment can never be claimed at a later sign-up.
  const { error } = await db.from('masterclass_payments').update({ refunded_at: now, granted_at: now }).eq('id', row.id)
  if (error) {
    logger.error('refundManualEnrolment: update failed', { code: error.code })
    return { ok: false, error: 'Could not save the refund. Please try again.' }
  }
  logger.info('manual enrolment refunded', { by: 'admin' })
  revalidatePath(PAGE)
  return { ok: true, message: 'Refunded. Access has been removed.' }
}

const EditSchema = z.object({
  id: z.string().uuid(),
  amountInr: z.number().int().min(1).max(1_000_000),
  mode: z.enum(PAYMENT_MODES),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  batchStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
})

/** Correct an entry's amount, mode, date or batch (access is unchanged). */
export async function updateManualEnrolment(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = EditSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check the amount and date.' }
  const d = parsed.data
  if (d.paidOn > todayIst()) return { ok: false, error: 'The payment date can’t be in the future.' }
  const { data, error } = await createServiceClient()
    .from('masterclass_payments')
    .update({ amount_cents: d.amountInr * 100, payment_mode: d.mode, paid_on: d.paidOn, batch_start: d.batchStart })
    .eq('id', d.id)
    .eq('source', 'manual')
    .select('id')
  if (error || !data || data.length === 0) {
    logger.error('updateManualEnrolment: update failed', { code: error?.code })
    return { ok: false, error: 'Could not save the change.' }
  }
  revalidatePath(PAGE)
  return { ok: true, message: 'Saved.' }
}

/** Remove an entry made by mistake — not a refund: it disappears from the list and the reports. Access goes too, unless the learner has another payment. */
export async function deleteManualEnrolment(input: unknown): Promise<Result> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid entry.' }
  const db = createServiceClient()
  const { data: row } = await db.from('masterclass_payments').select('id, user_id, source').eq('id', parsed.data.id).maybeSingle()
  if (!row || row.source !== 'manual') return { ok: false, error: 'Only manual enrolments can be deleted here.' }
  if (row.user_id !== null) await cancelProgramAccessIfNoOtherPayment(db, row.user_id, row.id)
  const { error } = await db.from('masterclass_payments').delete().eq('id', row.id).eq('source', 'manual')
  if (error) {
    logger.error('deleteManualEnrolment: delete failed', { code: error.code })
    return { ok: false, error: 'Could not delete. Please try again.' }
  }
  revalidatePath(PAGE)
  return { ok: true, message: 'Deleted.' }
}
