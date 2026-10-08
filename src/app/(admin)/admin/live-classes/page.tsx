import type { Metadata } from 'next'
import Link from 'next/link'
import { listSessions } from '@/features/live-classes/admin/data'
import { CycleButtons, EditSession, NewSessionForm } from '@/features/live-classes/admin/components/AdminControls'
import { CLASS_TOPICS_EN, isClassNumber, isoToIst } from '@/features/live-classes/liveClasses'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = { title: 'Live classes — Admin', robots: { index: false, follow: false } }

function when(iso: string, endIso: string): string {
  const opts = { timeZone: 'Asia/Kolkata' } as const
  const date = new Date(iso).toLocaleDateString('en-IN', { ...opts, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const t = (x: string): string => new Date(x).toLocaleTimeString('en-IN', { ...opts, hour: 'numeric', minute: '2-digit' })
  return `${date}, ${t(iso)}–${t(endIso)}`
}

// Live classes (Phase 3, item 3): the rolling monthly cycle of Classes 1–7.
// Any enrolled learner can register for any session; attendance is marked
// here by the trainer only.
export default async function AdminLiveClassesPage(): Promise<React.JSX.Element> {
  const sessions = await listSessions()
  const now = Date.now()
  const upcoming = sessions.filter((s) => Date.parse(s.endsAt) > now)
  const past = sessions.filter((s) => Date.parse(s.endsAt) <= now).reverse()
  const drafts = sessions.filter((s) => s.status === 'draft').length

  const table = (rows: typeof sessions, empty: string): React.JSX.Element => (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th className="p-2">Class</th>
            <th className="p-2">When (IST)</th>
            <th className="p-2">Status</th>
            <th className="p-2">Registered</th>
            <th className="p-2">Present</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p-3 text-muted-foreground">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((s) => {
            const ist = isoToIst(s.startsAt)
            return (
              <tr key={s.id} className="border-t border-border align-top" data-admin-session={s.classNumber}>
                <td className="p-2 font-medium">
                  Class {s.classNumber} – {s.topicOverride ?? (isClassNumber(s.classNumber) ? CLASS_TOPICS_EN[s.classNumber] : '')}
                </td>
                <td className="p-2">{when(s.startsAt, s.endsAt)}</td>
                <td className="p-2 capitalize">{s.status}</td>
                <td className="p-2">{s.registered}</td>
                <td className="p-2">{s.present}</td>
                <td className="flex flex-col gap-2 p-2">
                  <Link href={`/admin/live-classes/${s.id}`} className="font-medium text-primary underline">
                    Registrations &amp; attendance
                  </Link>
                  <EditSession
                    id={s.id}
                    initial={{ classNumber: s.classNumber, topicOverride: s.topicOverride ?? '', date: ist.date, start: ist.time, end: isoToIst(s.endsAt).time, status: s.status }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Live classes</h1>
          <p className="text-sm text-muted-foreground">Monthly cycle of Classes 1–7. Learners register in the app and message you on WhatsApp; you send the Zoom link.</p>
        </div>
        <Link href="/admin/live-classes/learners" className="font-medium text-primary underline">
          Learners overview &amp; export →
        </Link>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Upcoming sessions</h2>
        <CycleButtons drafts={drafts} />
        {table(upcoming, 'No upcoming sessions. Add one below, or copy the last cycle.')}
      </section>
      <section className="space-y-3 rounded-md border border-border p-4">
        <h2 className="text-lg font-semibold">Add a session</h2>
        <NewSessionForm />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Past sessions</h2>
        {table(past, 'No past sessions yet.')}
      </section>
    </div>
  )
}
