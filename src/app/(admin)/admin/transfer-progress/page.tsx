import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listTransfers } from '@/features/progress-transfer/data'
import { SUMMARY_LABELS } from '@/features/progress-transfer/rules'
import { TransferProgressForm } from '@/features/progress-transfer/components/TransferProgressForm'

// Uses the service-role client — never at build time.
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const metadata: Metadata = { title: 'Transfer progress — Admin', robots: { index: false, follow: false } }

const fmt = (iso: string): string => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

// A learner who signed up again with a new email: copy their progress,
// checkpoints, scores and access from the old account to the new one.
export default async function TransferProgressPage(): Promise<React.JSX.Element> {
  const log = await listTransfers()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Transfer progress</h1>
        <p className="text-sm text-muted-foreground">
          For a learner who signed up again with a new email. Copies their 30-day plan, reading checkpoints, exercise scores, certificate and access from the old account to the new one. The better value is kept wherever both have one; nothing is removed, and the old account is not deleted. The new account must exist (ask the learner to sign up first). Every transfer is logged below.
        </p>
      </div>
      <TransferProgressForm />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Transfers</h2>
        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transfers yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When (IST)</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Copied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {log.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{fmt(r.at)}</TableCell>
                  <TableCell>{r.fromEmail}</TableCell>
                  <TableCell>{r.toEmail}</TableCell>
                  <TableCell>{r.by}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {Object.entries(r.summary)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => `${SUMMARY_LABELS[k] ?? k} ${v}`)
                      .join(' · ') || 'Nothing new'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
