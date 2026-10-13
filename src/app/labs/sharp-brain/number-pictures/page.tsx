import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { NumberCodeExperience } from '@/features/memory-studio/components/NumberCodeExperience'

export const metadata: Metadata = { title: 'Number pictures — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function NumberPicturesPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Number pictures" />
  return <NumberCodeExperience />
}
