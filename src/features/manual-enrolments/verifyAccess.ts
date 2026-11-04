import { createServiceClient } from '@/lib/supabase/service'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { logger } from '@/lib/logger'
import { accessVerdict, normaliseEmail, type AccessFacts, type AccessVerdict } from './rules'

type Db = ReturnType<typeof createServiceClient>

/** The account for an email, from the real sign-in accounts (profiles.email is empty for many older Google accounts). */
export async function lookupAccount(db: Db, email: string): Promise<{ ok: true; userId: string | null } | { ok: false }> {
  const { data, error } = await db.rpc('user_id_by_email', { p_email: email })
  if (error) {
    logger.error('manual enrolment: account lookup failed', { code: error.code })
    return { ok: false }
  }
  return { ok: true, userId: typeof data === 'string' ? data : null }
}

async function hasOpenPayment(db: Db, email: string): Promise<boolean> {
  const { count } = await db.from('masterclass_payments').select('id', { count: 'exact', head: true }).is('granted_at', null).is('refunded_at', null).ilike('email', email)
  return (count ?? 0) > 0
}

async function programSubscription(db: Db, userId: string): Promise<{ status: string } | null> {
  const { data } = await db.from('subscriptions').select('status, plans!inner(key)').eq('user_id', userId).eq('plans.key', 'qsr-masterclass').maybeSingle()
  return data ? { status: data.status } : null
}

async function isBlocked(db: Db, userId: string): Promise<boolean> {
  const { data } = await db.auth.admin.getUserById(userId)
  const until = data.user?.banned_until
  return typeof until === 'string' && new Date(until).getTime() > Date.now()
}

/**
 * Checks a learner's access the way the app does (getIsPaidUser). An open
 * payment for an existing account is claimed first — exactly what the app
 * does at their next page load — so a green result means access is really on.
 */
export async function verifyLearnerAccess(rawEmail: string): Promise<AccessVerdict> {
  const email = normaliseEmail(rawEmail)
  const db = createServiceClient()
  const facts = await gatherFacts(db, email)
  const verdict = accessVerdict(facts, email)
  if (!verdict.ok) logger.warn('manual enrolment: access NOT verified', { account: facts.account })
  return verdict
}

async function gatherFacts(db: Db, email: string): Promise<AccessFacts> {
  const account = await lookupAccount(db, email)
  if (!account.ok) return { account: 'lookup-failed' }
  if (account.userId === null) return { account: 'none', pendingPayment: await hasOpenPayment(db, email) }
  const userId = account.userId
  let paid = await getIsPaidUser(userId, db)
  if (!paid) {
    const { data } = await db.rpc('claim_pending_access', { p_user: userId })
    if (typeof data === 'number' && data > 0) paid = await getIsPaidUser(userId, db)
  }
  const [blocked, subscription] = await Promise.all([isBlocked(db, userId), paid ? Promise.resolve({ status: 'active' }) : programSubscription(db, userId)])
  return { account: 'found', paid, blocked, programSubscription: subscription }
}
