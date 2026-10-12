// The shared spaced-review schedule (Memory Studio, Release 2).
// A new card is due 1 day after it is added, then 3, 7, 14 and 30 days after
// each "remembered". "Forgot" moves it one step back and brings it back
// tomorrow. After the 30-day step it counts as learned and is no longer due.

export const INTERVAL_DAYS = [1, 3, 7, 14, 30] as const
export const LEARNED_STEP = INTERVAL_DAYS.length // 5
const DAY_MS = 86_400_000

export type ReviewResult = 'remembered' | 'forgot'
export type ReviewState = { step: number; dueAt: string | null }

export function firstDue(now: number): ReviewState {
  return { step: 0, dueAt: new Date(now + INTERVAL_DAYS[0] * DAY_MS).toISOString() }
}

export function afterReview(step: number, result: ReviewResult, now: number): ReviewState {
  const s = Math.min(LEARNED_STEP, Math.max(0, Math.round(step)))
  if (result === 'forgot') return { step: Math.max(0, s - 1), dueAt: new Date(now + DAY_MS).toISOString() }
  const next = Math.min(LEARNED_STEP, s + 1)
  return { step: next, dueAt: next >= LEARNED_STEP ? null : new Date(now + INTERVAL_DAYS[next]! * DAY_MS).toISOString() }
}

/** Rough seconds a card takes: a list grows with its length. */
export function cardSeconds(card: { kind: 'list' | 'peg'; count?: number }): number {
  return card.kind === 'peg' ? 8 : 15 + 3 * (card.count ?? 5)
}

export const SESSION_SECONDS = 5 * 60

/** The due cards for one session (oldest first), kept within about 5 minutes — always at least one. */
export function pickSession<T extends { dueAt: string; seconds: number }>(due: readonly T[], budget: number = SESSION_SECONDS): T[] {
  const sorted = [...due].sort((a, b) => a.dueAt.localeCompare(b.dueAt))
  const out: T[] = []
  let used = 0
  for (const card of sorted) {
    if (out.length > 0 && used + card.seconds > budget) break
    out.push(card)
    used += card.seconds
  }
  return out
}

export function sessionMinutes(cards: readonly { seconds: number }[]): number {
  return Math.max(1, Math.round(cards.reduce((a, c) => a + c.seconds, 0) / 60))
}
