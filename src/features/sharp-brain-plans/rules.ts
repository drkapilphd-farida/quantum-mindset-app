import { SHARP_BRAIN_PRICES } from '@/config/site.config'

// Sharp Brain's two plans — pure rules shared by the webhook, checkout,
// admin and learner pages. Access is the same for both (one shared check,
// getIsPaidUser); the plan only decides what the learner sees.

export const PLAN_TYPES = ['live', 'self_paced'] as const
export type PlanType = (typeof PLAN_TYPES)[number]

export function isPlanType(value: unknown): value is PlanType {
  return value === 'live' || value === 'self_paced'
}

/** Self-paced learners can upgrade to the live batch for this much, within UPGRADE_WINDOW_DAYS of joining. */
export const UPGRADE_PRICE_INR = 6000
export const UPGRADE_WINDOW_DAYS = 7

/**
 * The plan of a program payment: what our server wrote in the link's notes
 * (notes.plan), else the amount — exactly ₹2,999 is self-paced, anything
 * else is the live batch (so every existing payment stays live).
 */
export function planForPayment(amountPaise: number, notesPlan: unknown): PlanType {
  if (isPlanType(notesPlan)) return notesPlan
  return amountPaise === SHARP_BRAIN_PRICES.selfPacedInr * 100 ? 'self_paced' : 'live'
}

export type PlanPaymentRow = { plan_type: string | null; created_at: string; paid_on: string | null; refunded_at: string | null }

export type LearnerPlan = { plan: 'live' } | { plan: 'self_paced'; joinedAtMs: number }

/**
 * A learner's plan from their program payments. Any live payment (including
 * a ₹6,000 upgrade recorded as live) makes them live; only self-paced
 * payments make them self-paced; no payment row (access given another way,
 * e.g. a grant) stays live — exactly what they saw before this change.
 */
export function resolveLearnerPlan(rows: readonly PlanPaymentRow[]): LearnerPlan {
  const active = rows.filter((r) => r.refunded_at === null)
  if (active.length === 0 || active.some((r) => r.plan_type !== 'self_paced')) return { plan: 'live' }
  const joined = Math.min(...active.map((r) => (r.paid_on !== null ? Date.parse(`${r.paid_on}T00:00:00+05:30`) : Date.parse(r.created_at))))
  return { plan: 'self_paced', joinedAtMs: joined }
}

/** The upgrade card shows for UPGRADE_WINDOW_DAYS after a self-paced learner joined, then hides. */
export function upgradeOfferOpen(plan: LearnerPlan, now: number): boolean {
  return plan.plan === 'self_paced' && now < plan.joinedAtMs + UPGRADE_WINDOW_DAYS * 86_400_000
}

/** The last moment of the upgrade window (ms), for a self-paced learner. */
export function upgradeOfferEndsAt(plan: LearnerPlan): number | null {
  return plan.plan === 'self_paced' ? plan.joinedAtMs + UPGRADE_WINDOW_DAYS * 86_400_000 : null
}

// ── YouTube recordings ────────────────────────────────────────────────────

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com', 'youtube-nocookie.com'])

/**
 * The video id of a YouTube link (watch, youtu.be, embed, shorts, live), or
 * null when it is not a YouTube link. Only YouTube hosts are accepted.
 */
export function youtubeIdFromUrl(input: string): string | null {
  const raw = input.trim()
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  const host = url.hostname.toLowerCase()
  if (!YOUTUBE_HOSTS.has(host)) return null
  let id: string | null = null
  if (host === 'youtu.be') id = url.pathname.split('/')[1] ?? null
  else if (url.pathname === '/watch') id = url.searchParams.get('v')
  else {
    const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)
    id = match?.[1] ?? null
  }
  return id !== null && YOUTUBE_ID.test(id) ? id : null
}

/** The privacy-enhanced player URL. The raw YouTube link is never shown on the page. */
export function recordingEmbedUrl(youtubeId: string): string {
  if (!YOUTUBE_ID.test(youtubeId)) throw new Error('invalid YouTube id')
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`
}

export type ClassRecording = { id: string; classNumber: number; title: string; classDate: string; youtubeId: string; sortOrder: number; hidden: boolean }

/** What a learner sees for one class: its recordings, "coming soon" (the live class has ended, no link yet), or "after the class". */
export type ClassRecordingState = { classNumber: number; recordings: ClassRecording[]; state: 'available' | 'coming_soon' | 'after_class' }

export function recordingStates(
  recordings: readonly ClassRecording[],
  endedSessions: readonly { classNumber: number; endsAt: string }[],
  now: number,
  classNumbers: readonly number[] = [1, 2, 3, 4, 5, 6, 7],
): ClassRecordingState[] {
  const visible = recordings.filter((r) => !r.hidden).sort((a, b) => a.sortOrder - b.sortOrder || a.classDate.localeCompare(b.classDate))
  return classNumbers.map((n) => {
    const own = visible.filter((r) => r.classNumber === n)
    if (own.length > 0) return { classNumber: n, recordings: own, state: 'available' }
    const ended = endedSessions.some((s) => s.classNumber === n && Date.parse(s.endsAt) <= now)
    return { classNumber: n, recordings: [], state: ended ? 'coming_soon' : 'after_class' }
  })
}
