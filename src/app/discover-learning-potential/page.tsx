import type { Metadata } from 'next'
import { Hero } from './components/Hero'
import { DiscoveryPreview } from './components/DiscoveryPreview'
import { JourneyPreview } from './components/JourneyPreview'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/discover-learning-potential',
  title: 'Discover Your Learning Potential™ — Mind Ur Mind',
  description: 'Discover how you or your child naturally learns — and where improvement is possible. A free, guided 5-minute assessment covering reading, memory, and focus.',
})

// Discover Your Learning Potential™ — Sprint-1. The new official entry
// experience, built from scratch. No navigation, no footer, one CTA.
export default function DiscoverLearningPotentialPage(): React.JSX.Element {
  return (
    <main className="bg-background">
      <Hero />
      <DiscoveryPreview />
      <JourneyPreview />
    </main>
  )
}
