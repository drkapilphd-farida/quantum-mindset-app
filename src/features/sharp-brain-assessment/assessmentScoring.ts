// Day 1 / Day 30 assessment scoring (Phase 8, Item 11). Pure functions,
// used by the browser (to run the task) and by the server action (which
// recomputes every number from the raw answers and timings, so a score is
// never taken from the client as-is).

// ── Reading ────────────────────────────────────────────────────────────

/** Plausible range for a self-paced read; outside it the timing is treated as a mistake. */
export const MIN_PLAUSIBLE_WPM = 40
export const MAX_PLAUSIBLE_WPM = 1200

export function computeWpm(wordCount: number, readingMs: number): number {
  if (readingMs <= 0) return 0
  return Math.round(wordCount / (readingMs / 60_000))
}

export function isPlausibleWpm(wpm: number): boolean {
  return wpm >= MIN_PLAUSIBLE_WPM && wpm <= MAX_PLAUSIBLE_WPM
}

export function scoreComprehension(answers: readonly number[], correctIndexes: readonly number[]): { correct: number; total: number; percent: number } {
  const total = correctIndexes.length
  const correct = correctIndexes.filter((correctIndex, i) => answers[i] === correctIndex).length
  return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100) }
}

/** Effective reading speed: speed counted only as far as it was understood. */
export function computeEffectiveWpm(wpm: number, comprehensionPercent: number): number {
  return Math.round((wpm * comprehensionPercent) / 100)
}

// ── Attention (go / no-go) ─────────────────────────────────────────────

export const ATTENTION_TRIALS = 60
export const ATTENTION_NO_GO_TRIALS = 15
export const ATTENTION_STIMULUS_MS = 700
/** Responses are accepted until this long after the shape appears. */
export const ATTENTION_RESPONSE_WINDOW_MS = 1000
export const ATTENTION_MIN_GAP_MS = 600
export const ATTENTION_MAX_GAP_MS = 1000
/** Faster than this is an anticipation, not a reaction — excluded from the average. */
export const ATTENTION_ANTICIPATION_MS = 150

export type AttentionTrial = { go: boolean; responded: boolean; rtMs: number | null }

/** Small deterministic PRNG so a sequence can be reproduced in tests. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

/** 60 trials (45 go, 15 no-go), shuffled, never starting with a no-go and never two no-go in a row. */
export function generateAttentionSequence(seed: number, trials = ATTENTION_TRIALS, noGo = ATTENTION_NO_GO_TRIALS): { go: boolean; gapMs: number }[] {
  const random = mulberry32(seed)
  const goCount = trials - noGo
  // Place each no-go in its own gap between go trials (no two in a row, never first).
  const slots = Array.from({ length: goCount }, (_, i) => i + 1) // after go #i
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const tmp = slots[i] as number
    slots[i] = slots[j] as number
    slots[j] = tmp
  }
  const noGoAfter = new Set(slots.slice(0, noGo))
  const sequence: boolean[] = []
  for (let i = 1; i <= goCount; i++) {
    sequence.push(true)
    if (noGoAfter.has(i)) sequence.push(false)
  }
  return sequence.map((go) => ({ go, gapMs: ATTENTION_MIN_GAP_MS + Math.round(random() * (ATTENTION_MAX_GAP_MS - ATTENTION_MIN_GAP_MS)) }))
}

export type AttentionSummary = { accuracyPercent: number; meanRtMs: number | null; trials: number }

/**
 * Accuracy = correct trials (tapped on go, held back on no-go) ÷ all trials.
 * Mean reaction time = average of correct go taps, excluding anticipations.
 */
export function summarizeAttention(trials: readonly AttentionTrial[]): AttentionSummary {
  if (trials.length === 0) return { accuracyPercent: 0, meanRtMs: null, trials: 0 }
  let correct = 0
  const rts: number[] = []
  for (const trial of trials) {
    if (trial.go && trial.responded) {
      correct++
      if (trial.rtMs !== null && trial.rtMs >= ATTENTION_ANTICIPATION_MS) rts.push(trial.rtMs)
    } else if (!trial.go && !trial.responded) {
      correct++
    }
  }
  const meanRtMs = rts.length === 0 ? null : Math.round(rts.reduce((sum, rt) => sum + rt, 0) / rts.length)
  return { accuracyPercent: Math.round((correct / trials.length) * 100), meanRtMs, trials: trials.length }
}

// ── Day 30 window ──────────────────────────────────────────────────────

const DAY_MS = 86_400_000
const IST_OFFSET_MS = 5.5 * 3_600_000

/** Calendar day in India (IST) as a day number, so "day 28" doesn't depend on the device timezone. */
function istDayNumber(date: Date): number {
  return Math.floor((date.getTime() + IST_OFFSET_MS) / DAY_MS)
}

export type DayThirtyWindow =
  | { status: 'no-baseline' }
  | { status: 'locked'; programDay: number; unlocksOn: Date }
  | { status: 'open'; programDay: number }
  | { status: 'late'; programDay: number }

/**
 * Day 1 = the day of the self-paced Day 1 assessment. The Day 30 re-test
 * opens on program day 28, or as soon as curriculum Day 29 is completed
 * after that baseline — whichever comes first. After day 35 it stays open
 * but is labelled a late re-test.
 */
export function getDayThirtyWindow(baselineAt: Date | null, day29CompletedAt: Date | null, now: Date): DayThirtyWindow {
  if (baselineAt === null) return { status: 'no-baseline' }
  const programDay = istDayNumber(now) - istDayNumber(baselineAt) + 1
  const day29AfterBaseline = day29CompletedAt !== null && day29CompletedAt.getTime() >= baselineAt.getTime()
  if (programDay > 35) return { status: 'late', programDay }
  if (programDay >= 28 || day29AfterBaseline) return { status: 'open', programDay }
  const unlocksOn = new Date((istDayNumber(baselineAt) + 27) * DAY_MS - IST_OFFSET_MS)
  return { status: 'locked', programDay, unlocksOn }
}
