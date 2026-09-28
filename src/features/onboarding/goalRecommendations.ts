import { CURRICULUM_EXERCISE_CATALOG, type CurriculumCatalogExercise } from '@/features/thirty-day-curriculum/curriculumExerciseCatalog'
import type { LearningFocus } from './onboardingOptions'

// Which existing exercises the dashboard puts first for each goal. Ids are
// curriculum catalog ids, so titles and links always come from the catalog.
const GOAL_EXERCISE_IDS: Record<LearningFocus, readonly string[]> = {
  focus: ['schulte-grid-speed-drill', 'cross-lateral-tap', 'brain-gym-circuit', 'regression-control'],
  memory: ['dot-memory-grid', 'number-flash-grid', 'word-flash-grid', 'photographic-memory'],
  // Exam preparation = Smart Reading + Memory.
  exam: ['sentence-reading', 'phrase-reading-mode', 'dot-memory-grid', 'word-flash-grid'],
  reading: ['phrase-reading-mode', 'sentence-reading', 'multi-line-reading', 'regression-control'],
}

export function getGoalRecommendations(focus: LearningFocus): CurriculumCatalogExercise[] {
  return GOAL_EXERCISE_IDS[focus]
    .map((id) => CURRICULUM_EXERCISE_CATALOG.find((exercise) => exercise.id === id))
    .filter((exercise): exercise is CurriculumCatalogExercise => exercise !== undefined)
}

/** Goals for which the 30-day program section moves above the document tools. */
export function programFirstFor(focus: LearningFocus | null): boolean {
  return focus === 'exam' || focus === 'memory' || focus === 'reading'
}
