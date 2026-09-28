import type { Metadata } from 'next'
import { PictorialEssenceSprintExperience } from '@/features/pictorial-essence-sprint/components/PictorialEssenceSprintExperience'

export const metadata: Metadata = {
  title: 'High-Speed Pictorial Essence Sprint — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

// High-Speed Pictorial Essence Sprint™ — the second Right Brain
// Activation exercise, alongside Photographic Memory™. Deliberately its
// own route/folder, no collision with any existing V1 or V2 route.
export default function PictorialEssenceSprintPage(): React.JSX.Element {
  return <PictorialEssenceSprintExperience />
}
