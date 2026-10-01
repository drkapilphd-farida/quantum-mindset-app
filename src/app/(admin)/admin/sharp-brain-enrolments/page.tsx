import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getEnrolmentsByBatch } from '@/features/sharp-brain-enrol/queries/getEnrolmentsByBatch'

// getEnrolmentsByBatch() uses the service-role client — never run it at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Sharp Brain Enrolments — Admin',
  robots: { index: false, follow: false },
}

const OFFER_LABEL: Record<string, string> = { earlybird: 'Early-bird', regular: 'Regular', test1000: 'Test offer (₹1,000 off)' }

function formatBatch(batchStart: string | null): string {
  if (batchStart === null) return 'Batch not recorded (fixed payment link)'
  const date = new Date(`${batchStart}T00:00:00+05:30`)
  return `Batch starting ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`
}

function formatPaidAt(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })
}

// Paid Sharp Brain 30-Day Program enrolments, one table per batch, so each
// batch can be planned. Read-only.
export default async function AdminSharpBrainEnrolmentsPage(): Promise<React.JSX.Element> {
  const groups = await getEnrolmentsByBatch()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sharp Brain Enrolments</h1>
        <p className="text-sm text-muted-foreground">
          Paid 30-Day Program enrolments by batch (IST), newest batch first. Refunds are not subtracted here — access is removed automatically on a
          Razorpay refund.
        </p>
      </div>
      {groups.length === 0 && <p className="text-sm text-muted-foreground">No paid enrolments yet.</p>}
      {groups.map((group) => (
        <section key={group.batchStart ?? 'none'} className="space-y-3">
          <h2 className="text-lg font-semibold">
            {formatBatch(group.batchStart)}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              · {group.rows.length} paid · ₹{group.totalInr.toLocaleString('en-IN')}
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
                    <TableCell className="text-right tabular-nums">{row.amountInr === null ? '—' : `₹${row.amountInr.toLocaleString('en-IN')}`}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatPaidAt(row.paidAt)}</TableCell>
                    <TableCell>{row.granted ? 'Granted' : 'Waiting for sign-up'}</TableCell>
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
