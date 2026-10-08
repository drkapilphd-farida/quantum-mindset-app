'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { canRegister, classesDone, type AttendanceMark, type Session } from './liveClasses'

export type LiveClassesView = {
  enrolled: boolean
  sessions: Session[]
  registeredSessionIds: string[]
  marks: AttendanceMark[]
  daysCompleted: number
  learner: { name: string; email: string }
}

type SessionRow = { id: string; class_number: number; topic_override: string | null; starts_at: string; ends_at: string; status: string }
const toSession = (r: SessionRow): Session => ({ id: r.id, classNumber: r.class_number, topicOverride: r.topic_override, startsAt: r.starts_at, endsAt: r.ends_at, status: r.status as Session['status'] })

/** Everything the learner's Live Classes page needs. */
export async function getLiveClassesView(): Promise<LiveClassesView> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const empty: LiveClassesView = { enrolled: false, sessions: [], registeredSessionIds: [], marks: [], daysCompleted: 0, learner: { name: '', email: '' } }
  if (!user) return empty

  const [enrolled, sessions, registrations, marks, days, profile] = await Promise.all([
    hasQuantumSpeedReadingProAccess(),
    supabase.from('live_class_sessions').select('id, class_number, topic_override, starts_at, ends_at, status').gte('ends_at', new Date(Date.now() - 86_400_000).toISOString()).order('starts_at'),
    supabase.from('live_class_registrations').select('session_id').eq('user_id', user.id).is('cancelled_at', null),
    supabase.from('live_class_attendance').select('class_number, kind, counts').eq('user_id', user.id),
    supabase.from('curriculum_day_completions').select('day').eq('user_id', user.id),
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
  ])
  if (sessions.error) logger.error('getLiveClassesView: sessions read failed', { code: sessions.error.code })

  return {
    enrolled,
    sessions: (sessions.data ?? []).map(toSession),
    registeredSessionIds: (registrations.data ?? []).map((r) => r.session_id),
    marks: (marks.data ?? []).map((m) => ({ classNumber: m.class_number, kind: m.kind as AttendanceMark['kind'], counts: m.counts })),
    daysCompleted: new Set((days.data ?? []).map((d) => d.day)).size,
    learner: { name: profile.data?.full_name?.trim() ?? '', email: user.email ?? '' },
  }
}

/** Classes done (x of 7) for the signed-in learner — for the 30-day plan page. */
export async function getMyClassesDone(): Promise<number> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return 0
  const { data } = await supabase.from('live_class_attendance').select('class_number, kind, counts').eq('user_id', user.id)
  return classesDone((data ?? []).map((m) => ({ classNumber: m.class_number, kind: m.kind as AttendanceMark['kind'], counts: m.counts }))).size
}

type RegisterResult = { ok: true } | { ok: false; error: 'unauthenticated' | 'not-enrolled' | 'closed' | 'invalid' | 'db' }

/** "Register for this class": saved here; the learner then confirms on WhatsApp. */
export async function registerForClass(input: unknown): Promise<RegisterResult> {
  const parsed = z.object({ sessionId: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }
  if (!(await hasQuantumSpeedReadingProAccess())) return { ok: false, error: 'not-enrolled' }

  const { data: session } = await supabase.from('live_class_sessions').select('status, starts_at').eq('id', parsed.data.sessionId).maybeSingle()
  if (!session || !canRegister({ status: session.status as Session['status'], startsAt: session.starts_at }, Date.now())) return { ok: false, error: 'closed' }

  const { error } = await createServiceClient()
    .from('live_class_registrations')
    .upsert({ session_id: parsed.data.sessionId, user_id: user.id, cancelled_at: null }, { onConflict: 'session_id,user_id' })
  if (error) {
    logger.error('registerForClass: upsert failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}

/** Cancels a registration, until the class starts. */
export async function cancelClassRegistration(input: unknown): Promise<RegisterResult> {
  const parsed = z.object({ sessionId: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }
  const { data: session } = await supabase.from('live_class_sessions').select('starts_at').eq('id', parsed.data.sessionId).maybeSingle()
  if (!session || Date.parse(session.starts_at) <= Date.now()) return { ok: false, error: 'closed' }
  const { error } = await createServiceClient()
    .from('live_class_registrations')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('session_id', parsed.data.sessionId)
    .eq('user_id', user.id)
  if (error) {
    logger.error('cancelClassRegistration: update failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}
