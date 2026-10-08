// Pure rules of the live-class cycle (Phase 3, item 3) and the refund
// guarantee checks shown to the trainer. No guarantee wording reaches learners.

export const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6, 7] as const
export type ClassNumber = (typeof CLASS_NUMBERS)[number]
export const TOTAL_CLASSES = 7
export const TOTAL_DAYS = 30
/** A refund must be claimed within this many days after completing Day 30. */
export const CLAIM_WINDOW_DAYS = 7

/** Default class time: 7:00–9:00 pm IST. */
export const DEFAULT_START_IST = '19:00'
export const DEFAULT_END_IST = '21:00'

/** The fixed English topic per class number (the app shows translated names). */
export const CLASS_TOPICS_EN: Record<ClassNumber, string> = {
  1: 'Foundation',
  2: 'Eye & Focus Training',
  3: 'Inner Voice Control',
  4: 'Memory Systems',
  5: 'Visualization & Mental Mastery',
  6: 'Study & Work Application',
  7: 'Peak Performance',
}

export function isClassNumber(n: number): n is ClassNumber {
  return Number.isInteger(n) && n >= 1 && n <= 7
}

export type Session = { id: string; classNumber: number; topicOverride: string | null; startsAt: string; endsAt: string; status: 'draft' | 'published' | 'cancelled' }
export type AttendanceMark = { classNumber: number; kind: 'live' | 'recording'; counts: boolean }

/** Class numbers that count: present at a live session, or a recording the trainer approved. */
export function classesDone(marks: readonly AttendanceMark[]): Set<number> {
  return new Set(marks.filter((m) => m.counts).map((m) => m.classNumber))
}

/** Registration is open until the class starts, for published sessions only. */
export function canRegister(session: Pick<Session, 'status' | 'startsAt'>, now: number): boolean {
  return session.status === 'published' && Date.parse(session.startsAt) > now
}

/** Published sessions that haven't ended, soonest first. Cancelled ones stay visible (marked) until they would have ended. */
export function upcomingSessions<S extends Pick<Session, 'status' | 'endsAt' | 'startsAt'>>(sessions: readonly S[], now: number): S[] {
  return sessions.filter((s) => s.status !== 'draft' && Date.parse(s.endsAt) > now).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
}

/** The next published session of a class number, or null ("date to be announced"). */
export function nextSessionFor<S extends Pick<Session, 'classNumber' | 'status' | 'startsAt'>>(classNumber: number, sessions: readonly S[], now: number): S | null {
  return sessions.filter((s) => s.classNumber === classNumber && canRegister(s, now)).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0] ?? null
}

const IST = 'Asia/Kolkata'

/** "Thu, 29 Oct" in the learner's language, 0–9 digits, India time. */
export function formatSessionDate(iso: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST }).format(new Date(iso))
}

/** "7:00 pm" in the learner's language, India time. */
export function formatSessionTime(iso: string, htmlLang: string): string {
  return new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: IST }).format(new Date(iso))
}

/** An IST wall-clock date + time ("2026-10-18", "19:00") as an ISO instant. */
export function istToIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00+05:30`).toISOString()
}

/** The IST calendar date and time of an instant, for the admin form. */
export function isoToIst(iso: string): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso))
  const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? ''
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` }
}

/** "Copy last cycle": the same 7 sessions, 28 days later, as drafts for the trainer to adjust. */
export function copyCycle(last: readonly Pick<Session, 'classNumber' | 'topicOverride' | 'startsAt' | 'endsAt'>[], shiftDays = 28): Pick<Session, 'classNumber' | 'topicOverride' | 'startsAt' | 'endsAt'>[] {
  const shift = shiftDays * 86_400_000
  return [...last]
    .sort((a, b) => a.classNumber - b.classNumber)
    .map((s) => ({ classNumber: s.classNumber, topicOverride: s.topicOverride, startsAt: new Date(Date.parse(s.startsAt) + shift).toISOString(), endsAt: new Date(Date.parse(s.endsAt) + shift).toISOString() }))
}

/** The most recent cycle: for each class number, its latest published session. */
export function lastCycle<S extends Pick<Session, 'classNumber' | 'startsAt' | 'status'>>(sessions: readonly S[]): S[] {
  const latest = new Map<number, S>()
  for (const s of sessions) {
    if (s.status !== 'published') continue
    const current = latest.get(s.classNumber)
    if (!current || Date.parse(s.startsAt) > Date.parse(current.startsAt)) latest.set(s.classNumber, s)
  }
  return CLASS_NUMBERS.map((n) => latest.get(n)).filter((s): s is S => s !== undefined)
}

/** Fills {name} placeholders. */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))
}

// ── Refund guarantee (admin only) ─────────────────────────────────────────

export type GuaranteeReading = { kind: 'baseline' | 'checkpoint' | 'final'; effectiveWpm: number; comprehensionPercent: number }

export type GuaranteeCheck = {
  allDays: boolean
  allClasses: boolean
  bothTests: boolean
  /** Day 30 completion + 7 days; null before Day 30. */
  claimWindow: { closesAt: string; open: boolean } | null
  /** Rule 5: Day 30 shows no improvement in BOTH effective speed and retention; null without both tests. */
  noImprovement: boolean | null
  /** Day 7/14/21 showed improvement but Day 30 shows none: worth a re-test before a refund. */
  checkBeforeRefund: boolean
  /** Every condition met: a refund claim would qualify. */
  qualifies: boolean
}

/**
 * Retention for rule 5 = comprehension in the fair reading test: what the
 * learner recalls about the passage with the passage hidden. It is the only
 * recall measure taken on both Day 1 and Day 30.
 */
export function evaluateGuarantee(input: {
  daysCompleted: number
  day30CompletedAt: string | null
  classesCounted: number
  readings: readonly GuaranteeReading[]
  now: number
}): GuaranteeCheck {
  const baseline = input.readings.find((r) => r.kind === 'baseline') ?? null
  const final = [...input.readings].reverse().find((r) => r.kind === 'final') ?? null
  const allDays = input.daysCompleted >= TOTAL_DAYS
  const allClasses = input.classesCounted >= TOTAL_CLASSES
  const bothTests = baseline !== null && final !== null
  const claimWindow =
    input.day30CompletedAt === null
      ? null
      : (() => {
          const closesAt = new Date(Date.parse(input.day30CompletedAt) + CLAIM_WINDOW_DAYS * 86_400_000).toISOString()
          return { closesAt, open: input.now <= Date.parse(closesAt) }
        })()
  const noImprovement = baseline !== null && final !== null ? final.effectiveWpm <= baseline.effectiveWpm && final.comprehensionPercent <= baseline.comprehensionPercent : null
  const improvedAtCheckpoint = baseline !== null && input.readings.some((r) => r.kind === 'checkpoint' && r.effectiveWpm > baseline.effectiveWpm)
  return {
    allDays,
    allClasses,
    bothTests,
    claimWindow,
    noImprovement,
    checkBeforeRefund: noImprovement === true && improvedAtCheckpoint,
    qualifies: allDays && allClasses && bothTests && claimWindow?.open === true && noImprovement === true,
  }
}

/** One CSV cell: quoted when needed; formula-looking text is neutralised for Excel. */
export function csvCell(value: string | number | boolean | null): string {
  if (value === null) return ''
  let text = String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** A CSV document Excel opens with every script intact (UTF-8 with BOM, CRLF). */
export function toCsv(rows: readonly (readonly (string | number | boolean | null)[])[]): string {
  return '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n'
}
