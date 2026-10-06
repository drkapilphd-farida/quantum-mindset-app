import type { Metadata } from 'next'
import { RapidVisualSpanGlimpse } from '@/features/exercise-core/components/GlimpseExperiences'

export const metadata: Metadata = {
  title: 'Rapid Visual Span — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function Page(): React.JSX.Element {
  return <RapidVisualSpanGlimpse />
}
