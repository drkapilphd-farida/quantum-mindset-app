// 30-Day Quantum Speed Reading Mastery Curriculum™ — the day-by-day
// roadmap. Each day's 4 exercises (5 on Day 30) are listed explicitly in
// DAY_EXERCISE_IDS below, so the plan is easy to read and review. The
// sequentially-gated modules (Reading Expansion, Flash Intelligence,
// Progressive Chunk Reading) still appear on days 22–30 in their own real
// prerequisite order. Day THEMES are hand-written narrative framing only.
//
// Exercise rebuild, Phase 1 (Oct 2026): eye-movement / staring / afterimage
// drills, the Zener and Hidden Target guessing games and the old "Calm Breath
// Balance" game were taken out of the plan and replaced (see the catalog).
// Day completion is stored per DAY, never per exercise, so changing a day's
// exercises never changes anyone's completed days, unlocks, streak,
// checkpoints or certificate.
import { getCurriculumExerciseById, TOTAL_CURRICULUM_CATALOG_EXERCISES, type CurriculumCatalogExercise } from './curriculumExerciseCatalog'

export const TOTAL_CURRICULUM_DAYS = 30

export type CurriculumPhaseId = 1 | 2 | 3 | 4

export type CurriculumPhase = {
  id: CurriculumPhaseId
  title: string
  dayRange: readonly [number, number]
  description: string
}

export const CURRICULUM_PHASES: readonly CurriculumPhase[] = [
  {
    id: 1,
    title: 'Foundation & Focus Warm-Up',
    dayRange: [1, 7],
    description: 'Establish a true baseline, build steady focus, and wake up visual memory and chunk reading.',
  },
  {
    id: 2,
    title: 'Visual Focus & Inner Voice Control',
    dayRange: [8, 14],
    description: 'Deepen visual, non-verbal recall and break the habit of silently voicing every word.',
  },
  {
    id: 3,
    title: 'Multi-Sensory Visualisation & Mental Mastery',
    dayRange: [15, 21],
    description: 'Train vivid multi-sensory visualization and sustained focus.',
  },
  {
    id: 4,
    title: 'Peak Smart Reading Mastery & Final Certification',
    dayRange: [22, 30],
    description: 'Push every skill to its ceiling and complete the final mastery certification.',
  },
] as const

export function getPhaseForDay(day: number): CurriculumPhaseId {
  const phase = CURRICULUM_PHASES.find(({ dayRange }) => day >= dayRange[0] && day <= dayRange[1])
  if (phase === undefined) {
    throw new RangeError(`Day ${day} is outside the 30-day curriculum (1-${TOTAL_CURRICULUM_DAYS}).`)
  }
  return phase.id
}

export function getCurriculumPhase(phaseId: CurriculumPhaseId): CurriculumPhase {
  const phase = CURRICULUM_PHASES.find((candidate) => candidate.id === phaseId)
  if (phase === undefined) {
    throw new RangeError(`Unknown curriculum phase id: ${phaseId}`)
  }
  return phase
}

// Phase-Complete Celebration Screens™ — the phase whose LAST day this is
// (Day 7 -> Phase 1, Day 14 -> Phase 2, Day 21 -> Phase 3), or null on any
// other day. Deliberately excludes Phase 4 (Day 30): there's no Phase 5
// to transition into — Day 30 is the whole curriculum's own finale, a
// separate concern from this mid-journey phase-transition moment.
export function getPhaseJustCompleted(day: number): CurriculumPhaseId | null {
  const phase = CURRICULUM_PHASES.find((candidate) => candidate.id !== 4 && candidate.dayRange[1] === day)
  return phase?.id ?? null
}

export type CurriculumDayTheme = {
  day: number
  title: string
  focus: string
}

// Hand-authored narrative only — see buildCurriculumDayPlan for the real,
// mechanically-derived exercise selection.
export const CURRICULUM_DAY_THEMES: readonly CurriculumDayTheme[] = [
  { day: 1, title: 'Baseline & Focus Warm-Up', focus: 'Establish your true baseline WPM and comprehension score, then begin waking up your visual system.' },
  { day: 2, title: 'Focus Foundation', focus: 'Warm up your attention with a number hunt, then train picture memory and chunk reading.' },
  { day: 3, title: 'First Visual Focus Session', focus: 'Introduce visual, non-verbal recall alongside your reading warm-ups.' },
  { day: 4, title: 'Rhythm & Chunk Awareness', focus: 'Start noticing word groups instead of single words.' },
  { day: 5, title: 'Visualization Opens', focus: 'Begin practising clear pictures in your mind.' },
  { day: 6, title: 'Foundation Consolidation', focus: "Reinforce the week's gains with a full balanced circuit." },
  { day: 7, title: 'Checkpoint — Foundation Review', focus: 'Re-measure WPM and comprehension to confirm real week-one growth.' },
  { day: 8, title: 'Visual Focus Expansion Begins', focus: 'Deepen visual recall training.' },
  { day: 9, title: 'Inner Voice Awareness', focus: 'Start noticing and interrupting your inner voice while reading.' },
  { day: 10, title: 'Flash Intelligence Warm-Up', focus: 'Sharpen instant recognition speed with flash-based drills.' },
  { day: 11, title: 'Deeper Visual Focus Practice', focus: 'Extend non-verbal recall span and grid complexity.' },
  { day: 12, title: 'Inner Voice Control', focus: 'Push further into silent, voice-free reading.' },
  { day: 13, title: 'Integration Circuit', focus: 'Combine visual-focus and reading gains in one balanced session.' },
  { day: 14, title: 'Checkpoint — Visual Focus Review', focus: 'Re-measure WPM and comprehension to confirm real week-two growth.' },
  {
    day: 15,
    title: 'Multi-Sensory Visualisation Begins',
    focus: 'Enter the Sensory Imagery Builder to train vivid, multi-sensory mental imagery.',
  },
  { day: 16, title: 'Calm & Steady Focus', focus: 'Settle your mind with guided slow breathing, then train focus and memory.' },
  { day: 17, title: 'Mental Mastery Deepens', focus: 'Layer visualization work on top of your reading gains.' },
  { day: 18, title: 'Full Sensory Immersion', focus: 'Picture scenes vividly and recall their details.' },
  { day: 19, title: 'Steady Under Pressure', focus: 'Keep your attention steady as the drills get quicker.' },
  { day: 20, title: 'Integrated Focus Circuit', focus: 'Combine calm breathing, memory and reading in one advanced session.' },
  { day: 21, title: 'Checkpoint — Mental Mastery Review', focus: 'Re-measure WPM and comprehension to confirm real week-three growth.' },
  { day: 22, title: 'Peak Mastery — Phrase Fluency', focus: 'Read in idea-sized phrases, not single words.' },
  { day: 23, title: 'Peak Mastery — Multi-Line Flow', focus: 'Extend fluency across multiple lines at once.' },
  { day: 24, title: 'Peak Mastery — Sentence Mastery', focus: 'Recognize whole sentences as single ideas.' },
  { day: 25, title: 'Peak Mastery — Paragraph Mastery', focus: 'Recognize whole paragraphs as single meaning blocks.' },
  { day: 26, title: 'Peak Mastery — Rapid Recognition', focus: 'Recognise words at a glance while keeping accuracy high.' },
  { day: 27, title: 'Peak Mastery — Number Flash', focus: 'Take in numbers at a glance and keep accuracy high.' },
  { day: 28, title: 'Peak Mastery — Calm Precision', focus: 'Breathe slowly, then recognise symbols quickly and accurately.' },
  { day: 29, title: 'Peak Mastery — Mixed Recognition', focus: 'Words, numbers and symbols at a glance — your sharpest round yet.' },
  {
    day: 30,
    title: 'Final Certification',
    focus: 'Complete your final WPM and comprehension assessment and claim your Sharp Brain certification.',
  },
]

export function getCurriculumDayTheme(day: number): CurriculumDayTheme {
  const theme = CURRICULUM_DAY_THEMES.find((candidate) => candidate.day === day)
  if (theme === undefined) {
    throw new RangeError(`Day ${day} is outside the 30-day curriculum (1-${TOTAL_CURRICULUM_DAYS}).`)
  }
  return theme
}

// Real WPM/comprehension mini-assessment days — Day 1 is the mandatory
// baseline, the rest are periodic re-measurements at each phase boundary
// plus the final day.
export const CHECKPOINT_DAYS: readonly number[] = [1, 7, 14, 21, 30]

export function isCheckpointDay(day: number): boolean {
  return CHECKPOINT_DAYS.includes(day)
}

export type CurriculumDayExercises = {
  brainGym: readonly CurriculumCatalogExercise[]
  rightBrainIntuition: readonly CurriculumCatalogExercise[]
  visualization: readonly CurriculumCatalogExercise[]
  readingIntelligence: readonly CurriculumCatalogExercise[]
}

export type CurriculumDayPlan = {
  day: number
  phase: CurriculumPhaseId
  theme: CurriculumDayTheme
  exercises: CurriculumDayExercises
  isCheckpoint: boolean
  requiresBaseline: boolean
}

type DaySlots = readonly [brainGym: string, rightBrainIntuition: string, visualization: string, readingIntelligence: readonly string[]]

// One row per day: focus warm-up · visual memory · visualisation/calm · reading.
export const DAY_EXERCISE_IDS: Readonly<Record<number, DaySlots>> = {
  1: ['calm-breathing', 'photographic-memory', 'quantum-mental-rotation', ['dynamic-chunk-sliding']],
  2: ['schulte-grid-speed-drill', 'pictorial-essence-sprint', 'color-scene-transformation', ['vertical-chunk-sliding']],
  3: ['cross-lateral-tap', 'hemispheric-color-sync', 'sensory-hologram-builder', ['flash-recall-sprint']],
  4: ['peripheral-flash-expander', 'image-flash-grid', 'calm-breathing', ['vertical-flash-recall']],
  5: ['quantum-tachistoscope-multi-word-blast', 'dot-memory-grid', 'quantum-mental-rotation', ['vertical-word-reading']],
  6: ['fast-pattern-blinking', 'number-flash-grid', 'color-scene-transformation', ['phrase-reading-mode']],
  7: ['blink-trigger-micro-recall', 'word-flash-grid', 'sensory-hologram-builder', ['sentence-reading-mode']],
  8: ['rapid-visual-span-expander', 'image-flash-grid', 'calm-breathing', ['paragraph-reading-mode']],
  9: ['schulte-grid-speed-drill', 'dot-memory-grid', 'quantum-mental-rotation', ['guided-paragraph-reading-mode']],
  10: ['rapid-visual-span-expander', 'number-flash-grid', 'color-scene-transformation', ['subvocalization-destroyer']],
  11: ['blink-trigger-micro-recall', 'photographic-memory', 'sensory-hologram-builder', ['photographic-reading']],
  12: ['cross-lateral-tap', 'pictorial-essence-sprint', 'calm-breathing', ['dual-stream-split-reader']],
  13: ['fast-pattern-blinking', 'hemispheric-color-sync', 'quantum-mental-rotation', ['dynamic-chunk-sliding']],
  14: ['schulte-grid-speed-drill', 'word-flash-grid', 'color-scene-transformation', ['vertical-chunk-sliding']],
  15: ['rapid-visual-span-expander', 'dot-memory-grid', 'sensory-hologram-builder', ['flash-recall-sprint']],
  16: ['cross-lateral-tap', 'number-flash-grid', 'calm-breathing', ['vertical-flash-recall']],
  17: ['fast-pattern-blinking', 'word-flash-grid', 'quantum-mental-rotation', ['vertical-word-reading']],
  18: ['blink-trigger-micro-recall', 'image-flash-grid', 'color-scene-transformation', ['phrase-reading-mode']],
  19: ['peripheral-flash-expander', 'hemispheric-color-sync', 'sensory-hologram-builder', ['sentence-reading-mode']],
  20: ['quantum-tachistoscope-multi-word-blast', 'dot-memory-grid', 'calm-breathing', ['paragraph-reading-mode']],
  21: ['schulte-grid-speed-drill', 'photographic-memory', 'quantum-mental-rotation', ['guided-paragraph-reading-mode']],
  22: ['cross-lateral-tap', 'pictorial-essence-sprint', 'color-scene-transformation', ['phrase-reading']],
  23: ['rapid-visual-span-expander', 'hemispheric-color-sync', 'sensory-hologram-builder', ['multi-line-reading']],
  24: ['fast-pattern-blinking', 'word-flash-grid', 'calm-breathing', ['sentence-reading']],
  25: ['schulte-grid-speed-drill', 'dot-memory-grid', 'quantum-mental-rotation', ['paragraph-reading']],
  26: ['blink-trigger-micro-recall', 'number-flash-grid', 'color-scene-transformation', ['word-flash']],
  27: ['cross-lateral-tap', 'word-flash-grid', 'sensory-hologram-builder', ['number-flash']],
  28: ['rapid-visual-span-expander', 'image-flash-grid', 'calm-breathing', ['symbol-flash']],
  29: ['fast-pattern-blinking', 'pictorial-essence-sprint', 'quantum-mental-rotation', ['mixed-flash']],
  30: ['schulte-grid-speed-drill', 'dot-memory-grid', 'color-scene-transformation', ['peripheral-flash', 'progressive-chunk-reading']],
}

function exercise(id: string): CurriculumCatalogExercise {
  const found = getCurriculumExerciseById(id)
  if (found === undefined) throw new Error(`Curriculum plan references unknown exercise: ${id}`)
  return found
}

export function buildCurriculumDayPlan(day: number): CurriculumDayPlan {
  if (!Number.isInteger(day) || day < 1 || day > TOTAL_CURRICULUM_DAYS) {
    throw new RangeError(`Day ${day} is outside the 30-day curriculum (1-${TOTAL_CURRICULUM_DAYS}).`)
  }
  const [brainGym, rightBrainIntuition, visualization, reading] = DAY_EXERCISE_IDS[day]!
  return {
    day,
    phase: getPhaseForDay(day),
    theme: getCurriculumDayTheme(day),
    exercises: {
      brainGym: [exercise(brainGym)],
      rightBrainIntuition: [exercise(rightBrainIntuition)],
      visualization: [exercise(visualization)],
      readingIntelligence: reading.map(exercise),
    },
    isCheckpoint: isCheckpointDay(day),
    requiresBaseline: day === 1,
  }
}

export function buildFullCurriculum(): readonly CurriculumDayPlan[] {
  return Array.from({ length: TOTAL_CURRICULUM_DAYS }, (_, index) => buildCurriculumDayPlan(index + 1))
}

export { TOTAL_CURRICULUM_CATALOG_EXERCISES }
