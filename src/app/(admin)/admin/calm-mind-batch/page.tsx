import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { calmMindBatch } from '@/config/site.config'
import { listRegistrations } from '@/features/calm-batch/registrations'

// Uses the service-role client — never at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const metadata: Metadata = { title: 'Calm Mind Batch — Admin', robots: { index: false, follow: false } }

const fmt = (iso: string): string => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

// 21-Day Calm Mind live batch: every verified paid registration (newest first).
export default async function CalmMindBatchAdminPage(): Promise<React.JSX.Element> {
  const rows = await listRegistrations()
  const current = rows.filter((r) => r.batch === calmMindBatch.nextBatch.startDate).length
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Calm Mind Batch</h1>
          <p className="text-sm text-muted-foreground">
            Batch {calmMindBatch.nextBatch.startDate}: {current} of {calmMindBatch.seatsTotal} seats taken. Verified payments only (Razorpay signature checked).
          </p>
        </div>
        <a href="/admin/calm-mind-batch/export" className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
          Download CSV
        </a>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No registrations yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Batch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.paymentId}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell className="font-mono text-xs">{r.paymentId}</TableCell>
                <TableCell>{fmt(r.paidAt)}</TableCell>
                <TableCell>{r.batch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
