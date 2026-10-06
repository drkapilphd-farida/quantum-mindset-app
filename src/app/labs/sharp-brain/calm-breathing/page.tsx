import type { Metadata } from 'next'
import { CalmBreathingExperience } from '@/features/calm-breathing/components/CalmBreathingExperience'

export const metadata: Metadata = {
  title: 'Calm Breathing — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function CalmBreathingPage(): React.JSX.Element {
  return <CalmBreathingExperience />
}
