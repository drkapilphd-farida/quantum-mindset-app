import type { Metadata } from 'next'
import { ProLockedScreen } from '@/components/exercises/ProLockedScreen'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getReviewSession } from '@/features/memory-studio/actions'
import { ReviewSession } from '@/features/memory-studio/components/ReviewSession'

export const metadata: Metadata = { title: 'Review — Sharp Brain Lab', robots: { index: false, follow: false } }
// Due cards change every day; never serve a stale review.
export const dynamic = 'force-dynamic'

export default async function ReviewPage(): Promise<React.JSX.Element> {
  if (!(await hasQuantumSpeedReadingProAccess())) return <ProLockedScreen title="Review" />
  return <ReviewSession cards={await getReviewSession()} />
}
