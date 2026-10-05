import { Flame } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'

type ConsistencyCardProps = {
  currentStreak: number
  bestStreak: number
}

// Section 4 — Consistency: currentStreak/bestStreak come straight from
// computeDailyStreak (src/lib/exercises/practiceHistory.ts), the same
// function already powering the main dashboard's streak display — no
// separate streak logic invented for this page.
export async function ConsistencyCard({ currentStreak, bestStreak }: ConsistencyCardProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{t('progress.parent.consistency')}</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/[0.08]">
          <Flame className={currentStreak > 0 ? 'size-6 text-warning' : 'size-6 text-muted-foreground/40'} aria-hidden="true" />
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">{t('progress.parent.currentStreak')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{bestStreak}</p>
            <p className="text-xs text-muted-foreground">{t('progress.parent.longestStreak')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
