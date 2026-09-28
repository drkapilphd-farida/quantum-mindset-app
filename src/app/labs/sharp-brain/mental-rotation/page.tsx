import type { Metadata } from 'next'
import { QuantumMentalRotationExperience } from '@/features/quantum-mental-rotation/components/QuantumMentalRotationExperience'

export const metadata: Metadata = {
  title: 'Mental Object Rotation — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

// Quantum Mental Object Rotation™ — the first Visualization Development
// exercise. Deliberately its own route/folder, no collision with any
// existing V1 or V2 route.
export default function QuantumMentalRotationPage(): React.JSX.Element {
  return <QuantumMentalRotationExperience />
}
