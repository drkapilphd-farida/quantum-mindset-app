'use client'

import { useState } from 'react'
import { setRemindersPaused } from '../adminActions'

/** Pause/resume reminders for one learner (admin). Reloads the page after a save. */
export function AdminReminderToggle({ userId, paused, note }: { userId: string; paused: boolean; note: string | null }): React.JSX.Element {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function save(nextPaused: boolean): Promise<void> {
    setBusy(true)
    const res = await setRemindersPaused({ userId, paused: nextPaused, note: reason })
    if (res.ok) window.location.reload()
    else {
      setError(res.error)
      setBusy(false)
    }
  }
  return (
    <div className="flex flex-col gap-1 text-xs" data-admin-reminders={paused ? 'paused' : 'active'}>
      {paused ? (
        <>
          <span className="font-semibold text-amber-800">Paused{note ? ` · ${note}` : ''}</span>
          <button type="button" className="self-start text-primary underline" disabled={busy} onClick={() => void save(false)}>
            Resume
          </button>
        </>
      ) : (
        <>
          <input aria-label="Reason for pausing reminders" placeholder="Reason (optional)" className="min-h-8 w-36 rounded-md border border-border bg-background px-2" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} />
          <button type="button" className="self-start text-primary underline" disabled={busy} onClick={() => void save(true)}>
            Pause reminders
          </button>
        </>
      )}
      {error !== null && <span className="text-destructive">{error}</span>}
    </div>
  )
}
