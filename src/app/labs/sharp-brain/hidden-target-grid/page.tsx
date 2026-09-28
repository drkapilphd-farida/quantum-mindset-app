import type { Metadata } from 'next'
import { QuantumHiddenTargetGridExperience } from '@/features/quantum-hidden-target-grid/components/QuantumHiddenTargetGridExperience'

export const metadata: Metadata = {
  title: 'Hidden Target Grid — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

// Quantum Hidden Target Grid™ — the second Intuition Development exercise,
// alongside ESP Zener Card Telepathy Sprint™. Deliberately its own
// route/folder, no collision with any existing V1 or V2 route.
export default function QuantumHiddenTargetGridPage(): React.JSX.Element {
  return <QuantumHiddenTargetGridExperience />
}
