'use client'

import { useState, useTransition } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import { Button } from '@/components/ui/button'
import { resetReadingAssessment } from '../actions/resetReadingAssessment'

type RetakeAssessmentButtonProps = {
  documentId: string
}

// Reading Assessment Engine™ — Settings' own real "Retake Assessment"
// control. Deletes this learner's current Reading Profile row for a
// document; the next time they open that document's QSR read route,
// `checkReadingAssessmentExists` honestly finds nothing and the
// assessment flow runs again — no separate "retake mode" anywhere.
export function RetakeAssessmentButton({ documentId }: RetakeAssessmentButtonProps): React.JSX.Element {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const t = useAppT()

  if (done) return <p className="text-sm text-muted-foreground">{t('settings.assessment.retakeDone')}</p>

  return (
    <Button
      variant="outline"
      size="sm"
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await resetReadingAssessment({ documentId })
          if (result.success) setDone(true)
        })
      }
    >
      {t('settings.assessment.retake')}
    </Button>
  )
}
