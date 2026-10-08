import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { classesDone, evaluateGuarantee, type AttendanceMark, type GuaranteeCheck, type Session } from '../liveClasses'

// Server-side reads for the trainer's admin pages (service role, after the
// admin check). Never imported by learner pages.

export async function currentAdminEmail(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? []
  return user?.email && adminEmails.includes(user.email) ? user.email : null
}

type SessionRow = { id: string; class_number: number; topic_override: string | null; starts_at: string; ends_at: string; status: string }
const toSession = (r: SessionRow): Session => ({ id: r.id, classNumber: r.class_number, topicOverride: r.topic_override, startsAt: r.starts_at, endsAt: r.ends_at, status: r.status as Session['status'] })

export type AdminSession = Session & { registered: number; present: number }

export async function listSessions(): Promise<AdminSession[]> {
  const db = createServiceClient()
  const [{ data: sessions }, { data: regs }, { data: marks }] = await Promise.all([
    db.from('live_class_sessions').select('id, class_number, topic_override, starts_at, ends_at, status').order('starts_at'),
    db.from('live_class_registrations').select('session_id').is('cancelled_at', null),
    db.from('live_class_attendance').select('session_id').eq('kind', 'live'),
  ])
  const count = (rows: { session_id: string | null }[] | null, id: string): number => (rows ?? []).filter((r) => r.session_id === id).length
  return (sessions ?? []).map((s) => ({ ...toSession(s), registered: count(regs, s.id), present: count(marks, s.id) }))
}

export type Person = { userId: string; name: string; email: string; phone: string | null }

async function people(userIds: readonly string[]): Promise<Map<string, Person>> {
  const map = new Map<string, Person>()
  if (userIds.length === 0) return map
  const { data } = await createServiceClient().from('profiles').select('id, full_name, email, phone').in('id', [...userIds])
  for (const p of data ?? []) map.set(p.id, { userId: p.id, name: p.full_name?.trim() || '', email: p.email ?? '', phone: p.phone })
  for (const id of userIds) if (!map.has(id)) map.set(id, { userId: id, name: '', email: '', phone: null })
  return map
}

export type SessionDetail = {
  session: Session
  attendees: (Person & { registered: boolean; cancelled: boolean; present: boolean })[]
}

export async function getSessionDetail(sessionId: string): Promise<SessionDetail | null> {
  const db = createServiceClient()
  const [{ data: session }, { data: regs }, { data: marks }] = await Promise.all([
    db.from('live_class_sessions').select('id, class_number, topic_override, starts_at, ends_at, status').eq('id', sessionId).maybeSingle(),
    db.from('live_class_registrations').select('user_id, cancelled_at').eq('session_id', sessionId),
    db.from('live_class_attendance').select('user_id').eq('session_id', sessionId).eq('kind', 'live'),
  ])
  if (!session) return null
  const ids = [...new Set([...(regs ?? []).map((r) => r.user_id), ...(marks ?? []).map((m) => m.user_id)])]
  const who = await people(ids)
  const presentIds = new Set((marks ?? []).map((m) => m.user_id))
  return {
    session: toSession(session),
    attendees: ids
      .map((id) => {
        const reg = (regs ?? []).find((r) => r.user_id === id)
        return { ...who.get(id)!, registered: reg !== undefined && reg.cancelled_at === null, cancelled: reg?.cancelled_at != null, present: presentIds.has(id) }
      })
      .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
  }
}

export type LearnerRow = Person & {
  batch: string | null
  classes: number[]
  recordings: { classNumber: number; counts: boolean }[]
  daysCompleted: number
  day30At: string | null
  day1: { effective: number; comprehension: number; lang: string } | null
  day30: { effective: number; comprehension: number; lang: string } | null
  certificateCode: string | null
  guarantee: GuaranteeCheck
  /** Pace control turned off by the trainer, with the note (null = pace control on). */
  paceOff: { note: string | null } | null
}

/** One row per learner who has started anything: practice, a test, a class, or a payment. */
export async function getLearnerOverview(now: number = Date.now()): Promise<LearnerRow[]> {
  const db = createServiceClient()
  const [days, tests, marks, regs, pays, certs] = await Promise.all([
    db.from('curriculum_day_completions').select('user_id, day, completed_at'),
    db.from('reading_tests').select('user_id, kind, lang, effective_wpm, comprehension_percent, created_at').order('created_at'),
    db.from('live_class_attendance').select('user_id, class_number, kind, counts'),
    db.from('live_class_registrations').select('user_id'),
    db.from('masterclass_payments').select('user_id, batch_start, created_at').not('user_id', 'is', null).order('created_at'),
    db.from('program_certificates').select('user_id, code').is('revoked_at', null),
  ])
  const { data: paceSettings } = await db.from('curriculum_pace_settings').select('user_id, pace_off, note')
  const ids = [
    ...new Set([
      ...(days.data ?? []).map((r) => r.user_id),
      ...(tests.data ?? []).map((r) => r.user_id),
      ...(marks.data ?? []).map((r) => r.user_id),
      ...(regs.data ?? []).map((r) => r.user_id),
      ...(pays.data ?? []).map((r) => r.user_id as string),
    ]),
  ]
  const who = await people(ids)

  return ids
    .map((id): LearnerRow => {
      const myDays = (days.data ?? []).filter((d) => d.user_id === id)
      const myTests = (tests.data ?? []).filter((r) => r.user_id === id)
      const myMarks: AttendanceMark[] = (marks.data ?? []).filter((m) => m.user_id === id).map((m) => ({ classNumber: m.class_number, kind: m.kind as AttendanceMark['kind'], counts: m.counts }))
      const baseline = myTests.find((r) => r.kind === 'baseline') ?? null
      const final = [...myTests].reverse().find((r) => r.kind === 'final') ?? null
      const day30At = myDays.find((d) => d.day === 30)?.completed_at ?? null
      const done = classesDone(myMarks)
      const daysCompleted = new Set(myDays.map((d) => d.day)).size
      return {
        ...who.get(id)!,
        batch: [...(pays.data ?? [])].reverse().find((p) => p.user_id === id && p.batch_start)?.batch_start ?? null,
        classes: [...done].sort((a, b) => a - b),
        recordings: myMarks.filter((m) => m.kind === 'recording').map((m) => ({ classNumber: m.classNumber, counts: m.counts })),
        daysCompleted,
        day30At,
        day1: baseline ? { effective: baseline.effective_wpm, comprehension: baseline.comprehension_percent, lang: baseline.lang } : null,
        day30: final ? { effective: final.effective_wpm, comprehension: final.comprehension_percent, lang: final.lang } : null,
        certificateCode: (certs.data ?? []).find((c) => c.user_id === id)?.code ?? null,
        paceOff: ((setting) => (setting?.pace_off ? { note: setting.note } : null))((paceSettings ?? []).find((p) => p.user_id === id)),
        guarantee: evaluateGuarantee({
          daysCompleted,
          day30CompletedAt: day30At,
          classesCounted: done.size,
          readings: myTests.map((r) => ({ kind: r.kind as 'baseline' | 'checkpoint' | 'final', effectiveWpm: r.effective_wpm, comprehensionPercent: r.comprehension_percent })),
          now,
        }),
      }
    })
    .sort((a, b) => b.daysCompleted - a.daysCompleted || (a.name || a.email).localeCompare(b.name || b.email))
}

/** A learner's user id from their email (for "add learner by email"). */
export async function userIdByEmail(email: string): Promise<string | null> {
  const { data } = await createServiceClient().from('profiles').select('id').ilike('email', email.trim()).maybeSingle()
  return data?.id ?? null
}
