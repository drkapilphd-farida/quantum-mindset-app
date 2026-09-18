// Effective WPM™ (see the "Fix Critical WPM/Retention Logic Bug" task) —
// a raw words-per-minute number on its own is trivially gameable (click
// through instantly, answer randomly, still get a high number). This
// gates the displayed result by how much of the passage the reader
// actually retained, and is the ONE formula both the baseline
// ("Comprehend") stage and the RSVP ("Experience") stage results use —
// deliberately shared, not two similar-but-different implementations,
// so the two numbers on the Results screen are comparable on the same
// basis.
//
// Below RETENTION_THRESHOLD (60%), the multiplier is accuracy² — a
// sharp, deliberately punitive penalty (0.5 accuracy -> 0.25 multiplier,
// not 0.5) so partial/lucky-guess comprehension can't produce a
// respectable-looking number. At or above the threshold, the multiplier
// is accuracy itself — still ties the number to comprehension, but
// doesn't over-punish someone who is genuinely reading well.
// `isValid: false` (effectiveWpm rounds to 0, i.e. zero correct answers)
// means the raw WPM couldn't be verified at all — the UI shows a message
// instead of a number in that case, never a bare "0 WPM".

const RETENTION_THRESHOLD = 0.6;

export type EffectiveWpmResult = {
  accuracy: number; // 0..1
  multiplier: number; // 0..1
  effectiveWpm: number;
  isValid: boolean;
};

export function computeEffectiveWpm(rawWpm: number, correctCount: number, totalQuestions: number): EffectiveWpmResult {
  if (totalQuestions <= 0 || rawWpm <= 0) {
    return { accuracy: 0, multiplier: 0, effectiveWpm: 0, isValid: false };
  }
  const accuracy = Math.min(Math.max(correctCount / totalQuestions, 0), 1);
  const multiplier = accuracy < RETENTION_THRESHOLD ? accuracy ** 2 : accuracy;
  const effectiveWpm = Math.round(rawWpm * multiplier);
  return { accuracy, multiplier, effectiveWpm, isValid: effectiveWpm > 0 };
}
