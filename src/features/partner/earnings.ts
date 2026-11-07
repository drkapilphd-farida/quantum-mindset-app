import { PARTNER_PROGRAM } from '@/config/partnerProgram'

// /partner earnings calculator and lead tag — plain functions, unit-tested.

export type LiveTeacher = 'drKapil' | 'self'

export type Earnings = {
  fromSelf: number
  fromLive: number
  monthly: number
  yearly: number
  /** Months to earn back the partner fee; null when no students are chosen. */
  recoverMonths: number | null
}

export function livePerStudent(teacher: LiveTeacher): number {
  return teacher === 'drKapil' ? PARTNER_PROGRAM.perStudent.liveDrKapil : PARTNER_PROGRAM.perStudent.liveSelf
}

export function partnerEarnings(selfStudents: number, liveStudents: number, teacher: LiveTeacher): Earnings {
  const fromSelf = selfStudents * PARTNER_PROGRAM.perStudent.self
  const fromLive = liveStudents * livePerStudent(teacher)
  const monthly = fromSelf + fromLive
  return {
    fromSelf,
    fromLive,
    monthly,
    yearly: monthly * 12,
    recoverMonths: monthly > 0 ? Math.ceil(PARTNER_PROGRAM.feeInr / monthly) : null,
  }
}

/** ₹1,23,456 — Indian digit grouping. */
export function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

/** "about 4 months" · "about 1 month" · "Choose students". */
export function recoverText(months: number | null): string {
  if (months === null) return 'Choose students'
  return months <= 1 ? 'about 1 month' : `about ${months} months`
}

// ── Apply form answers ────────────────────────────────────────────────

export const OCCUPATIONS = ['Teacher / Tuition', 'Coaching / School', 'Homemaker', 'Salaried work', 'Own business', 'Other'] as const
export const CONTACT_OPTIONS = ['Yes, I have my own students', 'I know people in my society/school', 'Not yet'] as const
export const INVEST_OPTIONS = ['Yes, now', 'In 1 month', 'I need EMI', 'Not now'] as const
export const START_OPTIONS = ['This month', 'In 1–2 months', 'Just want information for now'] as const

export type ContactAnswer = (typeof CONTACT_OPTIONS)[number]
export type InvestAnswer = (typeof INVEST_OPTIONS)[number]
export type LeadTag = 'A' | 'B' | 'C'

/**
 * A: ready to invest now or with EMI, and already in touch with children/parents.
 * B: ready in 1 month. C: everything else.
 */
export function leadTag(contact: ContactAnswer, invest: InvestAnswer): LeadTag {
  if ((invest === 'Yes, now' || invest === 'I need EMI') && contact !== 'Not yet') return 'A'
  if (invest === 'In 1 month') return 'B'
  return 'C'
}

export { normalizeIndianMobile } from '@/lib/phone/indianMobile'
