import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { AcronymExperience } from '@/features/memory-studio/components/AcronymExperience'

export const metadata: Metadata = { title: 'Acronyms — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function AcronymsPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Acronyms" />
  return (
    <>
      <AcronymExperience />
    </>
  )
}
