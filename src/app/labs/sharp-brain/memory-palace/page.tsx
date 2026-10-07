import type { Metadata } from 'next'
import { MemoryPalaceExperience } from '@/features/memory-palace/components/MemoryPalaceExperience'

export const metadata: Metadata = {
  title: 'Memory Palace — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export default function MemoryPalacePage(): React.JSX.Element {
  return <MemoryPalaceExperience />
}
