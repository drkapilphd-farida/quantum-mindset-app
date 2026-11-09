'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { currentAdminEmail } from '@/features/live-classes/admin/data'
import { accountIdForEmail, snapshotAccount, type AccountSnapshot } from './data'
import { normaliseEmail } from './rules'

// Admin-only "Transfer progress" (founder, 9 Nov 2026): copy a learner's
// progress, checkpoints, scores and access from an old account to a new one.
// The better value is kept; nothing is lowered; the old account stays.

const PAGE = '/admin/transfer-progress'
const Emails = z.object({ fromEmail: z.string().trim().email().max(320), toEmail: z.string().trim().email().max(320) })

type Pair = { from: AccountSnapshot; to: AccountSnapshot }
export type PreviewResult = ({ ok: true } & Pair) | { ok: false; error: string }
export type TransferResult = { ok: true; summary: Record<string, number>; after: AccountSnapshot } | { ok: false; error: string }

async function resolvePair(input: unknown): Promise<{ ok: true; fromEmail: string; toEmail: string; fromId: string; toId: string } | { ok: false; error: string }> {
  const parsed = Emails.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please enter two valid email addresses.' }
  const fromEmail = normaliseEmail(parsed.data.fromEmail)
  const toEmail = normaliseEmail(parsed.data.toEmail)
  if (fromEmail === toEmail) return { ok: false, error: 'The old and new email are the same.' }
  const db = createServiceClient()
  const [fromId, toId] = await Promise.all([accountIdForEmail(db, fromEmail), accountIdForEmail(db, toEmail)])
  if (fromId === null) return { ok: false, error: `No account found for the old email (${fromEmail}).` }
  if (toId === null) return { ok: false, error: `No account found for the new email (${toEmail}). Ask the learner to sign up first.` }
  if (fromId === toId) return { ok: false, error: 'Both emails belong to the same account.' }
  return { ok: true, fromEmail, toEmail, fromId, toId }
}

/** Step 1: show both accounts side by side. Changes nothing. */
export async function previewTransfer(input: unknown): Promise<PreviewResult> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: 'Not authorized.' }
  const pair = await resolvePair(input)
  if (!pair.ok) return pair
  const db = createServiceClient()
  const [from, to] = await Promise.all([snapshotAccount(db, pair.fromId, pair.fromEmail), snapshotAccount(db, pair.toId, pair.toEmail)])
  return { ok: true, from, to }
}

/** Step 2 (after "Confirm transfer"): one database transaction, logged. */
export async function transferProgress(input: unknown): Promise<TransferResult> {
  const admin = await currentAdminEmail()
  if (admin === null) return { ok: false, error: 'Not authorized.' }
  const pair = await resolvePair(input)
  if (!pair.ok) return pair
  const db = createServiceClient()
  const { data, error } = await db.rpc('transfer_learner_progress', { p_from: pair.fromId, p_to: pair.toId, p_by: admin, p_from_email: pair.fromEmail, p_to_email: pair.toEmail })
  if (error) {
    logger.error('progress transfer failed', { code: error.code })
    return { ok: false, error: 'The transfer failed and nothing was changed. Please try again.' }
  }
  logger.info('progress transferred', { rows: data })
  revalidatePath(PAGE)
  return { ok: true, summary: (data ?? {}) as Record<string, number>, after: await snapshotAccount(db, pair.toId, pair.toEmail) }
}
