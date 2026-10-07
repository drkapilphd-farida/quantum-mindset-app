import type { Metadata } from 'next'
import { FocusWarmupsHub } from '@/features/exercise-core/components/FocusWarmupsHub'

export const metadata: Metadata = {
  title: 'Focus Warm-ups — Sharp Brain Lab',
  description: 'Short focus warm-ups before reading practice.',
  robots: { index: false, follow: false },
}

// Focus Warm-ups (route kept as /brain-gym so old links still work) — a menu
// of the current warm-ups; every entry plays the current version.
export default function FocusWarmupsPage(): React.JSX.Element {
  return <FocusWarmupsHub />
}
