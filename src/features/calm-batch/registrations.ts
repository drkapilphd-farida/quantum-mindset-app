// Server only (service role). 21-Day Calm Mind paid registrations — no
// migration (owner rule): each verified payment is saved in the existing
// franchise_leads table (read at /admin/franchise-leads too), tagged
// "[calm-batch] <startDate>" in `background`, so seats left, the admin list,
// the CSV export and the reminder emails all read the same rows.
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { idFromKey, UNIQUE_VIOLATION } from '@/lib/idFromKey'

export type CalmRegistration = { name: string; phone: string; email: string; paymentId: string; orderId: string; batch: string; paidAt: string; utm: string | null }

export const CALM_TAG = (startDate: string): string => `[calm-batch] ${startDate}`

export function registrationBackground(r: Omit<CalmRegistration, 'name' | 'phone' | 'paidAt'>): string {
  return [CALM_TAG(r.batch), `Payment: ${r.paymentId}`, `Order: ${r.orderId}`, `Email: ${r.email}`, 'Amount: ₹2,999', ...(r.utm !== null ? [`UTM: ${r.utm}`] : [])].join('\n')
}

/** Reads a saved row back (tolerant of missing lines). */
export function parseRegistration(row: { name: string; phone: string; background: string | null; submitted_at: string }): CalmRegistration | null {
  const lines = (row.background ?? '').split('\n')
  const head = /^\[calm-batch\] (\d{4}-\d{2}-\d{2})$/.exec(lines[0] ?? '')
  if (head === null) return null
  const field = (label: string): string => lines.find((line) => line.startsWith(`${label}: `))?.slice(label.length + 2) ?? ''
  const utm = field('UTM')
  return { name: row.name, phone: row.phone, email: field('Email'), paymentId: field('Payment'), orderId: field('Order'), batch: head[1] ?? '', paidAt: row.submitted_at, utm: utm === '' ? null : utm }
}

function db(): ReturnType<typeof createServiceClient> | null {
  try {
    return createServiceClient()
  } catch {
    return null
  }
}

/** Verified paid registrations for a batch; null when the database is not reachable. */
export async function countPaidRegistrations(startDate: string): Promise<number | null> {
  const client = db()
  if (client === null) return null
  const { count, error } = await client.from('franchise_leads').select('id', { count: 'exact', head: true }).like('background', `${CALM_TAG(startDate)}%`)
  if (error) {
    logger.warn('[calm-batch] could not count registrations', { error: error.message })
    return null
  }
  return count ?? 0
}

export async function listRegistrations(startDate?: string): Promise<CalmRegistration[]> {
  const client = db()
  if (client === null) return []
  const { data, error } = await client
    .from('franchise_leads')
    .select('name, phone, background, submitted_at')
    .like('background', startDate === undefined ? '[calm-batch]%' : `${CALM_TAG(startDate)}%`)
    .order('submitted_at', { ascending: false })
  if (error) {
    logger.warn('[calm-batch] could not list registrations', { error: error.message })
    return []
  }
  return (data ?? []).map(parseRegistration).filter((r): r is CalmRegistration => r !== null)
}

export type SaveResult = 'created' | 'exists' | 'failed'

/**
 * Saves a verified payment exactly once. The row's id is derived from the
 * payment ID, so the database refuses a second row for the same payment even
 * when the browser and the Razorpay webhook arrive at the same moment.
 */
export async function saveRegistration(r: Omit<CalmRegistration, 'paidAt'>): Promise<SaveResult> {
  const client = db()
  if (client === null) return 'failed'
  const { error } = await client.from('franchise_leads').insert({ id: idFromKey(`calm-batch:${r.paymentId}`), name: r.name, phone: r.phone, city: 'Online — Calm Mind batch', background: registrationBackground(r) })
  if (error === null) return 'created'
  if (error.code === UNIQUE_VIOLATION) return 'exists'
  logger.warn('[calm-batch] could not save registration', { error: error.message })
  return 'failed'
}

/**
 * Reminder sent-log: claims "this registration + this reminder type" before
 * sending (a row with an id derived from both). A second claim is refused by
 * the database, so a reminder is never sent twice. Kept in the same table,
 * tagged "[calm-reminder]" (hidden from the leads list).
 */
export const REMINDER_TAG = '[calm-reminder]'

export async function claimReminder(paymentId: string, type: string): Promise<'claimed' | 'already-sent' | 'failed'> {
  const client = db()
  if (client === null) return 'failed'
  const { error } = await client.from('franchise_leads').insert({ id: idFromKey(`calm-reminder:${paymentId}:${type}`), name: 'Calm Mind reminder', phone: '-', city: '-', background: `${REMINDER_TAG} ${type}\nPayment: ${paymentId}` })
  if (error === null) return 'claimed'
  if (error.code === UNIQUE_VIOLATION) return 'already-sent'
  logger.warn('[calm-batch] could not log reminder', { error: error.message })
  return 'failed'
}

/** Frees a claim when the email itself failed, so the next cron run (still inside the window) tries again. */
export async function releaseReminder(paymentId: string, type: string): Promise<void> {
  const client = db()
  if (client === null) return
  await client.from('franchise_leads').delete().eq('id', idFromKey(`calm-reminder:${paymentId}:${type}`))
}
