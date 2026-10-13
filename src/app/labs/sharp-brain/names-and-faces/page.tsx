import type { Metadata } from 'next'
import { PlayScope } from '@/components/PlayScope'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { NameFaceExperience } from '@/features/memory-studio/components/NameFaceExperience'

export const metadata: Metadata = { title: 'Names and faces — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function NamesAndFacesPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Names and faces" />
  return (
    <PlayScope className="min-h-dvh">
      <NameFaceExperience />
    </PlayScope>
  )
}
