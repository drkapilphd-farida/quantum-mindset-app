import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { sharpBrainEnrolment } from '@/config/site.config'
import { upcomingBatches } from '@/features/sharp-brain-enrol/batches'
import { listManualEnrolments } from '@/features/manual-enrolments/data'
import { inRefundWindow, PAYMENT_MODE_LABEL, todayIst } from '@/features/manual-enrolments/rules'
import { ManualEnrolmentForm } from '@/features/manual-enrolments/components/ManualEnrolmentForm'
import { RefundButton } from '@/features/manual-enrolments/components/RefundButton'

// Uses the service-role client — never at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const metadata: Metadata = { title: 'Manual enrolments — Admin', robots: { index: false, follow: false } }

const fmt = (iso: string): string => (iso ? new Date(`${iso}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '—')
const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: 'Access on', className: 'text-emerald-700 dark:text-emerald-400' },
  'waiting-for-signup': { label: 'Waiting for sign-up', className: 'text-amber-700 dark:text-amber-400' },
  refunded: { label: 'Refunded', className: 'text-muted-foreground line-through' },
}

// Sharp Brain payments taken by GPay, cash or bank transfer. Each one is a
// sale (it also appears in Sharp Brain Enrolments) with a 7-day refund window.
export default async function ManualEnrolmentsPage(): Promise<React.JSX.Element> {
  const today = todayIst()
  const rows = await listManualEnrolments()
  // A batch that started in the last 10 days (late joiners) and the next ones; the next batch is preselected.
  const batches = upcomingBatches(Date.now() - 10 * 86_400_000, sharpBrainEnrolment, 5).map((b) => ({ start: b.start, label: `Batch starting ${fmt(b.start)}${b.start < today ? ' (started)' : ''}` }))
  const nextBatch = batches.find((b) => b.start >= today)?.start ?? batches[0]?.start ?? ''
  const active = rows.filter((r) => r.status !== 'refunded')
  const total = active.reduce((sum, r) => sum + (r.amountInr ?? 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Manual enrolments</h1>
        <p className="text-sm text-muted-foreground">
          Sharp Brain 30-Day Program payments by GPay, cash or bank transfer. “Give full access” switches the program and app on now — or, if the
          person hasn’t signed up yet, as soon as they sign up with this email. Every entry is a sale (also listed in Sharp Brain Enrolments) with a
          7-day refund window.
        </p>
      </div>
      <ManualEnrolmentForm batches={batches} defaultBatch={nextBatch} today={today} />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          All manual enrolments{' '}
          <span className="text-sm font-normal text-muted-foreground">
            · {active.length} active · ₹{total.toLocaleString('en-IN')}
          </span>
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table data-manual-list="true">
              <TableHeader>
                <TableRow>
                  <TableHead>Name / email</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Refund by</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} data-manual-row={r.status}>
                    <TableCell>
                      <div className="font-medium">{r.name ?? '—'}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                      {r.note && <div className="text-xs text-muted-foreground">{r.note}</div>}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.amountInr === null ? '—' : `₹${r.amountInr.toLocaleString('en-IN')}`}</TableCell>
                    <TableCell>{PAYMENT_MODE_LABEL[r.mode]}</TableCell>
                    <TableCell className="whitespace-nowrap">{fmt(r.paidOn)}</TableCell>
                    <TableCell className="whitespace-nowrap">{fmt(r.refundBy)}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.batchStart ? fmt(r.batchStart) : 'Not decided'}</TableCell>
                    <TableCell className={`whitespace-nowrap ${STATUS[r.status]!.className}`}>{STATUS[r.status]!.label}</TableCell>
                    <TableCell>{r.status !== 'refunded' && <RefundButton id={r.id} inWindow={inRefundWindow(r.paidOn, today)} />}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  )
}
