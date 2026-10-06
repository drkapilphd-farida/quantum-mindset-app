import type { Metadata } from 'next'
import { MultiWordFlashGlimpse } from '@/features/exercise-core/components/GlimpseExperiences'

export const metadata: Metadata = {
  title: 'Multi-Word Flash — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function Page(): React.JSX.Element {
  return <MultiWordFlashGlimpse />
}
