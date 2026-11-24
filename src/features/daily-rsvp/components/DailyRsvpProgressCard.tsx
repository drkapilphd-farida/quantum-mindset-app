import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { getAppT, getPracticeContentLang } from '@/lib/app-i18n/server'
import { getDailyRsvpState } from '../actions'
import { dailyRsvpGrowth } from '../dailyRsvp'
import { DailyRsvpChart } from './DailyRsvpChart'

// Daily Speed Read progress (founder, 23 Nov 2026): on the student dashboard
// and the 30-day plan page — how much the reading speed has grown since the
// first day, the latest day's speed and retention, and the day-by-day chart.
export async function DailyRsvpProgressCard({ showPlanLink = false }: { showPlanLink?: boolean }): Promise<React.JSX.Element> {
  const [{ t }, contentLang] = await Promise.all([getAppT(), getPracticeContentLang('dailyRsvp')])
  const state = await getDailyRsvpState(contentLang === 'hi' ? 'hi' : 'en', null)
  const growth = dailyRsvpGrowth(state.history)
  const latest = state.history.at(-1)

  return (
    <section className="glass-premium-card flex flex-col gap-3 p-5" data-daily-rsvp-card={state.history.length}>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TrendingUp className="size-5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-foreground">{t('training.dailyRsvp.cardTitle')}</h2>
      </div>

      {growth === null || latest === undefined ? (
        <p className="text-sm text-muted-foreground">{t('training.dailyRsvp.cardEmpty')}</p>
      ) : (
        <>
          <p className="font-heading text-2xl font-bold tabular-nums text-foreground" data-rsvp-growth={growth.wpmGain}>
            {growth.firstWpm} → {growth.latestWpm} <span className="text-sm font-semibold text-muted-foreground">{t('training.dailyRsvp.wpm')}</span>
          </p>
          {growth.firstDay !== growth.latestDay && (
            <p className="text-sm font-semibold text-foreground">
              {growth.wpmGain > 0
                ? t('training.dailyRsvp.growthUp', { diff: growth.wpmGain, pct: growth.wpmGainPercent, day: growth.firstDay })
                : growth.wpmGain < 0
                  ? t('training.dailyRsvp.growthDown', { diff: -growth.wpmGain, day: growth.firstDay })
                  : t('training.dailyRsvp.growthSame', { day: growth.firstDay })}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{t('training.dailyRsvp.cardLatest', { day: latest.day, wpm: latest.wpm, retention: latest.retentionPercent })}</p>
          <DailyRsvpChart history={state.history} />
        </>
      )}

      {showPlanLink && (
        <Link href="/labs/sharp-brain/thirty-day-curriculum" className="text-sm font-semibold text-primary hover:underline">
          {t('training.dailyRsvp.cardOpenPlan')} →
        </Link>
      )}
    </section>
  )
}
