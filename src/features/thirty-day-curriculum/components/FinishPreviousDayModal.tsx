'use client'

import { Lock } from 'lucide-react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// For a learner who HAS the program but hasn't reached this day yet: the
// days open one after another. Never an enrolment offer here.
type FinishPreviousDayModalProps = {
  day: number | null
  /** Pace control: the previous day is done and this day opens at this time. */
  opensAt?: string | null
  onOpenChange: (open: boolean) => void
  onGoToDay: (day: number) => void
}

export function FinishPreviousDayModal({ day, opensAt = null, onOpenChange, onGoToDay }: FinishPreviousDayModalProps): React.JSX.Element {
  const t = useAppT()
  const htmlLang = LANGUAGES[useUiLang()].htmlLang
  const opensText =
    opensAt === null
      ? null
      : t('curriculum.pace.dayOpensAt', {
          day: day ?? '',
          time: new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(opensAt)),
          date: new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(opensAt)),
        })
  const previous = day === null ? null : day - 1
  // The modal is only open while `day` is set; '' keeps the closed state valid.
  const vars = { day: day ?? '', previous: previous ?? '' }
  return (
    <Dialog open={day !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-4 p-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Lock className="size-6" />
          </div>
          <div>
            <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground">{opensText ?? t('curriculum.finishPrevious.title', vars)}</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground" data-opens-at={opensAt ?? undefined}>
              {opensText !== null ? t('curriculum.pace.nothingLost') : t('curriculum.finishPrevious.body', vars)}
            </DialogDescription>
          </div>
          {opensText === null && previous !== null && previous >= 1 && (
            <Button size="lg" className="w-full rounded-full" onClick={() => onGoToDay(previous)}>
              {t('curriculum.finishPrevious.goTo', { previous })}
            </Button>
          )}
          <button type="button" onClick={() => onOpenChange(false)} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('common.actions.close')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
