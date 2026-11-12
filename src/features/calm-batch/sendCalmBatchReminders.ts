// Server only. Called by the existing reminders cron (/api/cron/reminders,
// every 15 minutes): emails the batch's registrations the day before class 1
// and 1 hour before each class.
import { calmMindBatch } from '@/config/site.config'
import { sendCalmReminder } from '@/lib/email/sendCalmBatchEmails'
import { dueReminders } from './batch'
import { listRegistrations } from './registrations'

export async function sendCalmBatchReminders(nowMs: number = Date.now()): Promise<{ due: number; sent: number; failed: number }> {
  const due = dueReminders(nowMs)
  const summary = { due: due.length, sent: 0, failed: 0 }
  if (due.length === 0) return summary
  const regs = await listRegistrations(calmMindBatch.nextBatch.startDate)
  for (const reminder of due) {
    const result = await sendCalmReminder(reminder, regs)
    summary.sent += result.sent
    summary.failed += result.failed
  }
  return summary
}
