import type { Metadata } from 'next'
import { LearningPotentialRevealExperience } from './components/LearningPotentialRevealExperience'
import { brand } from '@/config/site.config'

export const metadata: Metadata = {
  title: `Your Learning Potential — ${brand.name}`,
  description: 'The path from your Discovery results to your personalized AI Learning Studio journey.',
}

// Learning Potential Reveal™ (UDCE-1) — the emotional bridge between
// Brain Discovery™ (Reading/Memory/Focus Discovery + AI Profile) and AI
// Learning Studio™. Reachable the same way its four siblings are (no
// sign-in required to feel the moment) — the real sign-in gate still
// lives at `/preview`'s own protected layout, unchanged by this screen.
export default function LearningPotentialPage(): React.JSX.Element {
  return <LearningPotentialRevealExperience />
}
