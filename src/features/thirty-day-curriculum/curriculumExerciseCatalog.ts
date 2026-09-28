// 30-Day Quantum Speed Reading Mastery Curriculum™ — the exercise
// catalog every day's plan draws from. Deliberately a flat, hand-verified
// list of every real, routable exercise in the app today (cross-checked
// directly against each hub registry / module sequence file, not
// guessed), grouped into the 4 categories the spec itself names: Brain
// Gym warm-ups, Right-Brain/Intuition tasks, Visualization exercises, and
// Core Reading Intelligence modules.
//
// A few real exercises are deliberately EXCLUDED, not overlooked:
// `schulte-grid-drill` (the original engine powering the 21-Day Journey)
// has no standalone route of its own today — linking to it would be a
// dead link, so this curriculum uses `schulte-grid-speed-drill` (the
// real, routable Brain Gym suite exercise) instead, which covers the
// same skill.
export type CurriculumExerciseCategory = 'brain-gym' | 'right-brain-intuition' | 'visualization' | 'reading-intelligence'

export const CURRICULUM_EXERCISE_CATEGORIES: readonly CurriculumExerciseCategory[] = [
  'brain-gym',
  'right-brain-intuition',
  'visualization',
  'reading-intelligence',
]

export const CURRICULUM_CATEGORY_LABELS: Record<CurriculumExerciseCategory, string> = {
  'brain-gym': 'Brain Gym',
  'right-brain-intuition': 'Visual Focus / Intuition',
  visualization: 'Visualization',
  'reading-intelligence': 'Reading Intelligence',
}

export type CurriculumCatalogExercise = {
  id: string
  title: string
  href: string
  category: CurriculumExerciseCategory
}

// ---- Brain Gym (Visual Activation Suite + standalone Brain Gym configs
// + Eye Foundation Module) ----
const BRAIN_GYM_EXERCISES: readonly CurriculumCatalogExercise[] = [
  { id: 'theta-breathing-anchor', title: 'Theta Breathing & Focal Anchor', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  {
    id: 'cardinal-oculomotor-stretches',
    title: 'Cardinal Oculomotor Stretches',
    href: '/labs/sharp-brain/brain-gym',
    category: 'brain-gym',
  },
  { id: 'infinity-figure-eight-gliding', title: 'Infinity Figure-8 Gliding', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'peripheral-flash-expander', title: 'Peripheral Flash Expander', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  {
    id: 'quantum-tachistoscope-multi-word-blast',
    title: 'Tachistoscope Multi-Word Blast',
    href: '/labs/sharp-brain/brain-gym',
    category: 'brain-gym',
  },
  { id: 'aura-edge-color-pulsing', title: 'Aura Edge Color Pulsing', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'blink-trigger-micro-recall', title: 'Blink-Trigger Micro-Recall', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'tratak-afterimage-stretches', title: 'Tratak Afterimage Stretches', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'schulte-grid-speed-drill', title: 'Peripheral Vision Activator', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'rapid-visual-span-expander', title: 'Rapid Visual Span Expander', href: '/labs/sharp-brain/brain-gym', category: 'brain-gym' },
  { id: 'saccadic-eye-jump', title: 'Saccadic Eye Jump', href: '/labs/sharp-brain/saccadic-eye-jump', category: 'brain-gym' },
  { id: 'cross-lateral-tap', title: 'Cross-Lateral Tap', href: '/labs/sharp-brain/cross-lateral-tap', category: 'brain-gym' },
  { id: 'fast-pattern-blinking', title: 'Fast Pattern Blinking', href: '/labs/sharp-brain/fast-pattern-blinking', category: 'brain-gym' },
  {
    id: 'peripheral-expanding-circle',
    title: 'Peripheral Expanding Circle',
    href: '/labs/sharp-brain/peripheral-expanding-circle',
    category: 'brain-gym',
  },
  { id: 'brain-gym-circuit', title: '2-Minute Brain Gym Circuit™', href: '/labs/sharp-brain/brain-gym-circuit', category: 'brain-gym' },
]

// Eye Foundation Module™ — a real, server-enforced sequential-locking
// module (see src/features/quantum-speed-reading/eyeFoundationModule.ts):
// eye-warm-up → eye-stretch → eye-span → regression-control →
// reading-speed → rsvp, each gated behind the one before it. Listed here
// in that exact order — buildCurriculumDayPlan only ever advances through
// a phase pool in day order, so preserving this array's order is what
// keeps a learner who follows the curriculum day by day from ever hitting
// a locked screen for a prerequisite they haven't reached yet.
const EYE_FOUNDATION_EXERCISES: readonly CurriculumCatalogExercise[] = [
  { id: 'eye-warm-up', title: 'Eye Warm-up', href: '/labs/sharp-brain/eye-warm-up', category: 'brain-gym' },
  { id: 'eye-stretch', title: 'Eye Stretch', href: '/labs/sharp-brain/eye-stretch', category: 'brain-gym' },
  { id: 'eye-span', title: 'Eye Span', href: '/labs/sharp-brain/eye-span', category: 'brain-gym' },
  { id: 'regression-control', title: 'Regression Control', href: '/labs/sharp-brain/regression-control', category: 'brain-gym' },
  { id: 'reading-speed', title: 'Reading Speed', href: '/labs/sharp-brain/reading-speed', category: 'brain-gym' },
  { id: 'rsvp', title: 'RSVP', href: '/labs/sharp-brain/rsvp', category: 'brain-gym' },
]

// ---- Right-Brain / Intuition (Right Brain Hub + Intuition Hub) ----
const RIGHT_BRAIN_INTUITION_EXERCISES: readonly CurriculumCatalogExercise[] = [
  { id: 'photographic-memory', title: 'Deep Visualisation Recall™', href: '/labs/sharp-brain/visual-memory', category: 'right-brain-intuition' },
  {
    id: 'pictorial-essence-sprint',
    title: 'High-Speed Pictorial Essence Sprint™',
    href: '/labs/sharp-brain/pictorial-essence-sprint',
    category: 'right-brain-intuition',
  },
  {
    id: 'hemispheric-color-sync',
    title: 'Color-Word Sync Grid',
    href: '/labs/sharp-brain/color-word-sync',
    category: 'right-brain-intuition',
  },
  {
    id: 'after-image-gazing',
    title: 'After-Image / Complementary Color Gazing™',
    href: '/labs/sharp-brain/after-image-gazing',
    category: 'right-brain-intuition',
  },
  { id: 'dot-memory-grid', title: 'Dot Memory Grid™', href: '/labs/sharp-brain/dot-memory-grid', category: 'right-brain-intuition' },
  { id: 'number-flash-grid', title: 'Number Flash Grid™', href: '/labs/sharp-brain/number-flash-grid', category: 'right-brain-intuition' },
  { id: 'word-flash-grid', title: 'Word Flash Grid™', href: '/labs/sharp-brain/word-flash-grid', category: 'right-brain-intuition' },
  { id: 'image-flash-grid', title: 'Image Flash Grid™', href: '/labs/sharp-brain/image-flash-grid', category: 'right-brain-intuition' },
  {
    id: 'esp-zener-telepathy-sprint',
    title: 'Zener Card Attention Sprint',
    href: '/labs/sharp-brain/zener-intuition',
    category: 'right-brain-intuition',
  },
  {
    id: 'quantum-hidden-target-grid',
    title: 'Hidden Target Grid',
    href: '/labs/sharp-brain/hidden-target-grid',
    category: 'right-brain-intuition',
  },
]

// ---- Visualization (Visualization Hub) ----
const VISUALIZATION_EXERCISES: readonly CurriculumCatalogExercise[] = [
  {
    id: 'quantum-mental-rotation',
    title: 'Mental Object Rotation',
    href: '/labs/sharp-brain/mental-rotation',
    category: 'visualization',
  },
  {
    id: 'color-scene-transformation',
    title: 'Color & Scene Transformation Journey™',
    href: '/labs/sharp-brain/color-scene-transformation',
    category: 'visualization',
  },
  {
    id: 'sensory-hologram-builder',
    title: 'Sensory Imagery Builder',
    href: '/labs/sharp-brain/sensory-hologram-builder',
    category: 'visualization',
  },
  { id: 'fluid-energy-balancer', title: 'Calm Breath Balance', href: '/labs/sharp-brain/fluid-energy-balancer', category: 'visualization' },
]

// ---- Core Reading Intelligence (Reading Hub + orphaned standalone) ----
const READING_HUB_EXERCISES: readonly CurriculumCatalogExercise[] = [
  {
    id: 'dynamic-chunk-sliding',
    title: 'Dynamic Chunk Sliding™',
    href: '/labs/sharp-brain/dynamic-chunk-sliding',
    category: 'reading-intelligence',
  },
  {
    id: 'vertical-chunk-sliding',
    title: 'Vertical Chunk Sliding™',
    href: '/labs/sharp-brain/vertical-chunk-sliding',
    category: 'reading-intelligence',
  },
  {
    id: 'flash-recall-sprint',
    title: 'Flash Recall & Retention Sprint™',
    href: '/labs/sharp-brain/flash-recall-sprint',
    category: 'reading-intelligence',
  },
  {
    id: 'vertical-flash-recall',
    title: 'Vertical Flash Recall & Retention Sprint™',
    href: '/labs/sharp-brain/vertical-flash-recall',
    category: 'reading-intelligence',
  },
  {
    id: 'vertical-word-reading',
    title: 'Vertical Word Reading™',
    href: '/labs/sharp-brain/vertical-word-reading',
    category: 'reading-intelligence',
  },
  { id: 'phrase-reading-mode', title: 'Phrase Reading™', href: '/labs/sharp-brain/phrase-reading-mode', category: 'reading-intelligence' },
  {
    id: 'sentence-reading-mode',
    title: 'Sentence Reading™',
    href: '/labs/sharp-brain/sentence-reading-mode',
    category: 'reading-intelligence',
  },
  {
    id: 'paragraph-reading-mode',
    title: 'Paragraph Reading™',
    href: '/labs/sharp-brain/paragraph-reading-mode',
    category: 'reading-intelligence',
  },
  {
    id: 'guided-paragraph-reading-mode',
    title: 'Guided Paragraph Reading™',
    href: '/labs/sharp-brain/guided-paragraph-reading-mode',
    category: 'reading-intelligence',
  },
  {
    id: 'subvocalization-destroyer',
    title: 'Inner Voice Control™',
    href: '/labs/sharp-brain/subvocalization-destroyer',
    category: 'reading-intelligence',
  },
  {
    id: 'photographic-reading',
    title: 'Visual Memory Reading',
    href: '/labs/sharp-brain/visual-reading',
    category: 'reading-intelligence',
  },
  {
    id: 'dual-stream-split-reader',
    title: 'Dual-Stream Split Reader™',
    href: '/labs/sharp-brain/dual-stream-split-reader',
    category: 'reading-intelligence',
  },
]

// Reading Expansion Module™ — real, server-enforced sequential order:
// phrase-reading → multi-line-reading → sentence-reading →
// paragraph-reading (see readingExpansionModule.ts). Listed in that exact
// order for the same reason as EYE_FOUNDATION_EXERCISES above.
const READING_EXPANSION_EXERCISES: readonly CurriculumCatalogExercise[] = [
  { id: 'phrase-reading', title: 'Phrase Reading (Idea Recognition)', href: '/labs/sharp-brain/phrase-reading', category: 'reading-intelligence' },
  { id: 'multi-line-reading', title: 'Multi-Line Reading', href: '/labs/sharp-brain/multi-line-reading', category: 'reading-intelligence' },
  { id: 'sentence-reading', title: 'Sentence Reading (Idea Recognition)', href: '/labs/sharp-brain/sentence-reading', category: 'reading-intelligence' },
  {
    id: 'paragraph-reading',
    title: 'Paragraph Reading (Meaning Block Recognition™)',
    href: '/labs/sharp-brain/paragraph-reading',
    category: 'reading-intelligence',
  },
]

// Flash Intelligence Pack™ — real, server-enforced sequential order:
// word-flash → number-flash → symbol-flash → mixed-flash →
// peripheral-flash (see flashIntelligenceModule.ts). Same ordering
// discipline as above.
const FLASH_INTELLIGENCE_EXERCISES: readonly CurriculumCatalogExercise[] = [
  { id: 'word-flash', title: 'Rapid Recognition Drill', href: '/labs/sharp-brain/word-flash', category: 'reading-intelligence' },
  { id: 'number-flash', title: 'Number Flash', href: '/labs/sharp-brain/number-flash', category: 'reading-intelligence' },
  { id: 'symbol-flash', title: 'Symbol Flash', href: '/labs/sharp-brain/symbol-flash', category: 'reading-intelligence' },
  { id: 'mixed-flash', title: 'Mixed Flash', href: '/labs/sharp-brain/mixed-flash', category: 'reading-intelligence' },
  { id: 'peripheral-flash', title: 'Peripheral Flash', href: '/labs/sharp-brain/peripheral-flash', category: 'reading-intelligence' },
]

const PROGRESSIVE_CHUNK_READING: CurriculumCatalogExercise = {
  id: 'progressive-chunk-reading',
  title: 'Progressive Chunk Reading',
  href: '/labs/sharp-brain/progressive-chunk-reading',
  category: 'reading-intelligence',
}

export const CURRICULUM_EXERCISE_CATALOG: readonly CurriculumCatalogExercise[] = [
  ...BRAIN_GYM_EXERCISES,
  ...EYE_FOUNDATION_EXERCISES,
  ...RIGHT_BRAIN_INTUITION_EXERCISES,
  ...VISUALIZATION_EXERCISES,
  ...READING_HUB_EXERCISES,
  ...READING_EXPANSION_EXERCISES,
  ...FLASH_INTELLIGENCE_EXERCISES,
  PROGRESSIVE_CHUNK_READING,
]

export const TOTAL_CURRICULUM_CATALOG_EXERCISES = CURRICULUM_EXERCISE_CATALOG.length

export function getCurriculumExerciseById(id: string): CurriculumCatalogExercise | undefined {
  return CURRICULUM_EXERCISE_CATALOG.find((exercise) => exercise.id === id)
}

// ---- Phase-scoped pools (own module, re-exported for curriculumDatabase.ts) ----
// Exported individually (rather than just the flat catalog above) since
// buildCurriculumDayPlan needs each phase's own curated, gating-safe
// subset — see curriculumDatabase.ts's own doc comment for the full
// rationale on why phases 1-3 deliberately exclude every sequentially-
// gated module exercise, leaving Phase 4 as the guaranteed completion
// pass across the whole catalog.
export const BRAIN_GYM_FREE_POOL = BRAIN_GYM_EXERCISES
export const EYE_FOUNDATION_POOL = EYE_FOUNDATION_EXERCISES
export const RIGHT_BRAIN_INTUITION_POOL = RIGHT_BRAIN_INTUITION_EXERCISES
export const VISUALIZATION_POOL = VISUALIZATION_EXERCISES
export const READING_HUB_POOL = READING_HUB_EXERCISES
export const READING_EXPANSION_POOL = READING_EXPANSION_EXERCISES
export const FLASH_INTELLIGENCE_POOL = FLASH_INTELLIGENCE_EXERCISES
export const READING_ORPHAN_POOL: readonly CurriculumCatalogExercise[] = [PROGRESSIVE_CHUNK_READING]
