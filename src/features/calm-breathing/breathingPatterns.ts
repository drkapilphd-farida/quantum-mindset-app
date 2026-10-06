// Calm Breathing — paced breathing with a longer out-breath (e.g. 4 s in,
// 6 s out). Level 1 starts short and easy (3 s in / 4 s out); higher levels
// slow the rhythm down towards about 5 breaths a minute and add a short,
// gentle pause. No hold is ever longer than 2 seconds.

export type BreathPattern = { inMs: number; holdMs: number; outMs: number; breathsPerRound: number }

export const BREATH_PATTERNS: Readonly<Record<number, BreathPattern>> = {
  1: { inMs: 3000, holdMs: 0, outMs: 4000, breathsPerRound: 4 },
  2: { inMs: 4000, holdMs: 0, outMs: 4000, breathsPerRound: 4 },
  3: { inMs: 4000, holdMs: 0, outMs: 5000, breathsPerRound: 4 },
  4: { inMs: 4000, holdMs: 0, outMs: 6000, breathsPerRound: 4 },
  5: { inMs: 4000, holdMs: 0, outMs: 6000, breathsPerRound: 5 },
  6: { inMs: 4000, holdMs: 1000, outMs: 6000, breathsPerRound: 5 },
  7: { inMs: 5000, holdMs: 0, outMs: 6000, breathsPerRound: 5 },
  8: { inMs: 5000, holdMs: 0, outMs: 7000, breathsPerRound: 5 },
  9: { inMs: 5000, holdMs: 1000, outMs: 7000, breathsPerRound: 5 },
  10: { inMs: 5000, holdMs: 2000, outMs: 7000, breathsPerRound: 5 },
}

export function breathPattern(level: number): BreathPattern {
  return BREATH_PATTERNS[Math.min(10, Math.max(1, Math.round(level)))] ?? BREATH_PATTERNS[1]!
}

export const ROUNDS_PER_SESSION = 3
export const PRACTICE_BREATHS = 2
/** Ignore the first moment of each phase — nobody switches exactly on the beat. */
export const PHASE_GRACE_MS = 700
/** A breath counts as "in rhythm" when the finger matched the circle this much of the time. */
export const IN_RHYTHM_SYNC = 0.7

export type BreathSample = { expectPressed: boolean; pressed: boolean; msIntoPhase: number }

/** Share (0–1) of a breath's samples where the finger matched the circle, ignoring each phase's first moment. */
export function breathSync(samples: readonly BreathSample[]): number {
  const counted = samples.filter((s) => s.msIntoPhase >= PHASE_GRACE_MS)
  if (counted.length === 0) return 0
  return counted.filter((s) => s.expectPressed === s.pressed).length / counted.length
}

export function breathsPerMinute(pattern: BreathPattern): number {
  return Math.round((60_000 / (pattern.inMs + pattern.holdMs + pattern.outMs)) * 10) / 10
}
