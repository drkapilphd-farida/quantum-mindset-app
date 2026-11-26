// Brain Test v3 (founder spec, 26 Nov 2026) — the Brain Score. Pure functions,
// used by the page (what the person sees) and the server (what is saved), so
// both always agree. Four parts of 0–25 each; the total is their rounded sum.
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

/** Focus 0–25 from the round 2 time: ≤ 20 s → 25, ≥ 90 s → 5, linear in between. */
export function focusPoints(round2Seconds: number): number {
  if (!finite(round2Seconds) || round2Seconds <= 0) return 0;
  if (round2Seconds <= 20) return PART_MAX;
  if (round2Seconds >= 90) return 5;
  return clamp(PART_MAX - ((round2Seconds - 20) / 70) * 20, 5, PART_MAX);
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

/** Reading 0–25: the question right → 25, wrong → 12. */
export function readingPoints(correct: boolean): number {
  return correct ? PART_MAX : 12;
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
  /** Whole number 0–100. */
  total: number;
  boostPct: number | null;
  /** The part with the most points (0–25 each), and the one with the most room to grow. */
  strongest: SkillKey;
  growth: SkillKey;
};

const ORDER: readonly SkillKey[] = ["focus", "boost", "memory", "reading"];

export function brainScore(i: V3Inputs): V3Score {
  const boostPct = boostPercent(i.round1Seconds, i.round2Seconds, i.breathsSkipped);
  const parts: Record<SkillKey, number> = {
    focus: focusPoints(i.round2Seconds),
    boost: boostPoints(boostPct),
    memory: memoryPoints(i.memoryHits, i.memoryFalse),
    reading: readingPoints(i.rsvpCorrect),
  };
  const total = Math.round(clamp(ORDER.reduce((sum, k) => sum + parts[k], 0), 0, 4 * PART_MAX));
  // Ties keep the fixed order, so the same numbers always give the same lines.
  const strongest = ORDER.reduce((best, k) => (parts[k] > parts[best] ? k : best), ORDER[0]!);
  const growth = ORDER.reduce((low, k) => (parts[k] < parts[low] ? k : low), ORDER[0]!);
  return { ...parts, total, boostPct, strongest, growth };
}

/** Memory from the picks: hits = picked items that were shown, false = picked items that were not. */
export function memoryHitsFrom(shown: readonly string[], picked: readonly string[]): { hits: number; falsePicks: number } {
  const set = new Set(shown);
  const unique = [...new Set(picked)];
  const hits = unique.filter((id) => set.has(id)).length;
  return { hits: Math.min(hits, MEMORY_ITEMS), falsePicks: unique.length - hits };
}
