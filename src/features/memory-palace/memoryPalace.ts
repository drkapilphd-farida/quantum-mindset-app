import { clampLevel, MAX_LEVEL, MIN_LEVEL, type LevelState } from '@/features/exercise-core/levelEngine'

// Memory Palace (Phase 2, replaces Sensory Imagery Builder). Pure logic only:
// objects, places, levels, recall choices and the delayed-recall rules. The
// script lines (voice + captions) live in ./script/<lang>.json.

export const MEMORY_PALACE_EXERCISE_ID = 'memory-palace'
export const SAME_DAY_RECALL_EXERCISE_ID = 'memory-palace-same-day'
export const NEXT_DAY_RECALL_EXERCISE_ID = 'memory-palace-next-day'

export type PalaceObject = { id: string; lineId: string; icon: string }

const SETS = 4
const PER_SET = 10
const pad = (n: number): string => String(n).padStart(2, '0')

/** The 40 objects (4 sets × 10). id "2-07" ↔ script line "object-2-07" ↔ icon "/memory-palace/icons/2-07.svg". */
export const PALACE_OBJECTS: readonly PalaceObject[] = Array.from({ length: SETS * PER_SET }, (_, i) => {
  const id = `${Math.floor(i / PER_SET) + 1}-${pad((i % PER_SET) + 1)}`
  return { id, lineId: `object-${id}`, icon: `/memory-palace/icons/${id}.svg` }
})

const OBJECT_IDS = new Set(PALACE_OBJECTS.map((o) => o.id))

/** The 10 places along the home route, in walking order. */
export const PALACE_PLACE_LINE_IDS: readonly string[] = Array.from({ length: 10 }, (_, i) => `place-${pad(i + 1)}`)

// Pairs that look or sound alike — used as distractors from level 7 so the
// learner has to remember the exact object, not just its kind.
const LOOKALIKE_GROUPS: readonly (readonly string[])[] = [
  ['2-03', '4-05'], // kite / kite string
  ['1-07', '4-10'], // parrot / peacock
  ['2-06', '4-06', '4-02'], // train whistle / bell / flute
  ['3-01', '3-04', '3-07', '3-02'], // book / blackboard / ruler / pencil
  ['1-08', '4-03'], // candle / diya
  ['2-04', '2-08'], // ice / salt
  ['1-04', '1-10'], // alarm clock / phone
  ['2-01', '2-09'], // elephant / camel
  ['2-02', '2-10'], // auto-rickshaw / bicycle
  ['4-01', '4-08'], // drum / spinning top
  ['3-08', '3-05'], // laptop / calculator
  ['3-09', '4-09'], // trophy / box of sweets
  ['4-04', '2-05'], // marigold garland / sunflower
  ['1-02', '2-07'], // umbrella / paper boat
  ['1-01', '1-06'], // mango / rotis
]

export function lookalikesOf(objectId: string): string[] {
  return LOOKALIKE_GROUPS.filter((g) => g.includes(objectId)).flatMap((g) => g.filter((id) => id !== objectId))
}

export type PalaceLevelConfig = { places: number; choices: number; lookalikes: boolean }

export function levelConfig(level: number): PalaceLevelConfig {
  const l = clampLevel(level)
  const places = l <= 3 ? 5 : l === 4 ? 6 : l === 5 ? 7 : l <= 7 ? 8 : l === 8 ? 9 : 10
  return { places, choices: l === 10 ? 6 : 4, lookalikes: l >= 7 }
}

export type Rng = () => number

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/** `count` different objects, avoiding the previous palace's objects where possible. */
export function pickObjects(count: number, avoid: readonly string[], rng: Rng = Math.random): string[] {
  const avoidSet = new Set(avoid)
  const fresh = shuffle(PALACE_OBJECTS.map((o) => o.id).filter((id) => !avoidSet.has(id)), rng)
  const reuse = shuffle(PALACE_OBJECTS.map((o) => o.id).filter((id) => avoidSet.has(id)), rng)
  return [...fresh, ...reuse].slice(0, count)
}

/** The answer plus distractors, shuffled. Look-alikes first when the level uses them. */
export function buildChoices(correctId: string, config: PalaceLevelConfig, rng: Rng = Math.random): string[] {
  const wanted = config.choices - 1
  const picked: string[] = []
  if (config.lookalikes) for (const id of shuffle(lookalikesOf(correctId), rng)) if (picked.length < Math.min(2, wanted)) picked.push(id)
  for (const id of shuffle(PALACE_OBJECTS.map((o) => o.id), rng)) {
    if (picked.length >= wanted) break
    if (id !== correctId && !picked.includes(id)) picked.push(id)
  }
  return shuffle([correctId, ...picked], rng)
}

/**
 * Level after an immediate-recall session: two sessions in a row at 80%+
 * move up, one session under 50% moves down; the level never resets.
 */
export function applyPalaceSession(state: LevelState, accuracy: number): LevelState {
  const level = clampLevel(state.level)
  if (accuracy >= 0.8) {
    const goodRun = state.goodRun + 1
    if (goodRun >= 2 && level < MAX_LEVEL) return { level: level + 1, goodRun: 0, poorRun: 0 }
    return { level, goodRun: Math.min(goodRun, 1), poorRun: 0 }
  }
  if (accuracy < 0.5) return { level: Math.max(MIN_LEVEL, level - 1), goodRun: 0, poorRun: 0 }
  return { level, goodRun: 0, poorRun: 0 }
}

export type DelayLabel = '24h' | '48h' | 'later'

/** A palace is due for its next-day recall this many hours after it was built. */
export const NEXT_DAY_RECALL_MIN_HOURS = 8

/**
 * Whether a palace built `hoursSince` hours ago is due for its next-day recall:
 * under 8 h is still the same day (not yet), 8–36 h is "24 h", 36–60 h is
 * "48 h", up to 7 days is "later (N days)", after that it has expired. The
 * minimum is 8 h (lowered from 12 h with pace control, 8 Oct 2026) so an
 * evening palace can be recalled the next morning, after a night's sleep.
 */
export function nextDayRecallStatus(hoursSince: number): { due: true; label: DelayLabel; days: number } | { due: false; reason: 'too-soon' | 'expired' } {
  if (!Number.isFinite(hoursSince) || hoursSince < NEXT_DAY_RECALL_MIN_HOURS) return { due: false, reason: 'too-soon' }
  if (hoursSince > 24 * 7) return { due: false, reason: 'expired' }
  const days = Math.max(1, Math.round(hoursSince / 24))
  if (hoursSince <= 36) return { due: true, label: '24h', days }
  if (hoursSince <= 60) return { due: true, label: '48h', days }
  return { due: true, label: 'later', days }
}

/** Compact, validated object list for exercise_results.details (fits the 80-character field limit). */
export function encodeObjects(ids: readonly string[]): string {
  return ids.join(',')
}

export function decodeObjects(value: unknown): string[] | null {
  if (typeof value !== 'string' || value.length === 0) return null
  const ids = value.split(',')
  return ids.length >= 1 && ids.length <= 10 && ids.every((id) => OBJECT_IDS.has(id)) ? ids : null
}

/** A built palace: what a later recall needs. */
export type Palace = { palaceId: string; objects: string[]; level: number }

export function recallScore(correct: number, total: number): { score: number; accuracyPercent: number } {
  const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 0
  return { score: correct * 100, accuracyPercent }
}
