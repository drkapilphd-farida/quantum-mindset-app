import type { Metadata } from 'next'
import { BlinkRecallGlimpse } from '@/features/exercise-core/components/GlimpseExperiences'

export const metadata: Metadata = {
  title: 'Blink Recall — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function Page(): React.JSX.Element {
  return <BlinkRecallGlimpse />
}
