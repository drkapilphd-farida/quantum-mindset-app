'use client'

import type { SentenceReadingModeQuizQuestion } from '../sentenceReadingModeDataset'
import { ComprehensionQuiz } from '@/components/play/ComprehensionQuiz'

// The comprehension check of this reading drill — the shared play-design quiz
// (translated, "Brilliant!" / "Almost there", stars).
export function SentenceReadingModeQuiz(props: { questions: readonly SentenceReadingModeQuizQuestion[]; categoryLabel: string; onComplete: (score: number) => void; onExit: () => void }): React.JSX.Element {
  return <ComprehensionQuiz {...props} />
}
