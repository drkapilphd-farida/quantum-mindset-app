'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { previewTransfer, transferProgress } from '../actions'
import type { AccountSnapshot } from '../data'
import { accessLabel, betterAccess, mergedDays, SUMMARY_LABELS } from '../rules'

const field = 'min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground'
const fmtDate = (iso: string | null): string => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '—')
const daysLabel = (days: readonly number[]): string => (days.length === 0 ? 'None' : `${days.length} (up to Day ${days[days.length - 1]})`)

// Founder-only. Step 1 "Check" shows both accounts and what the new one will
// have; step 2 needs two taps (Transfer → Confirm). Nothing is ever removed.
export function TransferProgressForm(): React.JSX.Element {
  const [pending, start] = useTransition()
  const [emails, setEmails] = useState({ fromEmail: '', toEmail: '' })
  const [pair, setPair] = useState<{ from: AccountSnapshot; to: AccountSnapshot } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string; summary?: Record<string, number> } | null>(null)
  const set = (k: keyof typeof emails) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmails((v) => ({ ...v, [k]: e.target.value }))
    setPair(null)
    setConfirming(false)
  }

  return (
    <div className="space-y-4">
      <form
        className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          setMessage(null)
          setConfirming(false)
          start(async () => {
            const res = await previewTransfer(emails)
            if (res.ok) setPair({ from: res.from, to: res.to })
            else {
              setPair(null)
              setMessage({ ok: false, text: res.error })
            }
          })
        }}
        data-transfer-form="true"
      >
        <label className="grid gap-1 text-sm">
          Old email (progress comes from here)
          <input type="email" required value={emails.fromEmail} onChange={set('fromEmail')} className={field} data-transfer-from="true" />
        </label>
        <label className="grid gap-1 text-sm">
          New email (progress goes here)
          <input type="email" required value={emails.toEmail} onChange={set('toEmail')} className={field} data-transfer-to="true" />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending} data-transfer-check="true">
            {pending && pair === null ? 'Checking…' : 'Check both accounts'}
          </Button>
        </div>
      </form>

      {pair && (
        <div className="space-y-4 rounded-xl border p-4" data-transfer-preview="true">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 pr-3 font-normal" />
                <th className="py-1 pr-3 font-normal">Old account</th>
                <th className="py-1 pr-3 font-normal">New account now</th>
                <th className="py-1 font-semibold text-foreground">New account after</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-1 [&_td]:pr-3">
              <tr><td className="text-muted-foreground">Email</td><td>{pair.from.email}</td><td>{pair.to.email}</td><td>{pair.to.email}</td></tr>
              <tr><td className="text-muted-foreground">Name</td><td>{pair.from.name ?? '—'}</td><td>{pair.to.name ?? '—'}</td><td>{pair.to.name ?? '—'}</td></tr>
              <tr><td className="text-muted-foreground">Signed up</td><td>{fmtDate(pair.from.createdAt)}</td><td>{fmtDate(pair.to.createdAt)}</td><td>—</td></tr>
              <tr><td className="text-muted-foreground">30-day plan days</td><td>{daysLabel(pair.from.planDays)}</td><td>{daysLabel(pair.to.planDays)}</td><td className="font-semibold">{daysLabel(mergedDays(pair.from.planDays, pair.to.planDays))}</td></tr>
              <tr><td className="text-muted-foreground">Reading checkpoints</td><td>{pair.from.readingTests}</td><td>{pair.to.readingTests}</td><td className="font-semibold">up to {pair.from.readingTests + pair.to.readingTests}</td></tr>
              <tr><td className="text-muted-foreground">Exercise scores</td><td>{pair.from.exerciseResults}</td><td>{pair.to.exerciseResults}</td><td className="font-semibold">up to {pair.from.exerciseResults + pair.to.exerciseResults}</td></tr>
              <tr><td className="text-muted-foreground">Certificate</td><td>{pair.from.certificate ? 'Yes' : 'No'}</td><td>{pair.to.certificate ? 'Yes' : 'No'}</td><td className="font-semibold">{pair.from.certificate || pair.to.certificate ? 'Yes' : 'No'}</td></tr>
              <tr><td className="text-muted-foreground">Access</td><td>{accessLabel(pair.from.access)}</td><td>{accessLabel(pair.to.access)}</td><td className="font-semibold">{accessLabel(betterAccess(pair.from.access, pair.to.access))}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">The better value is kept wherever both have one. Nothing is removed from either account; the old account stays as it is.</p>
          {!confirming ? (
            <Button onClick={() => setConfirming(true)} disabled={pending} data-transfer-start="true">
              Transfer progress
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await transferProgress(emails)
                    setConfirming(false)
                    if (res.ok) {
                      setPair((p) => (p ? { ...p, to: res.after } : p))
                      setMessage({ ok: true, text: `Done. ${res.after.email} now has ${daysLabel(res.after.planDays)} plan days · access: ${accessLabel(res.after.access)}.`, summary: res.summary })
                    } else setMessage({ ok: false, text: res.error })
                  })
                }
                data-transfer-confirm="true"
              >
                {pending ? 'Transferring…' : `Confirm — copy to ${pair.to.email}`}
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className={`rounded-xl border p-3 text-sm ${message.ok ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : 'border-destructive/40 text-destructive'}`} role="status" data-transfer-message={message.ok ? 'ok' : 'error'}>
          {message.text}
          {message.summary && (
            <ul className="mt-2 grid gap-0.5 text-xs text-foreground sm:grid-cols-2">
              {Object.entries(message.summary).map(([k, v]) => (
                <li key={k}>
                  {SUMMARY_LABELS[k] ?? k}: {v}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
