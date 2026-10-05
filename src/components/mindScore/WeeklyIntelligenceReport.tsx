import { cn } from '@/lib/utils'
import { translateLabel } from '@/lib/app-i18n/translate'
import { getAppT } from '@/lib/app-i18n/server'

export type WeeklyDimensionEntry = {
  id: string
  label: string
  score: number | null // null = not yet attempted
  trend: 'up' | 'down' | 'stable' | null // null = no trend signal tracked for this dimension
}

type WeeklyIntelligenceReportProps = {
  dimensions: readonly WeeklyDimensionEntry[]
  overallGrowth: 'Excellent' | 'Good' | 'Steady' | 'Recovering' | 'Beginning'
}

const TREND_ICON: Record<'up' | 'down' | 'stable' | 'inactive', string> = { up: '↑', down: '↓', stable: '→', inactive: '—' }
const TREND_COLOR: Record<'up' | 'down' | 'stable' | 'inactive', string> = {
  up: 'text-success',
  down: 'text-destructive',
  stable: 'text-muted-foreground',
  inactive: 'text-muted-foreground/40',
}

// Every dimension here is real — the same six scores DimensionScoreGrid
// shows above, just as a compact weekly-trend strip. A dimension with no
// score yet reads as an honest "—" (not yet attempted), never a
// greyed-out "Coming soon" placeholder.
export async function WeeklyIntelligenceReport({ dimensions, overallGrowth }: WeeklyIntelligenceReportProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="glass-premium-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Weekly Intelligence Report™
        </p>
        <span className={cn(
          'text-xs font-semibold',
          overallGrowth === 'Excellent' || overallGrowth === 'Good' ? 'text-success' :
          overallGrowth === 'Recovering' ? 'text-destructive' : 'text-muted-foreground',
        )}>
          {t('progress.overallGrowth', { label: translateLabel(t, overallGrowth) })}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {dimensions.map((dim) => {
          const trendKey = dim.score === null ? 'inactive' : (dim.trend ?? 'stable')
          return (
            <div
              key={dim.id}
              className={cn(
                'flex flex-col items-center rounded-xl px-2 py-3',
                dim.score !== null ? 'bg-foreground/[0.03] ring-1 ring-border' : 'bg-muted/20',
              )}
              aria-label={dim.score !== null ? t('progress.weeklyAria', { label: translateLabel(t, dim.label), score: dim.score, trend: t(`progress.trend.${trendKey}`) }) : t('progress.notAttempted', { label: translateLabel(t, dim.label) })}
            >
              <span className={cn('text-xl font-bold', TREND_COLOR[trendKey])} aria-hidden="true">
                {TREND_ICON[trendKey]}
              </span>
              <span className="mt-1 text-center text-[10px] leading-tight font-medium text-muted-foreground">{translateLabel(t, dim.label)}</span>
              {dim.score !== null && <span className="text-[10px] tabular-nums text-foreground/60">{dim.score}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
