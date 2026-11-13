'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { grantAccessForUnmatched, markUnmatchedReviewed } from './unmatchedActions'

/** Row buttons: give Sharp Brain access (Live / Self-paced) or mark reviewed. */
export function UnmatchedRowActions({ id, hasEmail }: { id: string; hasEmail: boolean }): React.JSX.Element {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  function run(action: () => Promise<{ ok: true; message: string } | { ok: false; error: string }>): void {
    setResult(null)
    start(async () => {
      const res = await action()
      setResult(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error })
    })
  }
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {hasEmail && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                if (window.confirm('Give Sharp Brain LIVE batch access for this payment?')) run(() => grantAccessForUnmatched({ id, plan: 'live' }))
              }}
            >
              Give access · Live
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                if (window.confirm('Give Sharp Brain SELF-PACED access for this payment?')) run(() => grantAccessForUnmatched({ id, plan: 'self_paced' }))
              }}
            >
              Give access · Self-paced
            </Button>
          </>
        )}
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => markUnmatchedReviewed({ id }))}>
          Mark reviewed
        </Button>
      </div>
      {result && <p className={`text-xs ${result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`}>{result.text}</p>}
    </div>
  )
}
