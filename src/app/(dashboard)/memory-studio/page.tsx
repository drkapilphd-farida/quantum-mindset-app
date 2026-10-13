import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { MemoryStudioHub } from '@/features/memory-studio/components/MemoryStudioHub'

export const metadata: Metadata = { title: 'Memory Studio — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function MemoryStudioPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Memory Studio" />
  return (
    <>
      <MemoryStudioHub />
    </>
  )
}
