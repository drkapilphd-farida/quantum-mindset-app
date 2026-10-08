'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { currentAdminEmail } from '@/features/live-classes/admin/data'

// Trainer-only: pause or resume reminders for any learner. Re-checks
// ADMIN_EMAILS (Server Actions can be called directly).
export async function setRemindersPaused(input: unknown): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  if ((await currentAdminEmail()) === null) return { ok: false, error: 'Not authorized.' }
  const parsed = z.object({ userId: z.string().uuid(), paused: z.boolean(), note: z.string().trim().max(200).optional() }).safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid request.' }
  const { userId, paused, note } = parsed.data
  const { error } = await createServiceClient()
    .from('reminder_settings')
    .upsert({ user_id: userId, admin_disabled: paused, admin_note: paused ? note || null : null, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) return { ok: false, error: 'Could not save.' }
  return { ok: true, message: paused ? 'Reminders paused for this learner.' : 'Reminders resumed.' }
}
