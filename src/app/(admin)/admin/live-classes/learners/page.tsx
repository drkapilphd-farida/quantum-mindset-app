import type { Metadata } from 'next'
import Link from 'next/link'
import { getLearnerOverview } from '@/features/live-classes/admin/data'
import { PaceToggle, RecordingControl } from '@/features/live-classes/admin/components/AdminControls'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = { title: 'Learners overview — Admin', robots: { index: false, follow: false } }

const ist = (iso: string): string => new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })

function Pill({ tone, children }: { tone: 'good' | 'bad' | 'warn' | 'muted'; children: React.ReactNode }): React.JSX.Element {
  const cls = { good: 'bg-emerald-100 text-emerald-800', bad: 'bg-rose-100 text-rose-800', warn: 'bg-amber-100 text-amber-900', muted: 'bg-muted text-muted-foreground' }[tone]
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>
}

// Learners overview (trainer only): classes, days, fair-test numbers,
// certificate, and the refund-guarantee checks. Not shown to learners.
export default async function AdminLearnersPage(): Promise<React.JSX.Element> {
  const rows = await getLearnerOverview()
  return (
    <div className="space-y-6">
      <Link href="/admin/live-classes" className="text-sm text-primary underline">
        ← Live classes
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Learners overview</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Refund conditions: all 30 days, all 7 classes (live, or a recording you tick), Day 1 and Day 30 fair tests taken, claim within 7 days of Day 30, and Day 30 shows no improvement in BOTH
            effective speed and retention (comprehension in the fair test).
          </p>
        </div>
        <Link href="/admin/live-classes/learners/export" prefetch={false} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Export CSV (Excel)
        </Link>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[1240px] text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-2">Learner</th>
              <th className="p-2">Batch</th>
              <th className="p-2">Classes</th>
              <th className="p-2">Days</th>
              <th className="p-2">Day 1 → Day 30 (effective · comprehension)</th>
              <th className="p-2">Certificate</th>
              <th className="p-2">Claim window</th>
              <th className="p-2">No improvement</th>
              <th className="p-2">Refund conditions</th>
              <th className="p-2">Recording</th>
              <th className="p-2">Pace control</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="p-3 text-muted-foreground">
                  No learners yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.userId} className="border-t border-border align-top" data-learner={r.email}>
                <td className="p-2">
                  <p className="font-medium">{r.name || '—'}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                  {r.phone && <p className="text-xs text-muted-foreground">{r.phone}</p>}
                </td>
                <td className="p-2 text-xs">{r.batch ?? '—'}</td>
                <td className="p-2">
                  <p className="font-semibold">{r.classes.length} of 7</p>
                  <p className="text-xs text-muted-foreground">{r.classes.length > 0 ? r.classes.join(', ') : '—'}</p>
                </td>
                <td className="whitespace-nowrap p-2 font-semibold">{r.daysCompleted} of 30</td>
                <td className="p-2 text-xs">
                  {r.day1 ? `${r.day1.effective} · ${r.day1.comprehension}%` : '—'} → {r.day30 ? `${r.day30.effective} · ${r.day30.comprehension}%` : '—'}
                </td>
                <td className="p-2 text-xs">{r.certificateCode ?? '—'}</td>
                <td className="p-2 text-xs">
                  {r.guarantee.claimWindow === null ? (
                    '—'
                  ) : (
                    <Pill tone={r.guarantee.claimWindow.open ? 'good' : 'muted'}>
                      {r.guarantee.claimWindow.open ? 'Open' : 'Expired'} · {ist(r.guarantee.claimWindow.closesAt)}
                    </Pill>
                  )}
                </td>
                <td className="p-2 text-xs">
                  {r.guarantee.noImprovement === null ? '—' : <Pill tone={r.guarantee.noImprovement ? 'bad' : 'good'}>{r.guarantee.noImprovement ? 'Yes' : 'No'}</Pill>}
                  {r.guarantee.checkBeforeRefund && (
                    <span className="mt-1 block">
                      <Pill tone="warn">Check before refund</Pill>
                    </span>
                  )}
                </td>
                <td className="p-2 text-xs">
                  <Pill tone={r.guarantee.qualifies ? 'bad' : 'muted'}>{r.guarantee.qualifies ? 'All met' : 'Not met'}</Pill>
                  <span className="mt-1 block text-muted-foreground">
                    {[r.guarantee.allDays ? null : 'days', r.guarantee.allClasses ? null : 'classes', r.guarantee.bothTests ? null : 'tests'].filter(Boolean).join(', ') || ''}
                  </span>
                </td>
                <td className="p-2">
                  <RecordingControl userId={r.userId} recordings={r.recordings} />
                </td>
                <td className="p-2">
                  <PaceToggle userId={r.userId} paceOff={r.paceOff} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
