import type { Metadata } from 'next'
import { WhoIsLearningScreen } from './components/WhoIsLearningScreen'
import { brand } from '@/config/site.config'

export const metadata: Metadata = {
  title: `Who Are You Learning With Today? — ${brand.name}`,
  description: 'One quick question before we begin discovering how you naturally learn.',
}

// Discover Your Learning Potential™ — Sprint-1 Foundation. The locked
// entry sequence's second screen, between Hero and Reading Discovery™.
// No forms, no additional onboarding — one binary real choice.
export default function WhoIsLearningPage(): React.JSX.Element {
  return <WhoIsLearningScreen />
}
