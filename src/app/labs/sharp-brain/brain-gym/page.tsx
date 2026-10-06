import type { Metadata } from 'next'
import { VisualActivationSuiteExperience } from '@/components/qsr/visual-activation/VisualActivationSuiteExperience'

export const metadata: Metadata = {
  title: 'Focus Warm-ups — Sharp Brain Lab',
  description: 'Short focus warm-ups before reading practice.',
  robots: { index: false, follow: false },
}

// Brain Gym™ — the 7-Exercise Visual Activation Suite (see
// src/components/qsr/visual-activation/), relocated here as its own
// ungated pillar alongside Reading Intelligence, Intuition Development,
// Visualization, and Right Brain Activation (see LabPillarsGrid.tsx). No
// longer a journey stage or a prerequisite for anything — the orchestrator
// component below is self-contained.
export default function BrainGymPage(): React.JSX.Element {
  return <VisualActivationSuiteExperience />
}
