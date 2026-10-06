import type { Metadata } from 'next'
import { CrossLateralTapExperience } from '@/features/brain-gym/components/CrossLateralTapExperience'

export const metadata: Metadata = {
  title: 'Cross-Lateral Tap™ — Sharp Brain Lab',
  description: 'A side lights up — tap the opposite side. It trains you to hold back the first impulse and respond correctly.',
  robots: { index: false, follow: false },
}

export default function CrossLateralTapPage(): React.JSX.Element {
  return <CrossLateralTapExperience />
}
