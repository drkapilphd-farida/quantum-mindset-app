import type { Metadata } from 'next'
import { PlayScope } from '@/components/PlayScope'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { StoryMethodExperience } from '@/features/memory-studio/components/StoryMethodExperience'

export const metadata: Metadata = { title: 'Story method — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function StoryMethodPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Story method" />
  return (
    <PlayScope className="min-h-dvh">
      <StoryMethodExperience />
    </PlayScope>
  )
}
