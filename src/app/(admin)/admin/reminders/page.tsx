import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/service'
import { AdminReminderToggle } from '@/features/reminders/components/AdminReminderToggle'
import { pushConfigured } from '@/features/reminders/sendDueReminders'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = { title: 'Reminders — Admin', robots: { index: false, follow: false } }

const KIND: Record<string, string> = { daily: 'Daily', checkin: 'Check-in day', live_class: 'Live class tomorrow', missed: 'We miss you' }
const when = (iso: string): string => new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const time12 = (t: string): string => {
  const [h, m] = t.split(':').map(Number) as [number, number]
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

// Daily reminders (Phase 3): who has reminders on, the time chosen, devices,
// the last reminder, and a switch to pause anyone. Admin layout gates access.
export default async function AdminRemindersPage(): Promise<React.JSX.Element> {
  const db = createServiceClient()
  const [{ data: settings }, { data: subs }, { data: log }] = await Promise.all([
    db.from('reminder_settings').select('user_id, push_enabled, reminder_time, admin_disabled, admin_note, whatsapp_opt_in').order('updated_at', { ascending: false }),
    db.from('push_subscriptions').select('user_id, last_success_at'),
    db.from('reminder_log').select('user_id, ist_date, channel, kind, status, created_at').order('created_at', { ascending: false }).limit(200),
  ])
  const ids = [...new Set([...(settings ?? []).map((s) => s.user_id), ...(log ?? []).map((l) => l.user_id)])]
  const { data: people } = ids.length > 0 ? await db.from('profiles').select('id, full_name, email').in('id', ids) : { data: [] }
  const who = (id: string): { name: string; email: string } => {
    const p = (people ?? []).find((x) => x.id === id)
    return { name: p?.full_name?.trim() || '—', email: p?.email ?? '' }
  }
  const pushOn = (settings ?? []).filter((s) => s.push_enabled && !s.admin_disabled).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Reminders</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          One reminder a day at most, across all channels, and only when a learner has practice waiting. Phone notifications: {pushOn} learner{pushOn === 1 ? '' : 's'} on. WhatsApp: coming once the Chatboxx templates are approved.
          {!pushConfigured() && <strong className="ml-1 text-destructive">Notification keys are not configured on this server.</strong>}
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Learners</h2>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-2">Learner</th>
                <th className="p-2">Phone notifications</th>
                <th className="p-2">Time (IST)</th>
                <th className="p-2">Devices</th>
                <th className="p-2">Last reminder</th>
                <th className="p-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {(settings ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-muted-foreground">
                    Nobody has set up reminders yet.
                  </td>
                </tr>
              )}
              {(settings ?? []).map((s) => {
                const w = who(s.user_id)
                const devices = (subs ?? []).filter((d) => d.user_id === s.user_id)
                const last = (log ?? []).find((l) => l.user_id === s.user_id)
                return (
                  <tr key={s.user_id} className="border-t border-border align-top" data-reminder-row={w.email}>
                    <td className="p-2">
                      <p className="font-medium">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.email}</p>
                    </td>
                    <td className="p-2">{s.push_enabled ? 'On' : 'Off'}</td>
                    <td className="p-2">{time12(s.reminder_time)}</td>
                    <td className="p-2">{devices.length}</td>
                    <td className="p-2 text-xs">{last ? `${KIND[last.kind] ?? last.kind} · ${last.status} · ${when(last.created_at)}` : '—'}</td>
                    <td className="p-2">
                      <AdminReminderToggle userId={s.user_id} paused={s.admin_disabled} note={s.admin_note} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent reminders</h2>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-2">When</th>
                <th className="p-2">Learner</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Message</th>
                <th className="p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {(log ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-muted-foreground">
                    No reminders sent yet.
                  </td>
                </tr>
              )}
              {(log ?? []).slice(0, 100).map((l, i) => (
                <tr key={`${l.user_id}-${l.created_at}-${i}`} className="border-t border-border">
                  <td className="p-2 text-xs">{when(l.created_at)}</td>
                  <td className="p-2 text-xs">{who(l.user_id).email}</td>
                  <td className="p-2 text-xs capitalize">{l.channel}</td>
                  <td className="p-2 text-xs">{KIND[l.kind] ?? l.kind}</td>
                  <td className="p-2 text-xs capitalize">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
