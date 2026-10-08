import webpush from 'web-push'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { getAppMessages } from '@/lib/app-i18n/server'
import { createTranslator } from '@/lib/app-i18n/translate'
import { ENGLISH } from '@/lib/app-i18n/catalog'
import { isAppLang } from '@/lib/app-i18n/languages'
import { dayOpensAt } from '@/features/thirty-day-curriculum/paceControl'
import { CLASS_TOPICS_EN, isClassNumber } from '@/features/live-classes/liveClasses'
import { isReminderTime, istDateKey, practiceWaiting, reminderKind, startsTomorrow, todayStatus, type ReminderKind } from './reminders'

// The 15-minute reminder job (Phase 3): for every learner whose reminder time
// has come, who has practice waiting today and hasn't had a reminder today,
// send one phone notification in their language. The day's reminder is
// claimed in reminder_log BEFORE sending, so two overlapping runs can never
// send twice. Logs only counts — never names, emails or numbers.

export type RunSummary = { checked: number; due: number; sent: number; failed: number; skipped: number }

export function pushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT)
}

export async function sendDueReminders(nowMs: number = Date.now()): Promise<RunSummary> {
  const summary: RunSummary = { checked: 0, due: 0, sent: 0, failed: 0, skipped: 0 }
  if (!pushConfigured()) {
    logger.error('sendDueReminders: VAPID keys are not configured')
    return summary
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!)
  const db = createServiceClient()
  const today = istDateKey(nowMs)

  const [{ data: settings }, { data: sentToday }] = await Promise.all([
    db.from('reminder_settings').select('user_id, reminder_time').eq('push_enabled', true).eq('admin_disabled', false),
    db.from('reminder_log').select('user_id').eq('ist_date', today).eq('status', 'sent'),
  ])
  const alreadySent = new Set((sentToday ?? []).map((r) => r.user_id))
  const timeDue = (settings ?? []).filter((s) => isReminderTime(s.reminder_time, nowMs) && !alreadySent.has(s.user_id))
  summary.checked = settings?.length ?? 0

  for (const { user_id: uid } of timeDue) {
    try {
      const outcome = await remindOne(db, uid, today, nowMs)
      summary[outcome] += 1
      if (outcome !== 'skipped') summary.due += 1
    } catch (error) {
      logger.error('sendDueReminders: learner failed', { error: error instanceof Error ? error.message : 'unknown' })
      summary.failed += 1
    }
  }
  return summary
}

type Db = ReturnType<typeof createServiceClient>

async function remindOne(db: Db, uid: string, today: string, nowMs: number): Promise<'sent' | 'failed' | 'skipped'> {
  const [{ data: subs }, { data: completions }, { data: profile }, { data: pace }, { data: regs }] = await Promise.all([
    db.from('push_subscriptions').select('id, endpoint, p256dh, auth, failed_count').eq('user_id', uid),
    db.from('curriculum_day_completions').select('day, completed_at').eq('user_id', uid),
    db.from('profiles').select('preferred_language').eq('id', uid).maybeSingle(),
    db.from('curriculum_pace_settings').select('pace_off').eq('user_id', uid).maybeSingle(),
    db.from('live_class_registrations').select('session_id, live_class_sessions(class_number, topic_override, starts_at, status)').eq('user_id', uid).is('cancelled_at', null),
  ])
  if (!subs || subs.length === 0) return 'skipped'
  // The job has no signed-in learner: check enrolment with the service client.
  if (!(await getIsPaidUser(uid, db))) return 'skipped'

  // Today's status, with the same midnight rule as the app (pace control).
  const list = (completions ?? []).map((c) => ({ day: c.day, completedAt: c.completed_at }))
  const last = list.reduce<(typeof list)[number] | null>((a, b) => (a === null || b.day > a.day ? b : a), null)
  let opensAt: string | null = null
  if (last !== null && last.day < 30) {
    const { data: activity } = await db.from('curriculum_day_activity').select('paced').eq('user_id', uid).eq('day', last.day).maybeSingle()
    opensAt = dayOpensAt({ completedAt: last.completedAt, paced: activity?.paced === true }, pace?.pace_off === true)
  }
  const status = todayStatus(list, opensAt, nowMs)
  if (!practiceWaiting(status)) return 'skipped'

  type SessionJoin = { class_number: number; topic_override: string | null; starts_at: string; status: string } | null
  const tomorrowClass = (regs ?? [])
    .map((r) => r.live_class_sessions as unknown as SessionJoin)
    .find((s): s is NonNullable<SessionJoin> => s !== null && s.status === 'published' && startsTomorrow(s.starts_at, nowMs))
  const kind: ReminderKind = reminderKind(status, tomorrowClass !== undefined)

  // Claim today's one reminder first; a parallel run that lost the race stops here.
  const { data: claim, error: claimError } = await db.from('reminder_log').insert({ user_id: uid, ist_date: today, channel: 'push', kind, status: 'sent' }).select('id').single()
  if (claimError || !claim) return 'skipped'

  const lang = isAppLang(profile?.preferred_language) ? profile.preferred_language : 'en'
  const t = createTranslator(getAppMessages(lang), ENGLISH)
  const vars = {
    day: status.day,
    n: tomorrowClass?.class_number ?? 0,
    topic: tomorrowClass ? (tomorrowClass.topic_override ?? (isClassNumber(tomorrowClass.class_number) ? CLASS_TOPICS_EN[tomorrowClass.class_number] : '')) : '',
  }
  const payload = JSON.stringify({
    title: t('dashboard.reminders.push.title'),
    body: t(`dashboard.reminders.push.${kind === 'live_class' ? 'liveClass' : kind}`, vars),
    url: '/labs/sharp-brain/thirty-day-curriculum',
    tag: `sharp-brain-${today}`,
  })

  let delivered = 0
  for (const sub of subs) {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload, { TTL: 6 * 3600, urgency: 'normal' })
      delivered += 1
      await db.from('push_subscriptions').update({ last_success_at: new Date().toISOString(), failed_count: 0 }).eq('id', sub.id)
    } catch (error) {
      const code = (error as { statusCode?: number }).statusCode
      // 404/410: the phone or browser no longer has this subscription.
      if (code === 404 || code === 410) await db.from('push_subscriptions').delete().eq('id', sub.id)
      else await db.from('push_subscriptions').update({ failed_count: sub.failed_count + 1 }).eq('id', sub.id)
    }
  }
  if (delivered === 0) {
    await db.from('reminder_log').update({ status: 'failed', detail: 'no device accepted the notification' }).eq('id', claim.id)
    return 'failed'
  }
  return 'sent'
}
