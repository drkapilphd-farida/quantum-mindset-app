// Speed Superpower = RSVP ("Word Flash"): one word at a time in a fixed box
// (founder, 14 Nov 2026). Pure — tested in rsvp.test.ts.
//
// - Start speed: the reader's own Brain Check speed × 1.5, 220–450 WPM.
// - English: one RED focus letter (~35% in), always at the same spot, so the
//   eyes never move. Hindi: the whole word in the normal colour, centred on
//   the same spot (no letter colouring).
// - Rhythm: the app's Smart Reader Word Flash timing (comma ×1.5, full stop
//   ×2, a little more for long words), so it feels the same as in the app.
// - The final WPM comes from the real reading time, paused time excluded.
import { wordDurationMs, words } from "@/features/smart-reader/reader";

export const RSVP_START_MIN = 220;
export const RSVP_START_MAX = 450;
export const RSVP_MULTIPLIER = 1.5;
export const RSVP_STEP = 25;
export const RSVP_MIN = 150;
export const RSVP_MAX = 700;

/** The first speed: 1.5 × the reader's own baseline, between 220 and 450 WPM (rounded to 5). */
export function rsvpStartWpm(baselineWpm: number): number {
  const v = Math.round((baselineWpm * RSVP_MULTIPLIER) / 5) * 5;
  return Math.min(RSVP_START_MAX, Math.max(RSVP_START_MIN, v));
}

/** − / + : steps of 25 WPM, kept between 150 and 700. */
export function stepWpm(wpm: number, dir: -1 | 1): number {
  return Math.min(RSVP_MAX, Math.max(RSVP_MIN, wpm + dir * RSVP_STEP));
}

/**
 * The red focus letter is decided by the PASSAGE language: every word of an
 * English passage gets one (numbers too); no word of a Hindi passage does
 * (even an English word or a number inside it).
 */
export const showsFocusLetter = (lang: "en" | "hi"): boolean => lang === "en";

/**
 * English focus letter, as an index into the word string (punctuation
 * skipped): 1st letter for 1–3 letters, 2nd for 4–5, 3rd for 6–9, 4th for 10+.
 */
export function focusLetterIndex(word: string): number {
  const letters: number[] = [];
  for (let i = 0; i < word.length; i++)
    if (/[A-Za-z0-9]/.test(word[i]!)) letters.push(i);
  if (letters.length === 0) return 0;
  const n = letters.length;
  const k = n <= 3 ? 0 : n <= 5 ? 1 : n <= 9 ? 2 : 3;
  return letters[k]!;
}

/** The word split around its focus letter (English only). */
export function splitAtFocus(word: string): {
  before: string;
  focus: string;
  after: string;
} {
  const i = focusLetterIndex(word);
  return {
    before: word.slice(0, i),
    focus: word.slice(i, i + 1),
    after: word.slice(i + 1),
  };
}

export const rsvpWords = (text: string): string[] => words(text);

/** How long one word stays on screen at this speed. */
export const rsvpWordMs = (word: string, wpm: number): number =>
  wordDurationMs(word, wpm);

/**
 * A reading clock that leaves out paused time. Times are passed in (ms), so
 * it is pure and testable.
 */
export class ActiveClock {
  private started: number | null = null;
  private pausedAt: number | null = null;
  private pausedTotal = 0;

  start(now: number): void {
    this.started = now;
    this.pausedAt = null;
    this.pausedTotal = 0;
  }
  pause(now: number): void {
    if (this.started !== null && this.pausedAt === null) this.pausedAt = now;
  }
  resume(now: number): void {
    if (this.pausedAt !== null) {
      this.pausedTotal += now - this.pausedAt;
      this.pausedAt = null;
    }
  }
  get paused(): boolean {
    return this.pausedAt !== null;
  }
  /** Reading time so far, paused time excluded. */
  elapsed(now: number): number {
    if (this.started === null) return 0;
    const end = this.pausedAt ?? now;
    return Math.max(0, end - this.started - this.pausedTotal);
  }
}

/**
 * A font size (px) at which every word of the passage fits the box: English
 * words are anchored at the focus letter (the longer side must fit half the
 * box); Hindi words are centred (the whole word must fit).
 */
export function rsvpFontPx(
  ws: readonly string[],
  boxPx: number,
  lang: "en" | "hi",
  maxPx = 44,
): number {
  const CHAR_EM = 0.62; // a generous average glyph width
  let need = 1;
  for (const w of ws) {
    if (showsFocusLetter(lang)) {
      const { before, after } = splitAtFocus(w);
      need = Math.max(need, (Math.max(before.length, after.length) + 0.5) * 2);
    } else {
      need = Math.max(need, Array.from(w).length * 0.8);
    }
  }
  return Math.max(
    20,
    Math.min(maxPx, Math.floor((boxPx * 0.92) / (need * CHAR_EM))),
  );
}
