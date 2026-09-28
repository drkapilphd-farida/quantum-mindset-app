'use server'

import { z } from 'zod'
import { appFeatures } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { FOCUS_SESSION_MINUTES, MAX_GOAL_MINUTES, MIN_GOAL_MINUTES, istDate, isCompletedFocusSession } from '../mobileDiscipline'

// Mobile Discipline actions (Phase 8, Item 12). All self-reported; the
// server validates input and, for focus sessions, that the full time
// really passed since the session started.

export type MobileDisciplineResult = { ok: true } | { ok: false; reason: 'disabled' | 'not_authenticated' | 'no_access' | 'invalid_input' | 'not_completed' | 'already_checked_in' | 'save_failed' }

async function authorise(): Promise<{ ok: true; userId: string; supabase: Awaited<ReturnType<typeof createClient>> } | { ok: false; reason: 'disabled' | 'not_authenticated' | 'no_access' }> {
  if (!appFeatures.mobileDiscipline) return { ok: false, reason: 'disabled' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, reason: 'not_authenticated' }
  if (!(await hasQuantumSpeedReadingProAccess())) return { ok: false, reason: 'no_access' }
  return { ok: true, userId: user.id, supabase }
}

const GoalSchema = z.object({ dailyLimitMinutes: z.number().int().min(MIN_GOAL_MINUTES).max(MAX_GOAL_MINUTES) })

export async function setScreenTimeGoal(input: unknown): Promise<MobileDisciplineResult> {
  const parsed = GoalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid_input' }
  const auth = await authorise()
  if (!auth.ok) return auth
  const { error } = await auth.supabase
    .from('screen_time_goals')
    .upsert({ user_id: auth.userId, daily_limit_minutes: parsed.data.dailyLimitMinutes, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  return error ? { ok: false, reason: 'save_failed' } : { ok: true }
}

const FocusSchema = z.object({
  plannedMinutes: z.union([z.literal(FOCUS_SESSION_MINUTES[0]), z.literal(FOCUS_SESSION_MINUTES[1]), z.literal(FOCUS_SESSION_MINUTES[2])]),
  startedAt: z.string().datetime(),
})

export async function logFocusSession(input: unknown): Promise<MobileDisciplineResult> {
  const parsed = FocusSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid_input' }
  const now = new Date()
  const startedAt = new Date(parsed.data.startedAt)
  if (!isCompletedFocusSession(parsed.data.plannedMinutes, startedAt, now)) return { ok: false, reason: 'not_completed' }
  const auth = await authorise()
  if (!auth.ok) return auth
  const { error } = await auth.supabase.from('focus_sessions').insert({
    user_id: auth.userId,
    planned_minutes: parsed.data.plannedMinutes,
    started_at: startedAt.toISOString(),
    completed_at: now.toISOString(),
  })
  return error ? { ok: false, reason: 'save_failed' } : { ok: true }
}

const CheckinSchema = z.object({ withinGoal: z.boolean() })

export async function saveScreenGoalCheckin(input: unknown): Promise<MobileDisciplineResult> {
  const parsed = CheckinSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid_input' }
  const auth = await authorise()
  if (!auth.ok) return auth
  const { error } = await auth.supabase.from('digital_detox_checkins').insert({
    user_id: auth.userId,
    kind: 'screen_goal',
    within_goal: parsed.data.withinGoal,
    // kept_phone_away is required by the original table; mirror the answer.
    kept_phone_away: parsed.data.withinGoal,
    check_date: istDate(new Date()),
  })
  if (error) return { ok: false, reason: error.code === '23505' ? 'already_checked_in' : 'save_failed' }
  return { ok: true }
}
