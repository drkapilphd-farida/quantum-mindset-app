import { CalendarClock, Video } from 'lucide-react'
import type { ActiveMasterclass } from '../queries/getActiveMasterclasses'
import { getAppT } from '@/lib/app-i18n/server'
import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'

type UpcomingCohortScheduleProps = {
  sessions: readonly ActiveMasterclass[]
}

function formatSessionDate(scheduledAt: string, lang: AppLang): string {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-IN' : LANGUAGES[lang].htmlLang, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  }).format(new Date(scheduledAt))
}

// Live Member Training Hub™ — real, admin-authored upcoming sessions from
// the `masterclasses` table. No countdown timer, no fabricated seat
// count — just the real date and, once set, the real join link. When
// nothing is scheduled, this renders a plain, honest empty state, never
// a sales pitch to fill the gap.
export async function UpcomingCohortSchedule({ sessions }: UpcomingCohortScheduleProps): Promise<React.JSX.Element> {
  const { t, lang } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('dashboard.liveClasses.next')}</p>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t('dashboard.liveClasses.none')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sessions.map((session) => (
            <li key={session.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{session.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{session.description}</p>
                </div>
                {session.joinUrl !== null && (
                  <a
                    href={session.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/[0.12]"
                  >
                    <Video className="size-3.5" aria-hidden="true" />
                    {t('dashboard.liveClasses.join')}
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="size-3.5" aria-hidden="true" />
                  {session.scheduledAt === null ? t('dashboard.liveClasses.dateTba') : formatSessionDate(session.scheduledAt, lang)}
                </span>
                <span>{t('dashboard.liveClasses.withMentor', { name: session.mentorName })}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
