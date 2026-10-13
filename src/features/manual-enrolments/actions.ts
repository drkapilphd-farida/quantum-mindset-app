'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { currentAdminEmail, userIdByEmail } from '@/features/live-classes/admin/data'
import { normaliseEmail, PAYMENT_MODES, todayIst } from './rules'

// Admin-only: record a Sharp Brain 30-Day Program payment taken by GPay, cash
// or bank transfer, and give access. If the learner hasn't signed up yet, the
// existing sign-up routine claims the payment (same as a Razorpay payment).

type Result = { ok: true; message: string } | { ok: false; error: string }

const PAGE = '/admin/manual-enrolments'

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
  const userId = await userIdByEmail(email)
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
    return { ok: false, error: 'Could not save. Please try again.' }
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

  if (row.user_id !== null) {
    // Access goes, unless they also have another active program payment.
    const { count } = await db
      .from('masterclass_payments')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', row.user_id)
      .is('refunded_at', null)
      .neq('id', row.id)
    if ((count ?? 0) === 0) {
      const { data: plan } = await db.from('plans').select('id').eq('key', 'qsr-masterclass').maybeSingle()
      if (plan) await db.from('subscriptions').update({ status: 'canceled', canceled_at: now }).eq('user_id', row.user_id).eq('plan_id', plan.id)
    }
  }
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
