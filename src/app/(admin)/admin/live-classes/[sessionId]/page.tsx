import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSessionDetail } from '@/features/live-classes/admin/data'
import { SessionAttendance } from '@/features/live-classes/admin/components/AdminControls'
import { CLASS_TOPICS_EN, isClassNumber } from '@/features/live-classes/liveClasses'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = { title: 'Class attendance — Admin', robots: { index: false, follow: false } }

// One session: who registered (name, email, phone). After class: mark all
// registered as present, then correct from the Zoom participant list.
export default async function AdminSessionPage({ params }: { params: Promise<{ sessionId: string }> }): Promise<React.JSX.Element> {
  const { sessionId } = await params
  if (!/^[0-9a-f-]{36}$/.test(sessionId)) notFound()
  const detail = await getSessionDetail(sessionId)
  if (detail === null) notFound()
  const { session, attendees } = detail
  const opts = { timeZone: 'Asia/Kolkata' } as const
  const date = new Date(session.startsAt).toLocaleDateString('en-IN', { ...opts, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = (x: string): string => new Date(x).toLocaleTimeString('en-IN', { ...opts, hour: 'numeric', minute: '2-digit' })
  const present = attendees.filter((a) => a.present).length
  const registered = attendees.filter((a) => a.registered).length
  return (
    <div className="space-y-6">
      <Link href="/admin/live-classes" className="text-sm text-primary underline">
        ← All sessions
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">
          Class {session.classNumber} – {session.topicOverride ?? (isClassNumber(session.classNumber) ? CLASS_TOPICS_EN[session.classNumber] : '')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {date}, {time(session.startsAt)}–{time(session.endsAt)} IST · {session.status} · {registered} registered · {present} present
        </p>
      </div>
      <SessionAttendance sessionId={session.id} attendees={attendees} />
    </div>
  )
}
