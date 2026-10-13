import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { getReviewSummary } from '../actions'

export const REVIEW_ROUTE = '/labs/sharp-brain/review'

// Today's review, only when something is due (about 5 minutes at most).
// Memory violet with white text (play design) — readable on any page.
export async function ReviewDueCard(): Promise<React.JSX.Element | null> {
  const [{ t }, summary] = await Promise.all([getAppT(), getReviewSummary()])
  if (summary === null) return null
  return (
    <Link href={REVIEW_ROUTE} className="play-card flex items-center gap-4 p-4 text-white" style={{ background: '#7c3aed' }} data-review-due-card={summary.due}>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-xl">{t('training.studio.reviewCardTitle')}</span>
        <span className="block text-sm text-white/90">{t('training.studio.reviewDue', { count: summary.due, minutes: summary.minutes })}</span>
      </span>
      <span className="rounded-xl bg-white px-4 py-2 font-heading text-lg text-[#6d28d9]">{t('training.studio.reviewStart')}</span>
    </Link>
  )
}
