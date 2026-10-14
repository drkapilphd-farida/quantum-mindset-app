// "Recommended for you" on the target-speed pickers: a pace a little above
// the learner's own measured reading speed (with understanding), so practice
// stretches them without leaving understanding behind.
export const STRETCH = 1.1

/** The option closest to measured × 1.1 (ties go to the slower one); null without a measurement. */
export function recommendWpm(measuredWpm: number | null, options: readonly number[]): number | null {
  if (measuredWpm === null || measuredWpm <= 0 || options.length === 0) return null
  const goal = measuredWpm * STRETCH
  return options.reduce((best, o) => (Math.abs(o - goal) < Math.abs(best - goal) ? o : best), options[0]!)
}
