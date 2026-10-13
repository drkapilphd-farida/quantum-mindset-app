import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { PalaceMethodExperience } from '@/features/memory-studio/components/PalaceMethodExperience'

export const metadata: Metadata = { title: 'My memory palaces — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function MyPalacesPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="My memory palaces" />
  return <PalaceMethodExperience />
}
