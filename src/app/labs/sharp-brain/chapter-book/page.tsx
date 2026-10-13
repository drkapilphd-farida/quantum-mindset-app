import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { ChapterBookExperience } from '@/features/memory-studio/components/ChapterBookExperience'

export const metadata: Metadata = { title: 'Chapter & Book — Sharp Brain Lab', robots: { index: false, follow: false } }

export default async function ChapterBookPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Chapter & Book" />
  return <ChapterBookExperience />
}
