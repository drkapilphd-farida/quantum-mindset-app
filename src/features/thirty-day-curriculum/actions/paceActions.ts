'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { beatCredit, dayOpensAt, dayStepIds } from '../paceControl'

// Pace control (Phase 3, item 4) — the server keeps the practice time and the
// finished steps of each day, so neither can be faked from the browser.

const DaySchema = z.number().int().min(1).max(30)

async function userId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export type DayPace = { activeSeconds: number; stepsDone: string[]; paceOff: boolean }

/** Practice time and finished steps of one day, and whether pace control is off for this learner. */
export async function getDayPace(input: unknown): Promise<DayPace> {
  const parsed = z.object({ day: DaySchema }).safeParse(input)
  const uid = await userId()
  if (!parsed.success || uid === null) return { activeSeconds: 0, stepsDone: [], paceOff: false }
  const supabase = await createClient()
  const [{ data: row }, { data: setting }] = await Promise.all([
    supabase.from('curriculum_day_activity').select('active_seconds, steps_done').eq('user_id', uid).eq('day', parsed.data.day).maybeSingle(),
    supabase.from('curriculum_pace_settings').select('pace_off').eq('user_id', uid).maybeSingle(),
  ])
  return { activeSeconds: row?.active_seconds ?? 0, stepsDone: row?.steps_done ?? [], paceOff: setting?.pace_off === true }
}

/** A practice heartbeat while a day's step is open and in use. Returns the day's total. */
export async function recordPracticeBeat(input: unknown): Promise<{ activeSeconds: number }> {
  const parsed = z.object({ day: DaySchema }).safeParse(input)
  const uid = await userId()
  if (!parsed.success || uid === null) return { activeSeconds: 0 }
  const db = createServiceClient()
  const now = Date.now()
  const { data: row } = await db.from('curriculum_day_activity').select('active_seconds, last_beat_at').eq('user_id', uid).eq('day', parsed.data.day).maybeSingle()
  const total = Math.min(86_400, (row?.active_seconds ?? 0) + beatCredit(row?.last_beat_at ?? null, now))
  const stamp = new Date(now).toISOString()
  const { error } = await db
    .from('curriculum_day_activity')
    .upsert({ user_id: uid, day: parsed.data.day, active_seconds: total, last_beat_at: stamp, updated_at: stamp }, { onConflict: 'user_id,day' })
  if (error) logger.error('recordPracticeBeat: upsert failed', { code: error.code })
  return { activeSeconds: total }
}

/** A step of the day really finished (never called for "Do this later"). */
export async function recordStepDone(input: unknown): Promise<{ ok: boolean }> {
  const parsed = z.object({ day: DaySchema, exerciseId: z.string().min(1).max(80) }).safeParse(input)
  const uid = await userId()
  if (!parsed.success || uid === null) return { ok: false }
  if (!dayStepIds(parsed.data.day).includes(parsed.data.exerciseId)) return { ok: false }
  const db = createServiceClient()
  const { data: row } = await db.from('curriculum_day_activity').select('steps_done').eq('user_id', uid).eq('day', parsed.data.day).maybeSingle()
  const done = row?.steps_done ?? []
  if (done.includes(parsed.data.exerciseId)) return { ok: true }
  const { error } = await db
    .from('curriculum_day_activity')
    .upsert({ user_id: uid, day: parsed.data.day, steps_done: [...done, parsed.data.exerciseId], updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' })
  if (error) logger.error('recordStepDone: upsert failed', { code: error.code })
  return { ok: !error }
}

/** When the learner's next day opens (null = open now, or nothing waiting). */
export async function getNextDayOpensAt(): Promise<string | null> {
  const uid = await userId()
  if (uid === null) return null
  const supabase = await createClient()
  const [{ data: completions }, { data: setting }] = await Promise.all([
    supabase.from('curriculum_day_completions').select('day, completed_at').eq('user_id', uid),
    supabase.from('curriculum_pace_settings').select('pace_off').eq('user_id', uid).maybeSingle(),
  ])
  const days = (completions ?? []).map((c) => c.day)
  const last = Math.max(0, ...days)
  if (last === 0 || last >= 30) return null
  const { data: activity } = await supabase.from('curriculum_day_activity').select('paced').eq('user_id', uid).eq('day', last).maybeSingle()
  const prev = (completions ?? []).find((c) => c.day === last)!
  const opensAt = dayOpensAt({ completedAt: prev.completed_at, paced: activity?.paced === true }, setting?.pace_off === true)
  return opensAt !== null && Date.parse(opensAt) > Date.now() ? opensAt : null
}
