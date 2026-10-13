import type { Metadata } from 'next'
import { PlayScope } from '@/components/PlayScope'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { MemoryStudioHub } from '@/features/memory-studio/components/MemoryStudioHub'

export const metadata: Metadata = { title: 'Memory Studio — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function MemoryStudioPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Memory Studio" />
  return (
    <PlayScope className="-mx-4 -my-6 min-h-[calc(100dvh-3.5rem)] px-4 py-6 sm:-mx-6 sm:px-6">
      <MemoryStudioHub />
    </PlayScope>
  )
}
