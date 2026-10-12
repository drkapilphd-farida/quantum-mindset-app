import Link from 'next/link'
import { RefreshCcw } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import { getReviewSummary } from '../actions'

export const REVIEW_ROUTE = '/labs/sharp-brain/review'

// Dashboard: today's review, only when something is due (about 5 minutes at most).
export async function ReviewDueCard(): Promise<React.JSX.Element | null> {
  const [{ t }, summary] = await Promise.all([getAppT(), getReviewSummary()])
  if (summary === null) return null
  return (
    <Link href={REVIEW_ROUTE} className="flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-4" data-review-due-card={summary.due}>
      <RefreshCcw className="size-6 shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground">{t('training.studio.reviewCardTitle')}</span>
        <span className="block text-sm text-muted-foreground">{t('training.studio.reviewDue', { count: summary.due, minutes: summary.minutes })}</span>
      </span>
      <span className="text-sm font-semibold text-primary">{t('training.studio.reviewStart')}</span>
    </Link>
  )
}
