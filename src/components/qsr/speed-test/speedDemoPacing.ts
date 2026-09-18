// Speed Demo Pacing™ — pure functions behind the "Experience It" stage's
// auto-accelerating flash. No DB/React, independently testable — same
// convention as pacingMath.ts.
//
// Word grouping (see the "Fix Critical WPM/Retention Logic Bug" task) —
// this used to grow chunk size into 2- and 3-word phrases in the later
// thirds of the passage, which both broke the RSVP principle (one word,
// one fixation) and looked like a display bug to users at higher speeds.
// Default is now strictly one word per flash at every speed, no
// exceptions. Phrase-grouping is kept as an explicit opt-in
// (`chunkMode: "phrase"`) rather than deleted outright, in case a future,
// clearly-labeled "advanced/QSR chunking" mode wants it — but nothing
// calls it that way today, so the live default is always single-word.

export const RAMP_START_WPM = 220;
export const RAMP_CAP_WPM = 560;

export type ChunkMode = "single" | "phrase";

// "single" (the default, and the only mode QsrSpeedTestExperience.tsx
// actually uses): one word per chunk throughout.
// "phrase": the old behavior — chunk size grows in thirds of the
// passage (1-word, then 2-word, then 3-word) — kept available but never
// wired into the live demo unless a caller explicitly opts in.
export function buildProgressiveChunks(
  words: readonly string[],
  chunkMode: ChunkMode = "single",
): readonly string[] {
  if (chunkMode === "single") return words;

  const total = words.length;
  const chunks: string[] = [];
  let index = 0;
  while (index < total) {
    const fraction = index / total;
    const size = fraction < 1 / 3 ? 1 : fraction < 2 / 3 ? 2 : 3;
    chunks.push(words.slice(index, index + size).join(" "));
    index += size;
  }
  return chunks;
}

// Continuous linear ramp from RAMP_START_WPM to RAMP_CAP_WPM across the
// chunk sequence — replaces the old fixed-step-every-5-words jump so the
// live WPM readout climbs smoothly instead of visibly staircasing.
export function computeRampWpm(chunkIndex: number, totalChunks: number): number {
  if (totalChunks <= 1) return RAMP_START_WPM;
  const fraction = Math.min(Math.max(chunkIndex / (totalChunks - 1), 0), 1);
  return Math.round(RAMP_START_WPM + fraction * (RAMP_CAP_WPM - RAMP_START_WPM));
}
