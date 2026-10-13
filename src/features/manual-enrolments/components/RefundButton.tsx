'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { refundManualEnrolment } from '../actions'

// Two taps (Refund → Confirm refund), so access is never removed by accident.
export function RefundButton({ id, inWindow }: { id: string; inWindow: boolean }): React.JSX.Element {
  const [confirming, setConfirming] = useState(false)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  if (!confirming)
    return (
      <Button size="sm" variant="outline" onClick={() => setConfirming(true)} data-manual-refund={id}>
        Refund{inWindow ? '' : ' (window passed)'}
      </Button>
    )
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await refundManualEnrolment({ id })
            if (!res.ok) setError(res.error)
          })
        }
        data-manual-refund-confirm={id}
      >
        {pending ? 'Refunding…' : 'Confirm refund — remove access'}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
