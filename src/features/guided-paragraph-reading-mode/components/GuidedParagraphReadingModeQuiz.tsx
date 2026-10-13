'use client'

import type { GuidedParagraphReadingModeQuizQuestion } from '../guidedParagraphReadingModeDataset'
import { ComprehensionQuiz } from '@/components/play/ComprehensionQuiz'

// The comprehension check of this reading drill — the shared play-design quiz
// (translated, "Brilliant!" / "Almost there", stars).
export function GuidedParagraphReadingModeQuiz(props: { questions: readonly GuidedParagraphReadingModeQuizQuestion[]; categoryLabel: string; onComplete: (score: number) => void; onExit: () => void }): React.JSX.Element {
  return <ComprehensionQuiz {...props} />
}
