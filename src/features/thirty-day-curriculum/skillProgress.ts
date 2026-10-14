import { DAY_EXERCISE_IDS } from './curriculumDatabase'

// The 4 skill bars on the 30-day plan page: where the learner started (their
// first practice of that skill) and where they are now (their last 3 results).
// Every number is a plain, explained measure — no invented "brain score".
export type SkillId = 'focus' | 'memory' | 'reading' | 'retention'

export type SkillBar = {
  skill: SkillId
  /** null until the learner has practised this skill. */
  start: number | null
  now: number | null
  unit: 'percent' | 'wpm'
}

export type ResultRow = { exerciseId: string; accuracyPercent: number | null; playedAt: string }
export type WpmRow = { trueWpm: number | null; completedAt: string; contentLang: string }

const FOCUS_IDS = new Set(['schulte-grid-drill', 'schulte-grid-speed-drill', 'cross-lateral-tap', 'fast-pattern-blinking', 'peripheral-flash-expander', 'rapid-visual-span-expander', 'blink-trigger-micro-recall', 'quantum-tachistoscope-multi-word-blast', 'quantum-mental-rotation', 'quantum-hidden-target-grid', 'hemispheric-color-sync'])
const RETENTION_IDS = new Set(['memory-palace-next-day', 'spaced-review'])
// Memory methods and their own-list / learn variants, plus the older visual-memory drills.
const MEMORY_PREFIXES = ['story-method', 'peg-method', 'name-face', 'number-code', 'keyword-method', 'acronym-', 'palace-personal', 'chapter-book', 'memory-palace', 'memory-check']
const MEMORY_IDS = new Set(['photographic-memory', 'dot-memory-grid', 'word-flash-grid', 'image-flash-grid', 'number-flash-grid', 'pictorial-essence-sprint', ...Object.values(DAY_EXERCISE_IDS).map((slots) => slots[1])])

export function skillOf(exerciseId: string): SkillId | null {
  if (RETENTION_IDS.has(exerciseId)) return 'retention'
  if (FOCUS_IDS.has(exerciseId)) return 'focus'
  if (MEMORY_IDS.has(exerciseId) || MEMORY_PREFIXES.some((p) => exerciseId.startsWith(p))) return 'memory'
  return null
}

const RECENT = 3
const avg = (xs: readonly number[]): number => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length)

/** Start = average of the first practice day (India time); now = average of the last 3 results. */
function percentBar(skill: SkillId, rows: readonly ResultRow[]): SkillBar {
  const scored = rows.filter((r): r is ResultRow & { accuracyPercent: number } => r.accuracyPercent !== null).sort((a, b) => a.playedAt.localeCompare(b.playedAt))
  if (scored.length === 0) return { skill, start: null, now: null, unit: 'percent' }
  const istDay = (iso: string): string => new Date(Date.parse(iso) + 5.5 * 3600_000).toISOString().slice(0, 10)
  const firstDay = istDay(scored[0]!.playedAt)
  const start = avg(scored.filter((r) => istDay(r.playedAt) === firstDay).map((r) => r.accuracyPercent))
  const now = avg(scored.slice(-RECENT).map((r) => r.accuracyPercent))
  return { skill, start, now, unit: 'percent' }
}

/** Reading speed with understanding: first vs latest measured WPM, in the same reading language only. */
function readingBar(rows: readonly WpmRow[]): SkillBar {
  const measured = rows.filter((r): r is WpmRow & { trueWpm: number } => r.trueWpm !== null && r.trueWpm > 0).sort((a, b) => a.completedAt.localeCompare(b.completedAt))
  const latest = measured.at(-1)
  if (latest === undefined) return { skill: 'reading', start: null, now: null, unit: 'wpm' }
  const sameLang = measured.filter((r) => r.contentLang === latest.contentLang)
  return { skill: 'reading', start: sameLang[0]!.trueWpm, now: latest.trueWpm, unit: 'wpm' }
}

export function computeSkillBars(results: readonly ResultRow[], wpm: readonly WpmRow[]): readonly SkillBar[] {
  const by = (skill: SkillId): ResultRow[] => results.filter((r) => skillOf(r.exerciseId) === skill)
  return [percentBar('focus', by('focus')), percentBar('memory', by('memory')), readingBar(wpm), percentBar('retention', by('retention'))]
}

// Rough minutes per step, so the Today card can say "about N min" (a step
// not listed uses its slot's default).
const STEP_MINUTES: Readonly<Record<string, number>> = {
  'chapter-book': 7,
  'story-method': 4,
  'peg-method': 4,
  'memory-palace': 4,
  'color-scene-transformation': 3,
  'calm-breathing': 2,
  'quantum-mental-rotation': 2,
}
const DEFAULT_STEP_MINUTES: Readonly<Record<number, number>> = { 0: 2, 1: 5, 2: 3, 3: 4 }

export function dayStepCount(day: number): number {
  const slots = DAY_EXERCISE_IDS[day]
  return slots === undefined ? 0 : 3 + slots[3].length
}

export function dayMinutes(day: number): number {
  const slots = DAY_EXERCISE_IDS[day]
  if (slots === undefined) return 0
  const ids = [slots[0], slots[1], slots[2], ...slots[3]]
  const steps = ids.reduce((sum, id, i) => sum + (STEP_MINUTES[id] ?? DEFAULT_STEP_MINUTES[Math.min(i, 3)]!), 0)
  // Day 1 and Day 30 add the reading test and the memory check.
  return steps + (day === 1 || day === 30 ? 6 : 0)
}
