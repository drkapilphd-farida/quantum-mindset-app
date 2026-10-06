import type { Metadata } from 'next'
import { PeripheralFlashGlimpse } from '@/features/exercise-core/components/GlimpseExperiences'

export const metadata: Metadata = {
  title: 'Peripheral Flash — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function Page(): React.JSX.Element {
  return <PeripheralFlashGlimpse />
}
