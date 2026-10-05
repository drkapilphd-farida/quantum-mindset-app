import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { currentProgramPriceLabel } from '@/features/sharp-brain-enrol/server'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EXERCISE_BODY_CLASSNAME, EXERCISE_SCREEN_CLASSNAME, EXERCISE_TITLE_CLASSNAME } from './exerciseStyles'
import { primaryCheckoutHref, programs } from '@/config/site.config'

type ProLockedScreenProps = {
  title: string
}

// Sharp Brain program paywall — the paid-access counterpart to
// ExerciseLockedScreen (which locks a step for sequential-mastery
// reasons). Deliberately a separate component rather than a new prop on
// ExerciseLockedScreen: the copy and destination are fundamentally
// different (upgrade, not "finish the previous exercise"), and keeping
// them separate means a mastery lock can never accidentally read as a
// paywall or vice versa.

// Name, price and links from the programs registry (site.config.ts).
export async function ProLockedScreen({ title }: ProLockedScreenProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  const price = currentProgramPriceLabel()
  return (
    <div className={EXERCISE_SCREEN_CLASSNAME}>
      <div className="mx-auto max-w-sm">
        <div aria-hidden="true" className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="size-6 text-primary" />
        </div>
        <h1 className={EXERCISE_TITLE_CLASSNAME}>{t('welcome.lock.partOf', { title, program: programs.sharpBrain.name })}</h1>
        <p className={cn('mt-4', EXERCISE_BODY_CLASSNAME)}>
          {t('welcome.lock.enrolOnce', { price })}
        </p>
        <Button asChild size="lg" className="mt-10 min-w-[200px] rounded-full shadow-sm">
          <a href={primaryCheckoutHref('sharpBrain')} target="_blank" rel="noopener noreferrer">
            {t('welcome.lock.enrolFor', { price })}
          </a>
        </Button>
        <p className="mt-4">
          <Link href={programs.sharpBrain.url} className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            {t('welcome.lock.seeProgram')}
          </Link>
        </p>
      </div>
    </div>
  )
}
