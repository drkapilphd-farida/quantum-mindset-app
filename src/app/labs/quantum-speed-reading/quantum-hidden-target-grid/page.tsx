import type { Metadata } from 'next'
import { QuantumHiddenTargetGridExperience } from '@/features/quantum-hidden-target-grid/components/QuantumHiddenTargetGridExperience'

export const metadata: Metadata = {
  title: 'Quantum Hidden Target Grid — Quantum Speed Reading Lab™',
  robots: { index: false, follow: false },
}

// Quantum Hidden Target Grid™ — the second Intuition Development exercise,
// alongside ESP Zener Card Telepathy Sprint™. Deliberately its own
// route/folder, no collision with any existing V1 or V2 route.
export default function QuantumHiddenTargetGridPage(): React.JSX.Element {
  return <QuantumHiddenTargetGridExperience />
}
