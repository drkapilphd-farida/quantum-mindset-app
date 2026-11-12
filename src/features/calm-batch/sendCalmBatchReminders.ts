// Server only. Called by the existing reminders cron (/api/cron/reminders,
// every 15 minutes): emails the batch's registrations the day before class 1
// and before each class. Sent-log: each "registration + reminder type" is
// claimed in the database before sending — a second claim is refused, so a
// reminder is never sent twice; a failed email frees its claim to retry.
import { calmMindBatch } from '@/config/site.config'
import { sendCalmReminderTo } from '@/lib/email/sendCalmBatchEmails'
import { dueReminders, reminderType, type DueReminder } from './batch'
import { claimReminder, listRegistrations, releaseReminder, type CalmRegistration } from './registrations'

export type ReminderDeps = {
  list: (startDate: string) => Promise<CalmRegistration[]>
  claim: (paymentId: string, type: string) => Promise<'claimed' | 'already-sent' | 'failed'>
  release: (paymentId: string, type: string) => Promise<void>
  send: (r: DueReminder, reg: CalmRegistration) => Promise<boolean>
}

const LIVE: ReminderDeps = { list: listRegistrations, claim: claimReminder, release: releaseReminder, send: sendCalmReminderTo }

export async function sendCalmBatchReminders(nowMs: number = Date.now(), deps: ReminderDeps = LIVE): Promise<{ due: number; sent: number; skipped: number; failed: number }> {
  const due = dueReminders(nowMs)
  const summary = { due: due.length, sent: 0, skipped: 0, failed: 0 }
  if (due.length === 0) return summary
  const regs = (await deps.list(calmMindBatch.nextBatch.startDate)).filter((r) => r.email !== '' && r.paymentId !== '')
  for (const reminder of due) {
    const type = reminderType(reminder)
    for (const reg of regs) {
      const claim = await deps.claim(reg.paymentId, type)
      if (claim === 'already-sent') {
        summary.skipped += 1
        continue
      }
      // No sent-log available (database not reachable): don't send — better a missed reminder than a repeated one.
      if (claim === 'failed') {
        summary.failed += 1
        continue
      }
      if (await deps.send(reminder, reg)) summary.sent += 1
      else {
        summary.failed += 1
        await deps.release(reg.paymentId, type)
      }
    }
  }
  return summary
}
