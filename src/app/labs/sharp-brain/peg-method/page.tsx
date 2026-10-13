import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { PegMethodExperience } from '@/features/memory-studio/components/PegMethodExperience'

export const metadata: Metadata = { title: 'Peg method — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function PegMethodPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Peg method" />
  return (
    <>
      <PegMethodExperience />
    </>
  )
}
