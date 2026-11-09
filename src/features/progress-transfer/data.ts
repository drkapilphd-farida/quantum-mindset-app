import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { accessOf, type AccessSummary } from './rules'

type Db = ReturnType<typeof createServiceClient>

export type AccountSnapshot = {
  userId: string
  email: string
  name: string | null
  createdAt: string | null
  planDays: number[]
  readingTests: number
  exerciseResults: number
  certificate: boolean
  access: AccessSummary
}

/** The sign-in account for an email (profiles.email is empty for many older Google accounts). */
export async function accountIdForEmail(db: Db, email: string): Promise<string | null> {
  const { data, error } = await db.rpc('user_id_by_email', { p_email: email })
  if (error) {
    logger.error('progress transfer: account lookup failed', { code: error.code })
    return null
  }
  return typeof data === 'string' ? data : null
}

/** What an account holds today (admin only — service client). */
export async function snapshotAccount(db: Db, userId: string, email: string): Promise<AccountSnapshot> {
  const [profile, user, days, tests, results, cert, subs] = await Promise.all([
    db.from('profiles').select('full_name').eq('id', userId).maybeSingle(),
    db.auth.admin.getUserById(userId),
    db.from('curriculum_day_completions').select('day').eq('user_id', userId),
    db.from('reading_tests').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    db.from('exercise_results').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    db.from('program_certificates').select('id').eq('user_id', userId).is('revoked_at', null).maybeSingle(),
    db.from('subscriptions').select('status, current_period_end, plans(billing_interval)').eq('user_id', userId),
  ])
  const subRows = (subs.data ?? []).map((s) => {
    const plan = s.plans as { billing_interval: string } | { billing_interval: string }[] | null
    return { status: s.status, current_period_end: s.current_period_end, billing_interval: (Array.isArray(plan) ? plan[0]?.billing_interval : plan?.billing_interval) ?? null }
  })
  return {
    userId,
    email,
    name: profile.data?.full_name ?? null,
    createdAt: user.data.user?.created_at ?? null,
    planDays: (days.data ?? []).map((d) => d.day).sort((a, b) => a - b),
    readingTests: tests.count ?? 0,
    exerciseResults: results.count ?? 0,
    certificate: cert.data !== null,
    access: accessOf(subRows, Date.now()),
  }
}

export type TransferLogRow = { id: string; fromEmail: string; toEmail: string; by: string; at: string; summary: Record<string, number> }

/** The latest transfers, newest first. */
export async function listTransfers(): Promise<TransferLogRow[]> {
  const { data } = await createServiceClient().from('progress_transfers').select('id, from_email, to_email, transferred_by, created_at, summary').order('created_at', { ascending: false }).limit(50)
  return (data ?? []).map((r) => ({ id: r.id, fromEmail: r.from_email, toEmail: r.to_email, by: r.transferred_by, at: r.created_at, summary: (r.summary ?? {}) as Record<string, number> }))
}
