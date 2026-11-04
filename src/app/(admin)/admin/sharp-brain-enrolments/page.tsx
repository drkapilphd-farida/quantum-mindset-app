import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getEnrolmentsByBatch } from '@/features/sharp-brain-enrol/queries/getEnrolmentsByBatch'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'

// getEnrolmentsByBatch() uses the service-role client — never run it at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Sharp Brain Enrolments — Admin',
  robots: { index: false, follow: false },
}

const OFFER_LABEL: Record<string, string> = {
  parent_2999: '₹2,999 seat (first 100)',
  parent_3999: '₹3,999 seat',
  instalment_1: 'Instalment 1 of 2',
  instalment_2: 'Instalment 2 of 2',
  earlybird: 'Early-bird (old batch)',
  regular: 'Regular (old batch)',
  test1000: 'Test offer (old, ₹1,000 off)',
}

function formatBatch(batchStart: string | null): string {
  if (batchStart === null) return 'Start-today enrolments (no batch)'
  const date = new Date(`${batchStart}T00:00:00+05:30`)
  return `Batch starting ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`
}

function formatPaidAt(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })
}

// Paid Sharp Brain 30-Day Program enrolments, one table per batch, so each
// batch can be planned. Read-only.
export default async function AdminSharpBrainEnrolmentsPage(): Promise<React.JSX.Element> {
  const [groups, { price, seatsKnown }] = await Promise.all([getEnrolmentsByBatch(), pricingSnapshot()])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sharp Brain Enrolments</h1>
        <p className="text-sm text-muted-foreground">
          Paid 30-Day Program enrolments by batch (IST), newest batch first. Includes manual payments (GPay / cash / bank) from Manual enrolments; refunded manual payments are marked and left out of the total. Razorpay
          refunds remove access automatically.
        </p>
        <p className="mt-2 text-sm font-semibold" data-seats-left={price.seatsLeft}>
          {seatsKnown
            ? `₹${price.introInr.toLocaleString('en-IN')} seats: ${price.introSeats - price.seatsLeft} of ${price.introSeats} paid · ${price.seatsLeft} left · now selling at ₹${price.amountInr.toLocaleString('en-IN')}`
            : 'Seat count unavailable right now.'}
        </p>
      </div>
      {groups.length === 0 && <p className="text-sm text-muted-foreground">No paid enrolments yet.</p>}
      {groups.map((group) => (
        <section key={group.batchStart ?? 'none'} className="space-y-3">
          <h2 className="text-lg font-semibold">
            {formatBatch(group.batchStart)}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              · {group.rows.filter((r) => !r.refunded).length} paid · ₹{group.totalInr.toLocaleString('en-IN')}
            </span>
          </h2>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>App access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.phone ?? '—'}</TableCell>
                    <TableCell>{row.email ?? '—'}</TableCell>
                    <TableCell>{row.offer === null ? '—' : (OFFER_LABEL[row.offer] ?? row.offer)}</TableCell>
                    <TableCell>{row.paidVia}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.amountInr === null ? '—' : `₹${row.amountInr.toLocaleString('en-IN')}`}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatPaidAt(row.paidAt)}</TableCell>
                    <TableCell>{row.refunded ? 'Refunded' : row.granted ? 'Granted' : 'Waiting for sign-up'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </div>
  )
}
