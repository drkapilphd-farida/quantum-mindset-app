// Admin "Transfer progress" (founder, 9 Nov 2026): pure helpers, unit-tested.

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}

export type AccessSummary = { kind: 'lifetime' } | { kind: 'until'; endsAt: string } | { kind: 'none' }

type SubRow = { status: string; current_period_end: string | null; billing_interval: string | null }

/** The learner's current access, the same way getIsPaidUser decides it. */
export function accessOf(rows: readonly SubRow[], nowMs: number): AccessSummary {
  const live = rows.filter((r) => ['active', 'trialing'].includes(r.status))
  if (live.some((r) => r.billing_interval !== 'month' || r.current_period_end === null)) return { kind: 'lifetime' }
  const ends = live.map((r) => r.current_period_end!).filter((e) => Date.parse(e) > nowMs).sort()
  const last = ends.at(-1)
  return last === undefined ? { kind: 'none' } : { kind: 'until', endsAt: last }
}

/** "Lifetime", "Until 7 Feb 2027" or "No access" (India time). */
export function accessLabel(a: AccessSummary): string {
  if (a.kind === 'lifetime') return 'Lifetime'
  if (a.kind === 'none') return 'No access'
  return `Until ${new Date(a.endsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`
}

/** What the new account's access becomes: the better of the two. */
export function betterAccess(a: AccessSummary, b: AccessSummary): AccessSummary {
  if (a.kind === 'lifetime' || b.kind === 'lifetime') return { kind: 'lifetime' }
  if (a.kind === 'none') return b
  if (b.kind === 'none') return a
  return Date.parse(a.endsAt) >= Date.parse(b.endsAt) ? a : b
}

/** Finished plan days after the transfer: the union, in order. */
export function mergedDays(a: readonly number[], b: readonly number[]): number[] {
  return [...new Set([...a, ...b])].sort((x, y) => x - y)
}

export const SUMMARY_LABELS: Record<string, string> = {
  plan_days: '30-day plan days',
  plan_activity_days: 'Day steps & practice time',
  reading_tests: 'Reading checkpoints',
  practice_attempts: 'Practice-again results',
  exercise_results: 'Exercise scores',
  practice_sessions: 'Practice history',
  exercise_progress: 'Exercise unlocks',
  certificates_moved: 'Certificate moved',
  access_plans: 'Access',
}
