'use client'

import type { FlashRecallSprintQuizQuestion } from '../dualStreamSplitReaderDataset'
import { ComprehensionQuiz } from '@/components/play/ComprehensionQuiz'

// The comprehension check of this reading drill — the shared play-design quiz
// (translated, "Brilliant!" / "Almost there", stars).
export function DualStreamSplitReaderQuiz(props: { questions: readonly FlashRecallSprintQuizQuestion[]; categoryLabel: string; onComplete: (score: number) => void; onExit: () => void }): React.JSX.Element {
  return <ComprehensionQuiz {...props} />
}
