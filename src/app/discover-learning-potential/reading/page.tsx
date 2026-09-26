import type { Metadata } from 'next'
import { ReadingDiscoveryExperience } from './components/ReadingDiscoveryExperience'
import { brand } from '@/config/site.config'

export const metadata: Metadata = {
  title: `Reading Discovery™ — ${brand.name}`,
  description: "Let's discover how you naturally read. There are no right or wrong answers — simply read the way you normally do.",
}

// Sprint-2 — Reading Discovery™. An observation-only experience, not an
// assessment: one reading task per screen, no scores, no timers, no
// progress percentages.
export default function ReadingDiscoveryPage(): React.JSX.Element {
  return <ReadingDiscoveryExperience />
}
