'use client'

import type { ParagraphReadingModeQuizQuestion } from '../paragraphReadingModeDataset'
import { ComprehensionQuiz } from '@/components/play/ComprehensionQuiz'

// The comprehension check of this reading drill — the shared play-design quiz
// (translated, "Brilliant!" / "Almost there", stars).
export function ParagraphReadingModeQuiz(props: { questions: readonly ParagraphReadingModeQuizQuestion[]; categoryLabel: string; onComplete: (score: number) => void; onExit: () => void }): React.JSX.Element {
  return <ComprehensionQuiz {...props} />
}
