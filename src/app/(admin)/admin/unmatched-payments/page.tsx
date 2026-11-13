import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listUnmatchedPayments } from '@/features/sharp-brain-plans/admin/unmatchedActions'
import { UnmatchedRowActions } from '@/features/sharp-brain-plans/admin/UnmatchedRowActions'

// Uses the service-role client — never at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const metadata: Metadata = { title: 'Unmatched payments — Admin', robots: { index: false, follow: false } }

const fmt = (iso: string): string => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

// Razorpay payments that reached the Sharp Brain webhook but were not
// recognised as Sharp Brain (another product's link, or an unreadable
// payload). Never dropped — listed here to check.
export default async function UnmatchedPaymentsPage(): Promise<React.JSX.Element> {
  const rows = await listUnmatchedPayments()
  const open = rows.filter((r) => r.reviewedAt === null)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Unmatched payments</h1>
        <p className="text-sm text-muted-foreground">
          Payments the Sharp Brain webhook received but did not recognise as Sharp Brain — usually another product’s payment link (workshop, retreat, Calm Mind …), which needs nothing here. If one was really for Sharp Brain, press “Give access” (Live or Self-paced): access is on at once if the email has an account, otherwise at sign-up.
          Mark the rest reviewed.
        </p>
      </div>
      <h2 className="text-lg font-semibold">
        {open.length} to review <span className="text-sm font-normal text-muted-foreground">· {rows.length} saved in all</span>
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">None yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table data-unmatched-list="true">
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Link / notes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} data-unmatched-row={r.reviewedAt === null ? 'open' : 'reviewed'}>
                  <TableCell className="whitespace-nowrap text-sm">{fmt(r.createdAt)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{r.name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{r.email ?? 'no email'}</div>
                    {r.phone && <div className="text-xs text-muted-foreground">{r.phone}</div>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.amountInr === null ? '—' : `${r.currency === 'INR' || r.currency === null ? '₹' : `${r.currency} `}${r.amountInr.toLocaleString('en-IN')}`}</TableCell>
                  <TableCell className="max-w-xs text-xs text-muted-foreground">
                    <div className="break-all">{r.shortUrl ?? '—'}</div>
                    {r.notes && <div className="break-words">{r.notes}</div>}
                    {r.reason === 'invalid_payload' && <div className="text-amber-700 dark:text-amber-400">Could not read this payment’s details</div>}
                    <div>{r.paymentId}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{r.reviewedAt === null ? <span className="font-semibold text-amber-700 dark:text-amber-400">To review</span> : <span className="text-muted-foreground">Reviewed</span>}</TableCell>
                  <TableCell>{r.reviewedAt === null && <UnmatchedRowActions id={r.id} hasEmail={r.email !== null} />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
