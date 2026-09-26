import type { Metadata } from 'next'
import { CrossLateralTapExperience } from '@/features/brain-gym/components/CrossLateralTapExperience'

export const metadata: Metadata = {
  title: 'Cross-Lateral Tap™ — Quantum Speed Reading Lab™',
  description: 'A side lights up — tap the opposite side. A classic cross-body Brain Gym drill for whole-brain coordination.',
  robots: { index: false, follow: false },
}

export default function CrossLateralTapPage(): React.JSX.Element {
  return <CrossLateralTapExperience />
}
