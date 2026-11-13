import { Lock } from 'lucide-react'
import { getAppT } from '@/lib/app-i18n/server'
import { enrolT } from '@/lib/app-i18n/enrol'
import { OpenPlansButton } from '@/features/sharp-brain-enrol/components/OpenPlansButton'
import { getRecordingsView } from '../recordings'
import { ClassRecordingsList } from './ClassRecordingsList'

// "Class recordings" in the Sharp Brain area (/masterclasses#recordings).
// Live and self-paced learners see the players; everyone else sees the
// locked state with both plans one tap away.
export async function ClassRecordings(): Promise<React.JSX.Element> {
  const [view, { t, lang }] = await Promise.all([getRecordingsView(), getAppT()])
  return (
    <section id="recordings" className="scroll-mt-20 flex flex-col gap-3" aria-labelledby="class-recordings" data-class-recordings={view.access ? 'open' : 'locked'}>
      <h2 id="class-recordings" className="text-lg font-semibold text-foreground">
        {t('training.recordings.title')}
      </h2>
      {view.access ? (
        <>
          <p className="text-sm text-muted-foreground">{t('training.recordings.intro')}</p>
          <ClassRecordingsList classes={view.classes} watched={view.watched} />
        </>
      ) : (
        <div className="rounded-2xl border bg-card p-5 text-center shadow-sm">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary/10" aria-hidden="true">
            <Lock className="size-5 text-primary" />
          </span>
          <p className="mt-3 text-base font-semibold text-foreground">{t('training.recordings.lockedTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('training.recordings.lockedBody')}</p>
          <OpenPlansButton
            label={enrolT(lang)('plans.seeBoth')}
            dataLocation="class_recordings_locked"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          />
        </div>
      )}
    </section>
  )
}
