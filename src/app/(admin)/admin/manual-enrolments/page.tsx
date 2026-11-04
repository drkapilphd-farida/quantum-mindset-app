import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { listManualEnrolments } from '@/features/manual-enrolments/data'
import { inRefundWindow, PAYMENT_MODE_LABEL, SEAT_LABEL, todayIst } from '@/features/manual-enrolments/rules'
import { ManualEnrolmentForm } from '@/features/manual-enrolments/components/ManualEnrolmentForm'
import { EntryActions } from '@/features/manual-enrolments/components/EntryActions'

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
  // The seat on sale now is preselected (₹2,999 until the first 100 are paid).
  const { price, seatsKnown } = await pricingSnapshot()
  const active = rows.filter((r) => r.status !== 'refunded')
  const total = active.reduce((sum, r) => sum + (r.amountInr ?? 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Manual enrolments</h1>
        <p className="text-sm text-muted-foreground">
          Sharp Brain 30-Day Program payments by GPay, cash or bank transfer. “Give full access” switches the program and app on now if they already have an account (any sign-in, including Google) — otherwise as soon as they sign up or log in with this email. After saving, the page checks access the same way the app does and shows “✅ Access verified” or a red warning with the reason; “Check access” on an entry runs that check again. One active entry per email: use Edit to correct it, Delete for an entry made by mistake. Every entry is a sale (also listed in Sharp Brain Enrolments) with a
          7-day refund window.
        </p>
      </div>
      <p className="text-sm" data-seats-left={price.seatsLeft}>
        {seatsKnown ? (price.seatsLeft > 0 ? `Seats left at ₹${price.introInr.toLocaleString('en-IN')}: ${price.seatsLeft} of ${price.introSeats}` : `₹${price.introInr.toLocaleString('en-IN')} seats are full — now ₹${price.laterInr.toLocaleString('en-IN')}`) : 'Seat count unavailable right now.'}
      </p>
      <ManualEnrolmentForm defaultSeat={price.offer} defaultAmount={price.amountInr} today={today} />
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
                  <TableHead>Seat</TableHead>
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
                    <TableCell className="whitespace-nowrap">{r.offer !== null ? SEAT_LABEL[r.offer] : r.batchStart ? `Batch ${fmt(r.batchStart)}` : '—'}</TableCell>
                    <TableCell className={`whitespace-nowrap ${STATUS[r.status]!.className}`}>{STATUS[r.status]!.label}</TableCell>
                    <TableCell>
                      <EntryActions
                        entry={{ id: r.id, amountInr: r.amountInr, mode: r.mode, paidOn: r.paidOn, offer: r.offer, refunded: r.status === 'refunded', inWindow: inRefundWindow(r.paidOn, today) }}
                        today={today}
                      />
                    </TableCell>
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
