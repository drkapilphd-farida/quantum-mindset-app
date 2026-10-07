import type { ExerciseSequenceItem } from '@/lib/exercises/sequence'
import { getExerciseAccess } from '@/lib/exercises/queries/getExerciseAccess'
import { FLASH_INTELLIGENCE_MODULE } from './flashIntelligenceModule'

export type WordFlashUnlock = { open: true } | { open: false; nextExercise: ExerciseSequenceItem | null }

// Word Flash opens Day 26 of the 30-day plan. It used to also require the old
// Eye Foundation module ("Reading Preparation"), which isn't in the plan, so
// learners were locked out on Day 26. Only the Flash Intelligence order
// (Word → Number → Symbol → Mixed → Peripheral) applies; the page checks paid
// access first.
export async function getWordFlashUnlock(): Promise<WordFlashUnlock> {
  const access = await getExerciseAccess('quantum-speed-reading', FLASH_INTELLIGENCE_MODULE, 'word-flash')
  return access.allowed ? { open: true } : { open: false, nextExercise: access.nextExercise }
}
