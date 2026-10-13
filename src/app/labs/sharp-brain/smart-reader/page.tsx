import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { SmartReaderLibrary } from '@/features/smart-reader/components/SmartReaderLibrary'

export const metadata: Metadata = { title: 'Smart Reader — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function SmartReaderPage({ searchParams }: { searchParams: Promise<{ p?: string }> }): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Smart Reader" />
  const { p } = await searchParams
  return (
    <>
      <SmartReaderLibrary initialPassage={typeof p === 'string' ? p.slice(0, 60) : null} />
    </>
  )
}
