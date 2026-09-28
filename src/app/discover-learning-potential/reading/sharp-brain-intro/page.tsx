import type { Metadata } from 'next'
import { Suspense } from 'react'
import { QuantumSpeedReadingIntroExperience } from './components/QuantumSpeedReadingIntroExperience'
import { brand } from '@/config/site.config'

export const metadata: Metadata = {
  title: `Sharp Brain™ — ${brand.name}`,
  description: 'A motivational bridge from Reading Discovery into your Sharp Brain™ journey.',
}

// Sprint-2.5 FIX-08 — a real, dedicated placeholder screen (per your own
// explicit direction: never a redirect to Upload, never an auto-created
// Learning Project). `useSearchParams` requires a Suspense boundary at
// the page level in the App Router.
export default function QuantumSpeedReadingIntroPage(): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <QuantumSpeedReadingIntroExperience />
    </Suspense>
  )
}
