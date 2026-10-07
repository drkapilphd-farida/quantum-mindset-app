import { PlayCircle } from 'lucide-react'
import type { ActiveMasterclass } from '../queries/getActiveMasterclasses'
import { getAppT } from '@/lib/app-i18n/server'

type RecordedMasterclassVaultProps = {
  sessions: readonly ActiveMasterclass[]
}

// Live Member Training Hub™ — real recordings from the `masterclasses`
// table, one row per past session that has a real recording_url. Empty
// until Dr. Kapil Dev Sharma's team uploads the first one — an honest
// empty state, never a fabricated "coming soon" library.
export async function RecordedMasterclassVault({ sessions }: RecordedMasterclassVaultProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('dashboard.liveClasses.recordings')}</p>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t('dashboard.liveClasses.noRecordings')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{session.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t('dashboard.liveClasses.withMentor', { name: session.mentorName })}</p>
              </div>
              <a
                href={session.recordingUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/[0.12]"
              >
                <PlayCircle className="size-3.5" aria-hidden="true" />
                {t('dashboard.liveClasses.watch')}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
