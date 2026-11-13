'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { recordingStates, type ClassRecording, type ClassRecordingState } from './rules'

// Class Recordings for learners. class_recordings is service-role only: it is
// read here ONLY after the shared access check (getIsPaidUser, via
// hasQuantumSpeedReadingProAccess) — live and self-paced learners alike.
// Without access nothing about the recordings (not even the video ids)
// leaves the server.

export type RecordingsView = { access: false } | { access: true; classes: ClassRecordingState[]; watched: number[] }

type RecordingRow = { id: string; class_number: number; title: string; class_date: string; youtube_id: string; sort_order: number; hidden: boolean }
function toRecording(r: RecordingRow): ClassRecording {
  return { id: r.id, classNumber: r.class_number, title: r.title, classDate: r.class_date, youtubeId: r.youtube_id, sortOrder: r.sort_order, hidden: r.hidden }
}

export async function getRecordingsView(): Promise<RecordingsView> {
  if (!(await hasQuantumSpeedReadingProAccess())) return { access: false }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const now = Date.now()
  const [recordings, ended, marks] = await Promise.all([
    createServiceClient().from('class_recordings').select('id, class_number, title, class_date, youtube_id, sort_order, hidden').eq('hidden', false),
    supabase.from('live_class_sessions').select('class_number, ends_at').eq('status', 'published').lte('ends_at', new Date(now).toISOString()),
    user ? supabase.from('live_class_attendance').select('class_number').eq('user_id', user.id).eq('kind', 'recording').eq('counts', true) : Promise.resolve({ data: [] as { class_number: number }[] }),
  ])
  if (recordings.error) logger.error('getRecordingsView: recordings read failed', { code: recordings.error.code })
  const list = (recordings.data ?? []).map(toRecording)
  return {
    access: true,
    classes: recordingStates(list, (ended.data ?? []).map((s) => ({ classNumber: s.class_number, endsAt: s.ends_at })), now),
    watched: [...new Set((marks.data ?? []).map((m) => m.class_number))],
  }
}

type WatchedResult = { ok: true } | { ok: false; error: 'unauthenticated' | 'not-enrolled' | 'invalid' | 'db' }

/**
 * "Mark as watched": the class counts as done (the guarantee rule: 7 classes,
 * live or recording) — saved as a recording attendance mark for this learner.
 */
export async function markRecordingWatched(input: unknown): Promise<WatchedResult> {
  const parsed = z.object({ recordingId: z.string().uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }
  if (!(await hasQuantumSpeedReadingProAccess())) return { ok: false, error: 'not-enrolled' }

  const db = createServiceClient()
  const { data: recording } = await db.from('class_recordings').select('class_number, hidden').eq('id', parsed.data.recordingId).maybeSingle()
  if (!recording || recording.hidden) return { ok: false, error: 'invalid' }

  // One recording mark per learner per class (partial unique index): update it, else add it.
  const { data: existing } = await db.from('live_class_attendance').select('id, counts').eq('user_id', user.id).eq('class_number', recording.class_number).eq('kind', 'recording').maybeSingle()
  const { error } = existing
    ? existing.counts
      ? { error: null }
      : await db.from('live_class_attendance').update({ counts: true, marked_by: 'learner: watched recording', marked_at: new Date().toISOString() }).eq('id', existing.id)
    : await db.from('live_class_attendance').insert({ user_id: user.id, class_number: recording.class_number, kind: 'recording', counts: true, marked_by: 'learner: watched recording' })
  if (error && error.code !== '23505') {
    logger.error('markRecordingWatched: save failed', { code: error.code })
    return { ok: false, error: 'db' }
  }
  return { ok: true }
}
