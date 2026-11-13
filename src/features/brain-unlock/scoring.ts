import type { BrainTypeId, BuScoring } from "./settings";

// Brain Unlock scoring (founder spec, 13 Nov 2026). Pure — shared by the
// browser (instant reveal cards) and the server (which recomputes every
// number from the raw inputs before a lead is saved). Real numbers only:
// an "after" that isn't better is reported as it is, never adjusted.

export const MIN_WPM = 0;
export const MAX_WPM = 1500;
export const PACER_MIN_WPM = 200;
export const PACER_MAX_WPM = 450;
export const PACER_MULTIPLIER = 1.6;
export const MEMORY_TOTAL = 5;
export const GRID_SIZE = 16;
/** The sharp-reading speed counts only with at least this share of the questions right. */
export const MIN_COMPREHENSION = 0.5;

export function wpmFrom(wordCount: number, elapsedMs: number): number {
  const minutes = Math.max(elapsedMs, 1) / 60_000;
  return Math.min(MAX_WPM, Math.max(MIN_WPM, Math.round(wordCount / minutes)));
}

/** The pacer's first speed: 1.6 × the reader's own baseline, between 200 and 450 WPM. */
export function pacerStartWpm(baselineWpm: number): number {
  return Math.min(
    PACER_MAX_WPM,
    Math.max(
      PACER_MIN_WPM,
      Math.round((baselineWpm * PACER_MULTIPLIER) / 10) * 10,
    ),
  );
}

export type SpeedBefore = { wpm: number; correct: number; total: number };
export type SpeedAfter = { wpm: number; correct: number; total: number };

/** True when the sharp-reading speed counts: at least half of its questions answered right. */
export function speedCounted(after: SpeedAfter): boolean {
  return after.total > 0 && after.correct / after.total >= MIN_COMPREHENSION;
}

/** The speed the report uses as "after": the pacer speed when it counts, otherwise the reader's own baseline. */
export function speedAfterWpm(before: SpeedBefore, after: SpeedAfter): number {
  return speedCounted(after) ? after.wpm : before.wpm;
}

export type SpeedOutcome = "improved" | "same_or_lower" | "not_counted";
export function speedOutcome(
  before: SpeedBefore,
  after: SpeedAfter,
): SpeedOutcome {
  if (!speedCounted(after)) return "not_counted";
  return after.wpm > before.wpm ? "improved" : "same_or_lower";
}

/** Brain Check memory: how many of the 5 shown words were picked (any order; only 5 picks allowed). */
export function scorePicked(
  picked: readonly string[],
  targets: readonly string[],
): number {
  const t = new Set(targets);
  return Math.min(MEMORY_TOTAL, new Set(picked.filter((id) => t.has(id))).size);
}

/** Story recall: how many words are in the right place (forward order, or reversed for the bonus). */
export function scoreInOrder(
  given: readonly string[],
  targets: readonly string[],
  backwards = false,
): number {
  const expected = backwards ? [...targets].reverse() : targets;
  return expected.reduce((n, id, i) => n + (given[i] === id ? 1 : 0), 0);
}

export type FocusRun = { ms: number; errors: number };

/** Grid time in seconds (one decimal), the number shown to the user. */
export function focusSeconds(run: FocusRun): number {
  return Math.round(run.ms / 100) / 10;
}

/** At most this many numbers may sit where they were in the "before" grid. */
export const MAX_SAME_POSITIONS = 3;

/** A 1–16 grid order, freshly shuffled; with `avoid` (the "before" grid), a clearly different layout. */
export function shuffledGrid(
  rng: () => number = Math.random,
  avoid?: readonly number[],
): number[] {
  for (;;) {
    const g = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
    for (let i = g.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [g[i], g[j]] = [g[j]!, g[i]!];
    }
    if (avoid === undefined || samePositions(g, avoid) <= MAX_SAME_POSITIONS)
      return g;
  }
}

/** Positions that hold the same number in both grids (for the "different layout" test). */
export function samePositions(
  a: readonly number[],
  b: readonly number[],
): number {
  return a.reduce((n, x, i) => n + (x === b[i] ? 1 : 0), 0);
}

export type PlayerResults = {
  speedBefore: SpeedBefore;
  speedAfter: SpeedAfter;
  memoryBefore: number;
  memoryForward: number;
  memoryBackward: number;
  focusBefore: FocusRun;
  focusAfter: FocusRun;
};

export type ScoreBreakdown = {
  speed: number;
  memory: number;
  focus: number;
  total: number;
};

export function unlockScore(r: PlayerResults, s: BuScoring): ScoreBreakdown {
  const wpm = speedAfterWpm(r.speedBefore, r.speedAfter);
  const speedBand = [...s.speedBands]
    .sort((a, b) => a.minWpm - b.minWpm)
    .filter((b) => wpm >= b.minWpm)
    .pop();
  const speed = speedBand?.points ?? 0;
  const backward =
    r.memoryBackward >= MEMORY_TOTAL
      ? s.backwardFull
      : r.memoryBackward >= 3
        ? s.backwardPartial
        : 0;
  const memory = r.memoryForward * s.memoryPerWord + backward;
  const seconds =
    r.focusAfter.ms / 1000 + r.focusAfter.errors * s.errorPenaltySeconds;
  const focusBand = [...s.focusBands]
    .sort((a, b) => a.maxSeconds - b.maxSeconds)
    .find((b) => seconds <= b.maxSeconds);
  const focus = focusBand?.points ?? s.focusFloor;
  return {
    speed,
    memory,
    focus,
    total: Math.min(100, Math.max(0, speed + memory + focus)),
  };
}

export function scoreBand(
  total: number,
  s: BuScoring,
): { en: string; hi: string } {
  const band = [...s.scoreBands]
    .sort((a, b) => a.min - b.min)
    .filter((b) => total >= b.min)
    .pop();
  return band ?? s.scoreBands[0]!;
}

export type Jumps = { speed: number; memory: number; focus: number };

/** Relative improvement per superpower (0 when it didn't improve or didn't count). */
export function jumps(r: PlayerResults): Jumps {
  const speed =
    speedCounted(r.speedAfter) && r.speedBefore.wpm > 0
      ? Math.max(0, (r.speedAfter.wpm - r.speedBefore.wpm) / r.speedBefore.wpm)
      : 0;
  const memory = Math.max(0, (r.memoryForward - r.memoryBefore) / MEMORY_TOTAL);
  const before = r.focusBefore.ms + r.focusBefore.errors * 1000;
  const after = r.focusAfter.ms + r.focusAfter.errors * 1000;
  const focus = before > 0 ? Math.max(0, (before - after) / before) : 0;
  return { speed: Math.min(speed, 3), memory, focus };
}

// Focus gains are naturally smaller than speed or memory gains (a 30 % faster
// grid is a big jump), so they are weighted 1.5× before the "biggest jump" choice.
const FOCUS_WEIGHT = 1.5;
const SCATTERED_ERRORS = 3;
const SCATTERED_SECONDS = 30;
const SMALL_SPEED_JUMP = 0.25;

/**
 * A fun, positive Brain Type from the score pattern:
 * - Distracted Genius: a real jump in speed or memory, but a scattered grid (3+ wrong taps or 30 s+).
 * - Deep Diver: every reading question right, before and after, while speed rose less than 25 %.
 * - otherwise the biggest jump: speed → Hidden Sprinter, memory → Memory Magician, focus → Laser Mind;
 * - no jump at all: the strongest area (memory → Magician, focus → Laser Mind, reading → Deep Diver).
 */
export function brainType(
  r: PlayerResults,
  score: ScoreBreakdown,
  s: BuScoring,
): BrainTypeId {
  const j = jumps(r);
  const scattered =
    r.focusAfter.errors >= SCATTERED_ERRORS ||
    r.focusAfter.ms / 1000 >= SCATTERED_SECONDS;
  if (scattered && (j.speed > 0.2 || j.memory > 0.2)) return "genius";
  const perfectReading =
    r.speedBefore.correct === r.speedBefore.total &&
    r.speedAfter.correct === r.speedAfter.total;
  if (perfectReading && j.speed < SMALL_SPEED_JUMP && j.memory <= j.speed)
    return "diver";
  const ranked: [BrainTypeId, number][] = [
    ["sprinter", j.speed],
    ["magician", j.memory],
    ["laser", j.focus * FOCUS_WEIGHT],
  ];
  ranked.sort((a, b) => b[1] - a[1]);
  if (ranked[0]![1] > 0) return ranked[0]![0];
  const maxSpeed = Math.max(...s.speedBands.map((b) => b.points), 1);
  const maxMemory = Math.max(
    MEMORY_TOTAL * s.memoryPerWord + s.backwardFull,
    1,
  );
  const maxFocus = Math.max(...s.focusBands.map((b) => b.points), 1);
  const strongest: [BrainTypeId, number][] = [
    ["magician", score.memory / maxMemory],
    ["laser", score.focus / maxFocus],
    ["diver", score.speed / maxSpeed],
  ];
  strongest.sort((a, b) => b[1] - a[1]);
  return strongest[0]![0];
}

export type PlayerReport = PlayerResults & {
  score: ScoreBreakdown;
  brainType: BrainTypeId;
  speedCounted: boolean;
  speedAfterWpm: number;
};

export function buildReport(r: PlayerResults, s: BuScoring): PlayerReport {
  const score = unlockScore(r, s);
  return {
    ...r,
    score,
    brainType: brainType(r, score, s),
    speedCounted: speedCounted(r.speedAfter),
    speedAfterWpm: speedAfterWpm(r.speedBefore, r.speedAfter),
  };
}

/** Duo Mode: the Team Score is the two players' average, rounded. */
export function teamScore(a: ScoreBreakdown, b: ScoreBreakdown): number {
  return Math.round((a.total + b.total) / 2);
}
