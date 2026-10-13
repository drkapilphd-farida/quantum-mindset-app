'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { recordManualEnrolment } from '../actions'
import { PAYMENT_MODE_LABEL, PAYMENT_MODES, type PaymentMode } from '../rules'

const field = 'min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground'

// Founder-only: record a GPay / cash / bank payment for the Sharp Brain 30-Day Program.
export function ManualEnrolmentForm({ batches, defaultBatch, today }: { batches: { start: string; label: string }[]; defaultBatch: string; today: string }): React.JSX.Element {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [mode, setMode] = useState<PaymentMode>('gpay')
  const [form, setForm] = useState({ email: '', name: '', phone: '', amount: '', paidOn: today, batch: defaultBatch, note: '' })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form
      className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        setResult(null)
        start(async () => {
          const res = await recordManualEnrolment({
            email: form.email,
            name: form.name || undefined,
            phone: form.phone || undefined,
            amountInr: Number(form.amount.replace(/[^\d]/g, '')),
            mode,
            paidOn: form.paidOn,
            batchStart: form.batch || null,
            note: form.note || undefined,
          })
          setResult(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error })
          if (res.ok) setForm((f) => ({ ...f, email: '', name: '', phone: '', amount: '', note: '' }))
        })
      }}
      data-manual-form="true"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email (the one they will sign up with) *
        <input type="email" required value={form.email} onChange={set('email')} className={field} data-manual-email="true" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Name (optional)
        <input value={form.name} onChange={set('name')} maxLength={120} className={field} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Amount (₹) *
        <input inputMode="numeric" required value={form.amount} onChange={set('amount')} placeholder="8999" className={field} data-manual-amount="true" />
      </label>
      <fieldset className="flex flex-col gap-1 text-sm font-medium">
        <legend className="mb-1">Payment mode *</legend>
        <div className="flex gap-2">
          {PAYMENT_MODES.map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`min-h-11 flex-1 rounded-lg border px-2 text-sm ${mode === m ? 'border-primary bg-primary/10 font-semibold' : 'border-border'}`} data-manual-mode={m}>
              {PAYMENT_MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Payment date *
        <input type="date" required max={today} value={form.paidOn} onChange={set('paidOn')} className={field} data-manual-date="true" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Program
        <input value="Sharp Brain 30-Day Program" readOnly className={`${field} text-muted-foreground`} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Batch
        <select value={form.batch} onChange={set('batch')} className={field} data-manual-batch="true">
          {batches.map((b) => (
            <option key={b.start} value={b.start}>
              {b.label}
            </option>
          ))}
          <option value="">Not decided</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Phone / note (optional)
        <input value={form.note} onChange={set('note')} maxLength={300} placeholder="e.g. GPay ref 1234" className={field} />
      </label>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending} data-manual-save="true">
          {pending ? 'Saving…' : 'Give full access'}
        </Button>
        {result && (
          <p role="status" className={`text-sm ${result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive'}`} data-manual-result={result.ok ? 'ok' : 'error'}>
            {result.text}
          </p>
        )}
      </div>
    </form>
  )
}
