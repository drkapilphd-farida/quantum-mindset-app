import { GraduationCap } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import type { CurriculumDayCompletionRecord } from '@/features/thirty-day-curriculum/actions/getCurriculumDayCompletions'
import { programs } from '@/config/site.config'

const TOTAL_CURRICULUM_DAYS = 30

type CurriculumProgressCardProps = {
  completions: readonly CurriculumDayCompletionRecord[]
}

// Two-Pillar Simplification™ — real 30-Day Masterclass progress, sourced
// from curriculum_day_completions (see completeCurriculumDay.ts),
// not the student's own localStorage — the only way this can be visible
// server-side to a parent checking from a different device.
export async function CurriculumProgressCard({ completions }: CurriculumProgressCardProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  const daysCompleted = completions.length
  const consistencyPercent = Math.round((daysCompleted / TOTAL_CURRICULUM_DAYS) * 100)
  const highestDay = completions.reduce((max, completion) => Math.max(max, completion.day), 0)
  const currentDay = Math.min(highestDay + 1, TOTAL_CURRICULUM_DAYS)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('progress.parent.curriculumProgress')}</p>

      {daysCompleted === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t('progress.parent.noDays', { program: programs.sharpBrain.shortName })}</p>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/[0.08]">
              <GraduationCap className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {daysCompleted}
                  <span className="text-sm font-medium text-muted-foreground"> / {TOTAL_CURRICULUM_DAYS}</span>
                </p>
                <p className="text-xs text-muted-foreground">{t('progress.parent.daysCompleted')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{consistencyPercent}%</p>
                <p className="text-xs text-muted-foreground">{t('progress.parent.consistency')}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${consistencyPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t('progress.parent.currentlyOnDay', { day: currentDay, total: TOTAL_CURRICULUM_DAYS })}</p>
        </>
      )}
    </div>
  )
}
