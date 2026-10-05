import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EXERCISE_BODY_CLASSNAME, EXERCISE_SCREEN_CLASSNAME, EXERCISE_TITLE_CLASSNAME } from './exerciseStyles'

type ExerciseLockedScreenProps = {
  title: string
  unlockHref: string
  /** The exercise to do first (its name stays in English); null = back to the Lab. */
  unlockTarget: string | null
}

// Shown when a student lands on an exercise URL directly (bookmark, typed
// link, browser back/forward) before earning access to it in sequence.
export async function ExerciseLockedScreen({ title, unlockHref, unlockTarget }: ExerciseLockedScreenProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className={EXERCISE_SCREEN_CLASSNAME}>
      <div className="mx-auto max-w-sm">
        <h1 className={EXERCISE_TITLE_CLASSNAME}>{t('exercises.locked.title', { title })}</h1>
        <p className={cn('mt-4', EXERCISE_BODY_CLASSNAME)}>
          {t('exercises.locked.body')}
        </p>
        <Button asChild size="lg" className="mt-10 min-w-[200px] rounded-full shadow-sm">
          <Link href={unlockHref}>{unlockTarget !== null ? t('exercises.locked.goTo', { name: unlockTarget }) : t('exercises.locked.backToLab')}</Link>
        </Button>
      </div>
    </div>
  )
}
