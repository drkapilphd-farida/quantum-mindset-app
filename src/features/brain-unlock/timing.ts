// Brain Unlock timing (founder, 15 Nov 2026: shorter steps; the promise is
// "5 minutes", which matches what real visitors are expected to take).
// Pure — tested in timing.test.ts.

/** Focus exercise: breathe in 4 s, out 6 s, two rounds = 20 s (was three = 30 s). */
export const BREATH_IN_MS = 4000;
export const BREATH_OUT_MS = 6000;
export const FOCUS_ROUNDS = 2;
export const FOCUS_EXERCISE_MS = FOCUS_ROUNDS * (BREATH_IN_MS + BREATH_OUT_MS);

/** RSVP passages are at most this long (passages.ts, tested). */
export const RSVP_MAX_WORDS = 80;

/**
 * Typical seconds one real person spends in each phase (Brain Check, Speed,
 * Memory, Focus): the staging timing run scaled to real visitors' pace (about
 * 5 minutes in all). Used only for the friendly "About 2 minutes left" line.
 */
export const PHASE_SECONDS: readonly [number, number, number, number] = [90, 65, 85, 60];

/** Seconds left at the start of `phase` for `player` (0-based) of `players`. */
export function secondsLeft(phase: number, player: number, players: number): number {
  let left = 0;
  for (let p = phase; p < PHASE_SECONDS.length; p++) {
    const each = PHASE_SECONDS[p] ?? 0;
    left += p === phase ? each * (players - player) : each * players;
  }
  return left;
}

/** How full the time bar is (0–1) at the start of `phase` for `player`. */
export function progressFraction(phase: number, player: number, players: number): number {
  const total = secondsLeft(0, 0, players);
  return total === 0 ? 1 : 1 - secondsLeft(phase, player, players) / total;
}

/** Unlocks finished when `phase` starts (phase 1 = Speed, 2 = Memory, 3 = Focus): the cheer shows for 1 and 2. */
export function cheerCount(phase: number): number | null {
  return phase === 2 || phase === 3 ? phase - 1 : null;
}
