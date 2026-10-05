'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import type { PracticeKind } from '@/lib/app-i18n/practiceContent'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  EXERCISE_BODY_CLASSNAME,
  EXERCISE_CAPTION_CLASSNAME,
  EXERCISE_SCREEN_CLASSNAME,
  EXERCISE_TITLE_CLASSNAME,
} from './exerciseStyles'

type ExerciseIntroScreenProps = {
  title: string
  description: string
  durationLabel: string
  postureNote: string
  onStart: () => void
  previousHref?: string
  previousLabel?: string
  labHref?: string
  practiceText?: PracticeKind
}

export function ExerciseIntroScreen({
  title,
  description,
  durationLabel,
  postureNote,
  onStart,
  previousHref,
  previousLabel,
  labHref,
  practiceText,
}: ExerciseIntroScreenProps): React.JSX.Element {
  const t = useAppT()
  const hasSecondaryNav = previousHref !== undefined || labHref !== undefined

  return (
    <div className={EXERCISE_SCREEN_CLASSNAME}>
      <div className="mx-auto max-w-sm">
        <h1 className={EXERCISE_TITLE_CLASSNAME}>{title}</h1>
        <p className={cn('mt-4', EXERCISE_BODY_CLASSNAME)}>{description}</p>

        <p className={cn('mt-8', EXERCISE_CAPTION_CLASSNAME)}>{durationLabel}</p>
        <p className={cn('mt-2', EXERCISE_CAPTION_CLASSNAME)}>{postureNote}</p>
        {practiceText !== undefined && <PracticeTextNote kind={practiceText} className="mx-auto mt-4 inline-block" />}

        <Button size="lg" className="mt-10 min-w-[200px] rounded-full shadow-sm" onClick={onStart}>
          {t('exercises.start')}
        </Button>

        {hasSecondaryNav && (
          <div className="mt-6 flex items-center justify-center gap-4">
            {previousHref !== undefined && (
              <Link href={previousHref} className={cn('hover:text-foreground', EXERCISE_CAPTION_CLASSNAME)}>
                ← {previousLabel ?? t('exercises.runner.previous')}
              </Link>
            )}
            {labHref !== undefined && (
              <Link href={labHref} className={cn('hover:text-foreground', EXERCISE_CAPTION_CLASSNAME)}>
                {t('exercises.runner.exitToLab')}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
