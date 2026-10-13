'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteManualEnrolment, updateManualEnrolment } from '../actions'
import { PAYMENT_MODE_LABEL, PAYMENT_MODES, type PaymentMode } from '../rules'
import { RefundButton } from './RefundButton'

type Entry = { id: string; amountInr: number | null; mode: PaymentMode; paidOn: string; batchStart: string | null; refunded: boolean; inWindow: boolean }

const field = 'min-h-9 rounded-md border border-border bg-background px-2 text-sm'

// Per entry: Edit (amount, mode, date, batch), Delete (entered by mistake —
// two taps; not a refund) and Refund.
export function EntryActions({ entry, batches, today }: { entry: Entry; batches: { start: string; label: string }[]; today: string }): React.JSX.Element {
  const [mode, setMode] = useState<'idle' | 'edit' | 'delete'>('idle')
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ amount: String(entry.amountInr ?? ''), payMode: entry.mode, paidOn: entry.paidOn, batch: entry.batchStart ?? '' })

  if (mode === 'edit')
    return (
      <form
        className="flex min-w-64 flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          start(async () => {
            const res = await updateManualEnrolment({ id: entry.id, amountInr: Number(form.amount.replace(/[^\d]/g, '')), mode: form.payMode, paidOn: form.paidOn, batchStart: form.batch || null })
            if (res.ok) setMode('idle')
            else setError(res.error)
          })
        }}
        data-manual-edit-form={entry.id}
      >
        <input inputMode="numeric" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} aria-label="Amount (₹)" className={field} data-manual-edit-amount="true" />
        <div className="flex gap-1">
          {PAYMENT_MODES.map((m) => (
            <button key={m} type="button" aria-pressed={form.payMode === m} onClick={() => setForm((f) => ({ ...f, payMode: m }))} className={`min-h-9 flex-1 rounded-md border px-1 text-xs ${form.payMode === m ? 'border-primary bg-primary/10 font-semibold' : 'border-border'}`} data-manual-edit-mode={m}>
              {PAYMENT_MODE_LABEL[m]}
            </button>
          ))}
        </div>
        <input type="date" max={today} value={form.paidOn} onChange={(e) => setForm((f) => ({ ...f, paidOn: e.target.value }))} aria-label="Payment date" className={field} />
        <select value={form.batch} onChange={(e) => setForm((f) => ({ ...f, batch: e.target.value }))} aria-label="Batch" className={field}>
          {entry.batchStart && !batches.some((b) => b.start === entry.batchStart) && <option value={entry.batchStart}>{entry.batchStart}</option>}
          {batches.map((b) => (
            <option key={b.start} value={b.start}>
              {b.label}
            </option>
          ))}
          <option value="">Not decided</option>
        </select>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending} data-manual-edit-save="true">
            {pending ? 'Saving…' : 'Save'}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setMode('idle')}>
            Cancel
          </Button>
        </div>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </form>
    )

  if (mode === 'delete')
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await deleteManualEnrolment({ id: entry.id })
              if (!res.ok) setError(res.error)
            })
          }
          data-manual-delete-confirm={entry.id}
        >
          {pending ? 'Deleting…' : 'Confirm delete (entered by mistake)'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setMode('idle')}>
          Cancel
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    )

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => setMode('edit')} data-manual-edit={entry.id}>
        Edit
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setMode('delete')} data-manual-delete={entry.id}>
        Delete
      </Button>
      {!entry.refunded && <RefundButton id={entry.id} inWindow={entry.inWindow} />}
    </div>
  )
}
