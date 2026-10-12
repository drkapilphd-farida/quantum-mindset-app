import { saveExerciseResult } from '@/features/exercise-core/actions/exerciseResults'
import type { AppLang } from '@/lib/app-i18n/languages'

/** A non-levelled Memory Studio result (peg learning, own lists, review). Bengali is saved without content_lang (that column predates Bengali). */
export function saveSimpleResult(exerciseId: string, correct: number, total: number, durationMs: number, lang: AppLang): void {
  void saveExerciseResult({
    exerciseId,
    score: correct,
    accuracyPercent: total === 0 ? null : Math.round((correct / total) * 100),
    levelStart: null,
    levelEnd: null,
    goodRun: 0,
    poorRun: 0,
    rounds: 1,
    durationMs: Math.min(86_400_000, Math.max(0, Math.round(durationMs))),
    curriculumDay: null,
    isReplay: false,
    contentLang: lang === 'bn' ? null : lang,
    extra: { total },
  }).catch(() => undefined)
}
