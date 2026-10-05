import { CheckCircle2, Circle } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import { formatDurationLabel } from '@/lib/exercises/practiceHistory'

type TodaysStatusCardProps = {
  practicedToday: boolean
  minutesSpentMs: number
}

// Section 1 — Today's Status: the single most immediate question a
// parent opens this dashboard to answer. Real data from practice_sessions
// (see ParentDashboard.tsx), not a fabricated streak-style nudge.
export async function TodaysStatusCard({ practicedToday, minutesSpentMs }: TodaysStatusCardProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t('progress.parent.todaysStatus')}</p>
      <div className="mt-4 flex items-center gap-3">
        {practicedToday ? (
          <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
        ) : (
          <Circle className="size-6 text-muted-foreground/40" aria-hidden="true" />
        )}
        <div>
          <p className="text-lg font-semibold text-foreground">{practicedToday ? t('progress.parent.practicedToday') : t('progress.parent.noPracticeToday')}</p>
          <p className="text-sm text-muted-foreground">{practicedToday ? `${formatDurationLabel(minutesSpentMs)} spent practicing` : 'A few minutes today keeps the streak going.'}</p>
        </div>
      </div>
    </div>
  )
}
