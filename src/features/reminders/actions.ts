'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getNextDayOpensAt } from '@/features/thirty-day-curriculum/actions/paceActions'
import { cleanReminderTime, DEFAULT_REMINDER, streakDays, todayStatus, type TodayStatus } from './reminders'

// Daily reminders (Phase 3) — the learner's side: today's banner, and phone
// notifications on/off with a chosen time. Writes go through the server.

async function userId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export type BannerData = { status: TodayStatus; streak: number } | null

/** Today's status and streak for the in-app banner (enrolled learners only). */
export async function getReminderBanner(): Promise<BannerData> {
  const uid = await userId()
  if (uid === null || !(await hasQuantumSpeedReadingProAccess())) return null
  const supabase = await createClient()
  const [{ data }, opensAt] = await Promise.all([supabase.from('curriculum_day_completions').select('day, completed_at').eq('user_id', uid), getNextDayOpensAt()])
  const completions = (data ?? []).map((c) => ({ day: c.day, completedAt: c.completed_at }))
  const now = Date.now()
  return { status: todayStatus(completions, opensAt, now), streak: streakDays(completions, now) }
}

export type ReminderSettings = { pushEnabled: boolean; time: string; devices: number; adminDisabled: boolean }

export async function getReminderSettings(): Promise<ReminderSettings> {
  const uid = await userId()
  const empty: ReminderSettings = { pushEnabled: false, time: DEFAULT_REMINDER, devices: 0, adminDisabled: false }
  if (uid === null) return empty
  const supabase = await createClient()
  const [{ data: settings }, { count }] = await Promise.all([
    supabase.from('reminder_settings').select('push_enabled, reminder_time, admin_disabled').eq('user_id', uid).maybeSingle(),
    supabase.from('push_subscriptions').select('id', { count: 'exact', head: true }).eq('user_id', uid),
  ])
  return {
    pushEnabled: settings?.push_enabled ?? false,
    time: (settings?.reminder_time ?? DEFAULT_REMINDER).slice(0, 5),
    devices: count ?? 0,
    adminDisabled: settings?.admin_disabled ?? false,
  }
}

const SubscriptionSchema = z.object({
  endpoint: z.string().url().max(1000),
  keys: z.object({ p256dh: z.string().min(10).max(200), auth: z.string().min(10).max(100) }),
})

type Result = { ok: true } | { ok: false; error: 'unauthenticated' | 'invalid' | 'db' }

/** This phone/browser allowed notifications: save it and turn reminders on at the chosen time. */
export async function enablePushReminders(input: unknown): Promise<Result> {
  const parsed = z.object({ subscription: SubscriptionSchema, time: z.string(), deviceLabel: z.string().max(120).optional() }).safeParse(input)
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const time = parsed.success ? cleanReminderTime(parsed.data.time) : null
  if (!parsed.success || time === null) return { ok: false, error: 'invalid' }
  const db = createServiceClient()
  const { subscription, deviceLabel } = parsed.data
  const [a, b] = await Promise.all([
    db
      .from('push_subscriptions')
      .upsert({ user_id: uid, endpoint: subscription.endpoint, p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, device_label: deviceLabel ?? null, failed_count: 0 }, { onConflict: 'endpoint' }),
    db.from('reminder_settings').upsert({ user_id: uid, push_enabled: true, reminder_time: time, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }),
  ])
  if (a.error || b.error) {
    logger.error('enablePushReminders: save failed', { code: a.error?.code ?? b.error?.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

/** A new reminder time (06:00–22:00, India time). */
export async function setReminderTime(input: unknown): Promise<Result> {
  const parsed = z.object({ time: z.string() }).safeParse(input)
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  const time = parsed.success ? cleanReminderTime(parsed.data.time) : null
  if (time === null) return { ok: false, error: 'invalid' }
  const { error } = await createServiceClient().from('reminder_settings').upsert({ user_id: uid, reminder_time: time, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  return error ? { ok: false, error: 'db' } : { ok: true }
}

/** Phone reminders off (and this device forgotten). */
export async function disablePushReminders(input: unknown): Promise<Result> {
  const parsed = z.object({ endpoint: z.string().url().max(1000).optional() }).safeParse(input)
  const uid = await userId()
  if (uid === null) return { ok: false, error: 'unauthenticated' }
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const db = createServiceClient()
  const ops = [db.from('reminder_settings').upsert({ user_id: uid, push_enabled: false, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })]
  if (parsed.data.endpoint) ops.push(db.from('push_subscriptions').delete().eq('user_id', uid).eq('endpoint', parsed.data.endpoint) as never)
  const results = await Promise.all(ops)
  return results.some((r) => r.error) ? { ok: false, error: 'db' } : { ok: true }
}
