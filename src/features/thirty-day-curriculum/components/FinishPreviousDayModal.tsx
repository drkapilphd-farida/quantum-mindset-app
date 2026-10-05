'use client'

import { Lock } from 'lucide-react'
import { useAppT } from '@/lib/app-i18n/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// For a learner who HAS the program but hasn't reached this day yet: the
// days open one after another. Never an enrolment offer here.
type FinishPreviousDayModalProps = {
  day: number | null
  onOpenChange: (open: boolean) => void
  onGoToDay: (day: number) => void
}

export function FinishPreviousDayModal({ day, onOpenChange, onGoToDay }: FinishPreviousDayModalProps): React.JSX.Element {
  const t = useAppT()
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
            <DialogTitle className="font-heading text-xl font-bold tracking-tight text-foreground">{t('curriculum.finishPrevious.title', vars)}</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('curriculum.finishPrevious.body', vars)}
            </DialogDescription>
          </div>
          {previous !== null && previous >= 1 && (
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
