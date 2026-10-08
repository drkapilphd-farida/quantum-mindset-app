'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { copyCycle, istToIso, lastCycle } from '../liveClasses'
import { currentAdminEmail, listSessions, userIdByEmail } from './data'

// Trainer-only writes for live classes. The admin layout gates the pages, but
// Server Actions can be called directly, so each one re-checks ADMIN_EMAILS.
// Attendance is only ever marked here — never automatically.

type Result = { ok: true; message?: string } | { ok: false; error: string }

async function guard(): Promise<string | null> {
  const email = await currentAdminEmail()
  if (email === null) logger.warn('[live-classes] admin action refused')
  return email
}

const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const TimeStr = z.string().regex(/^\d{2}:\d{2}$/)
const SessionInput = z.object({
  classNumber: z.number().int().min(1).max(7),
  topicOverride: z.string().trim().max(120).optional(),
  date: DateStr,
  start: TimeStr,
  end: TimeStr,
  status: z.enum(['draft', 'published']).default('published'),
})

export async function createSession(input: unknown): Promise<Result> {
  if (!(await guard())) return { ok: false, error: 'Not authorized.' }
  const parsed = SessionInput.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check the class number, date and times.' }
  const { classNumber, topicOverride, date, start, end, status } = parsed.data
  const startsAt = istToIso(date, start)
  const endsAt = istToIso(date, end)
  if (Date.parse(endsAt) <= Date.parse(startsAt)) return { ok: false, error: 'The end time must be after the start time.' }
  const { error } = await createServiceClient().from('live_class_sessions').insert({ class_number: classNumber, topic_override: topicOverride || null, starts_at: startsAt, ends_at: endsAt, status })
  if (error) return { ok: false, error: 'Could not save the session.' }
  return { ok: true }
}

export async function updateSession(input: unknown): Promise<Result> {
  if (!(await guard())) return { ok: false, error: 'Not authorized.' }
  const parsed = SessionInput.extend({ id: z.string().uuid(), status: z.enum(['draft', 'published', 'cancelled']) }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please check the class number, date and times.' }
  const { id, classNumber, topicOverride, date, start, end, status } = parsed.data
  const startsAt = istToIso(date, start)
  const endsAt = istToIso(date, end)
  if (Date.parse(endsAt) <= Date.parse(startsAt)) return { ok: false, error: 'The end time must be after the start time.' }
  const { error } = await createServiceClient().from('live_class_sessions').update({ class_number: classNumber, topic_override: topicOverride || null, starts_at: startsAt, ends_at: endsAt, status }).eq('id', id)
  if (error) return { ok: false, error: 'Could not save the session.' }
  return { ok: true }
}

/** "Copy last cycle": the latest published Classes 1–7, four weeks later, as drafts to adjust and publish. */
export async function copyLastCycle(): Promise<Result> {
  if (!(await guard())) return { ok: false, error: 'Not authorized.' }
  const sessions = await listSessions()
  const source = lastCycle(sessions)
  if (source.length === 0) return { ok: false, error: 'There is no published cycle to copy yet.' }
  const rows = copyCycle(source).map((s) => ({ class_number: s.classNumber, topic_override: s.topicOverride, starts_at: s.startsAt, ends_at: s.endsAt, status: 'draft' }))
  const { error } = await createServiceClient().from('live_class_sessions').insert(rows)
  if (error) return { ok: false, error: 'Could not copy the cycle.' }
  return { ok: true, message: `${rows.length} draft sessions added, four weeks after the last cycle. Check the dates, then publish.` }
}

/** Publishes every draft at once (after the trainer has adjusted the dates). */
export async function publishDrafts(): Promise<Result> {
  if (!(await guard())) return { ok: false, error: 'Not authorized.' }
  const { error } = await createServiceClient().from('live_class_sessions').update({ status: 'published' }).eq('status', 'draft')
  if (error) return { ok: false, error: 'Could not publish.' }
  return { ok: true }
}

/** After class: everyone registered (and not cancelled) is marked present. */
export async function markAllRegisteredPresent(input: unknown): Promise<Result> {
  const admin = await guard()
  if (!admin) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ sessionId: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid session.' }
  const db = createServiceClient()
  const [{ data: session }, { data: regs }, { data: existing }] = await Promise.all([
    db.from('live_class_sessions').select('class_number').eq('id', parsed.data.sessionId).maybeSingle(),
    db.from('live_class_registrations').select('user_id').eq('session_id', parsed.data.sessionId).is('cancelled_at', null),
    db.from('live_class_attendance').select('user_id').eq('session_id', parsed.data.sessionId).eq('kind', 'live'),
  ])
  if (!session) return { ok: false, error: 'Session not found.' }
  const already = new Set((existing ?? []).map((e) => e.user_id))
  const rows = (regs ?? []).filter((r) => !already.has(r.user_id)).map((r) => ({ user_id: r.user_id, class_number: session.class_number, session_id: parsed.data.sessionId, kind: 'live', counts: true, marked_by: admin }))
  if (rows.length > 0) {
    const { error } = await db.from('live_class_attendance').insert(rows)
    if (error) return { ok: false, error: 'Could not mark attendance.' }
  }
  return { ok: true, message: `${rows.length} marked present.` }
}

/** Present / absent for one learner at one live session. */
export async function setPresent(input: unknown): Promise<Result> {
  const admin = await guard()
  if (!admin) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ sessionId: z.string().uuid(), userId: z.string().uuid(), present: z.boolean() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request.' }
  const db = createServiceClient()
  const { sessionId, userId, present } = parsed.data
  if (present) {
    const { data: session } = await db.from('live_class_sessions').select('class_number').eq('id', sessionId).maybeSingle()
    if (!session) return { ok: false, error: 'Session not found.' }
    const { data: existing } = await db.from('live_class_attendance').select('id').eq('session_id', sessionId).eq('user_id', userId).eq('kind', 'live').maybeSingle()
    if (!existing) {
      const { error } = await db.from('live_class_attendance').insert({ user_id: userId, class_number: session.class_number, session_id: sessionId, kind: 'live', counts: true, marked_by: admin })
      if (error) return { ok: false, error: 'Could not mark attendance.' }
    }
  } else {
    const { error } = await db.from('live_class_attendance').delete().eq('session_id', sessionId).eq('user_id', userId).eq('kind', 'live')
    if (error) return { ok: false, error: 'Could not update attendance.' }
  }
  return { ok: true }
}

/** Adds any learner to a session by email (registered + present), e.g. a manual grant who joined without registering. */
export async function addLearnerToSession(input: unknown): Promise<Result> {
  const admin = await guard()
  if (!admin) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ sessionId: z.string().uuid(), email: z.string().trim().email() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Please enter a valid email.' }
  const userId = await userIdByEmail(parsed.data.email)
  if (userId === null) return { ok: false, error: 'No learner with this email has signed up yet.' }
  const { error } = await createServiceClient()
    .from('live_class_registrations')
    .upsert({ session_id: parsed.data.sessionId, user_id: userId, cancelled_at: null }, { onConflict: 'session_id,user_id' })
  if (error) return { ok: false, error: 'Could not add the learner.' }
  return setPresent({ sessionId: parsed.data.sessionId, userId, present: true })
}

/** "Watched recording" for a class number; counts only when the trainer ticks it. watched=false removes it. */
export async function setRecording(input: unknown): Promise<Result> {
  const admin = await guard()
  if (!admin) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ userId: z.string().uuid(), classNumber: z.number().int().min(1).max(7), watched: z.boolean(), counts: z.boolean() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request.' }
  const db = createServiceClient()
  const { userId, classNumber, watched, counts } = parsed.data
  await db.from('live_class_attendance').delete().eq('user_id', userId).eq('class_number', classNumber).eq('kind', 'recording')
  if (watched) {
    const { error } = await db.from('live_class_attendance').insert({ user_id: userId, class_number: classNumber, session_id: null, kind: 'recording', counts, marked_by: admin })
    if (error) return { ok: false, error: 'Could not save the recording mark.' }
  }
  return { ok: true }
}

/** Pace control on/off for one learner (reviewers, catching up after illness …). */
export async function setPaceControl(input: unknown): Promise<Result> {
  const admin = await guard()
  if (!admin) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ userId: z.string().uuid(), off: z.boolean(), note: z.string().trim().max(200).optional() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request.' }
  const db = createServiceClient()
  const { userId, off, note } = parsed.data
  const { error } = off
    ? await db.from('curriculum_pace_settings').upsert({ user_id: userId, pace_off: true, note: note || null, set_by: admin, set_at: new Date().toISOString() }, { onConflict: 'user_id' })
    : await db.from('curriculum_pace_settings').delete().eq('user_id', userId)
  if (error) return { ok: false, error: 'Could not change pace control.' }
  return { ok: true, message: off ? 'Pace control turned off for this learner.' : 'Pace control turned back on.' }
}
