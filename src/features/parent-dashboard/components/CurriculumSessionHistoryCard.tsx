import { formatRelativeDate } from '@/lib/formatRelativeDate'
import { relativeDate } from '@/lib/app-i18n/format'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { getAppT } from '@/lib/app-i18n/server'
import type { CurriculumDayCompletionRecord } from '@/features/thirty-day-curriculum/actions/getCurriculumDayCompletions'

type CurriculumSessionHistoryCardProps = {
  completions: readonly CurriculumDayCompletionRecord[]
}

const HISTORY_LIMIT = 10

// Two-Pillar Simplification™ — the real, per-day record behind "Daily
// Curriculum Progress" above: which days actually happened, when, and
// (for checkpoint days 1/7/14/21/30) the real measured WPM/comprehension.
// Regular days have no per-day WPM/comprehension measurement — the
// 30-Day Masterclass only assesses on checkpoint days — so those rows
// show completion only, never a fabricated number.
export async function CurriculumSessionHistoryCard({ completions }: CurriculumSessionHistoryCardProps): Promise<React.JSX.Element> {
  const { lang, t } = await getAppT()
  const recent = [...completions].sort((a, b) => b.day - a.day).slice(0, HISTORY_LIMIT)

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('progress.parent.sessionHistory')}</p>

      {recent.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t('progress.parent.noSessions')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recent.map((completion) => (
            <li key={completion.day} className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{t('progress.parent.dayN', { day: completion.day })}</p>
                <p className="text-xs text-muted-foreground">{lang === 'en' ? formatRelativeDate(completion.completedAt) : relativeDate(completion.completedAt, LANGUAGES[lang].htmlLang)}</p>
              </div>
              {completion.trueWpm !== null && completion.comprehensionAccuracyPercent !== null ? (
                <p className="shrink-0 text-right text-xs font-medium text-foreground">
                  {completion.trueWpm} WPM · {completion.comprehensionAccuracyPercent}% comprehension
                </p>
              ) : (
                <p className="shrink-0 text-xs text-muted-foreground">{t('progress.parent.completed')}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
