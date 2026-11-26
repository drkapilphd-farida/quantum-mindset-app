// Brain Test v3 (founder spec, 26 Nov 2026) — the Brain Score. Pure functions,
// used by the page (what the person sees) and the server (what is saved), so
// both always agree. Focus, Breath boost and Memory are 0–25 each, Reading is
// 8 or 18 (founder, 26 Nov 2026: so Reading is not automatically the top skill);
// the total is their sum scaled to 100 (the parts add up to at most 93), rounded.
// No percentiles, no comparisons with other people: only the person's own numbers.

export const PART_MAX = 25;
export const MEMORY_ITEMS = 7;
/** Fixed RSVP speed of round 4 (words per minute). */
export const RSVP_WPM = 350;

const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));
const finite = (x: number): boolean => Number.isFinite(x);

/** Seconds with one decimal, rounded properly: 38.44 → 38.4, 0.3999999 → 0.4. */
export function roundSeconds(seconds: number): number {
  if (!finite(seconds) || seconds < 0) return 0;
  return Math.round(seconds * 10) / 10;
}

/** "38.4" (always one decimal). */
export function formatSeconds(seconds: number): string {
  return roundSeconds(seconds).toFixed(1);
}

/** How many numbers a focus grid holds (4 × 4). */
export const GRID_SIZE = 16;

/** Focus 0–25 from the round 2 time (1 → 16): ≤ 10 s → 25, ≥ 45 s → 5, linear in between. */
export function focusPoints(round2Seconds: number): number {
  if (!finite(round2Seconds) || round2Seconds <= 0) return 0;
  if (round2Seconds <= 10) return PART_MAX;
  if (round2Seconds >= 45) return 5;
  return clamp(PART_MAX - ((round2Seconds - 10) / 35) * 20, 5, PART_MAX);
}

/**
 * How much faster round 2 was than round 1, as a whole percent
 * ((t1 − t2) / t1). Negative when round 2 was slower. null when the times
 * are missing, or when the breaths were skipped (then there was no "boost").
 */
export function boostPercent(round1Seconds: number, round2Seconds: number, breathsSkipped: boolean): number | null {
  if (breathsSkipped) return null;
  if (!finite(round1Seconds) || !finite(round2Seconds) || round1Seconds <= 0 || round2Seconds <= 0) return null;
  return Math.round(((round1Seconds - round2Seconds) / round1Seconds) * 100);
}

/** Breath boost 0–25: ≥ 30 % → 25, ≤ 0 % (or no boost measured) → 10, linear in between. */
export function boostPoints(boost: number | null): number {
  if (boost === null || !finite(boost) || boost <= 0) return 10;
  if (boost >= 30) return PART_MAX;
  return clamp(10 + (boost / 30) * 15, 10, PART_MAX);
}

/** Memory 0–25: max(0, hits − 0.5 × false picks) / 7 × 25. */
export function memoryPoints(hits: number, falsePicks: number): number {
  const h = clamp(Math.floor(finite(hits) ? hits : 0), 0, MEMORY_ITEMS);
  const f = Math.max(0, Math.floor(finite(falsePicks) ? falsePicks : 0));
  return clamp((Math.max(0, h - 0.5 * f) / MEMORY_ITEMS) * PART_MAX, 0, PART_MAX);
}

/** Reading: the question right → 18, wrong → 8. */
export const READING_RIGHT = 18;
export const READING_WRONG = 8;
export function readingPoints(correct: boolean): number {
  return correct ? READING_RIGHT : READING_WRONG;
}

export type V3Inputs = {
  round1Seconds: number;
  round2Seconds: number;
  breathsSkipped: boolean;
  memoryHits: number;
  memoryFalse: number;
  rsvpCorrect: boolean;
};

export type SkillKey = "focus" | "boost" | "memory" | "reading";

export type V3Score = {
  focus: number;
  boost: number;
  memory: number;
  reading: number;
  /** Whole number 0–100: the four parts' sum scaled from 0–93 to 0–100. */
  total: number;
  boostPct: number | null;
  /**
   * Only Focus and Memory are compared (as a share of their maximum): the
   * stronger one, and the one with more room to grow. null for both when they
   * are equal ("Focus and Memory are balanced"). Breath boost and Reading are
   * never named here.
   */
  strongest: CompareKey | null;
  growth: CompareKey | null;
};

export type CompareKey = "focus" | "memory";

const ORDER: readonly SkillKey[] = ["focus", "boost", "memory", "reading"];
/** The most points each part can give. */
export const PART_MAXES: Record<SkillKey, number> = { focus: PART_MAX, boost: PART_MAX, memory: PART_MAX, reading: READING_RIGHT };
/** The most the four parts can add up to (25 + 25 + 25 + 18 = 93): the total is scaled from this to 100. */
const MAX_SUM = ORDER.reduce((acc, k) => acc + PART_MAXES[k], 0);

export function brainScore(i: V3Inputs): V3Score {
  const boostPct = boostPercent(i.round1Seconds, i.round2Seconds, i.breathsSkipped);
  const parts: Record<SkillKey, number> = {
    focus: focusPoints(i.round2Seconds),
    boost: boostPoints(boostPct),
    memory: memoryPoints(i.memoryHits, i.memoryFalse),
    reading: readingPoints(i.rsvpCorrect),
  };
  const sum = ORDER.reduce((acc, k) => acc + parts[k], 0);
  const total = Math.round(clamp((sum / MAX_SUM) * 100, 0, 100));
  // Whole percents of each maximum, so a hair's difference counts as balanced.
  const focusPct = Math.round((parts.focus / PART_MAXES.focus) * 100);
  const memoryPct = Math.round((parts.memory / PART_MAXES.memory) * 100);
  const strongest: CompareKey | null = focusPct === memoryPct ? null : focusPct > memoryPct ? "focus" : "memory";
  const growth: CompareKey | null = strongest === null ? null : strongest === "focus" ? "memory" : "focus";
  return { ...parts, total, boostPct, strongest, growth };
}

/** Memory from the picks: hits = picked items that were shown, false = picked items that were not. */
export function memoryHitsFrom(shown: readonly string[], picked: readonly string[]): { hits: number; falsePicks: number } {
  const set = new Set(shown);
  const unique = [...new Set(picked)];
  const hits = unique.filter((id) => set.has(id)).length;
  return { hits: Math.min(hits, MEMORY_ITEMS), falsePicks: unique.length - hits };
}
