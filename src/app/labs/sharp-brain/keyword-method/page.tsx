import type { Metadata } from 'next'
import { PlayScope } from '@/components/PlayScope'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { KeywordExperience } from '@/features/memory-studio/components/KeywordExperience'

export const metadata: Metadata = { title: 'Keyword method — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function KeywordMethodPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Keyword method" />
  return (
    <PlayScope className="min-h-dvh">
      <KeywordExperience />
    </PlayScope>
  )
}
