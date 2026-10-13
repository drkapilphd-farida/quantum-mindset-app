import { createServiceClient } from '@/lib/supabase/service'
import { PAYMENT_MODE_LABEL, type PaymentMode } from '@/features/manual-enrolments/rules'

export type EnrolmentRow = {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  offer: string | null
  amountInr: number | null
  paidAt: string
  /** Access granted (an account matched); false = waiting for the buyer to sign up. */
  granted: boolean
  /** 'Razorpay', or the manual payment mode (GPay / Cash / Bank transfer). */
  paidVia: string
  /** A manual payment refunded from /admin/manual-enrolments (not in the total). */
  refunded: boolean
}

export type BatchGroup = { batchStart: string | null; rows: EnrolmentRow[]; totalInr: number }

// Master-admin only (the (admin)/layout.tsx ADMIN_EMAILS gate) — the
// service-role client bypasses RLS and must never reach the browser.
// Every row of masterclass_payments is a 30-Day Program payment (the
// webhook records nothing else). Payments from the fixed links carry no
// batch and are listed under "Batch not recorded".
export async function getEnrolmentsByBatch(): Promise<BatchGroup[]> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('masterclass_payments')
    .select('id, customer_name, phone, email, offer, amount_cents, created_at, batch_start, granted_at, user_id, source, payment_mode, paid_on, refunded_at')
    .order('created_at', { ascending: false })
    .limit(2000)
  const rows = data ?? []

  // Fall back to the learner's profile name when the payment link had none.
  const userIds = [...new Set(rows.filter((r) => r.customer_name === null && r.user_id !== null).map((r) => r.user_id as string))]
  const names = new Map<string, string>()
  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds)
    for (const p of profiles ?? []) if (p.full_name !== null) names.set(p.id, p.full_name)
  }

  const groups = new Map<string | null, EnrolmentRow[]>()
  for (const r of rows) {
    const list = groups.get(r.batch_start) ?? []
    list.push({
      id: r.id,
      name: r.customer_name ?? (r.user_id !== null ? (names.get(r.user_id) ?? null) : null),
      phone: r.phone,
      email: r.email,
      offer: r.offer,
      amountInr: r.amount_cents === null ? null : r.amount_cents / 100,
      // A manual payment's date is the day it was paid, not the day it was recorded.
      paidAt: r.source === 'manual' && r.paid_on ? `${r.paid_on}T12:00:00+05:30` : r.created_at,
      granted: r.granted_at !== null && r.refunded_at === null,
      paidVia: r.source === 'manual' ? (PAYMENT_MODE_LABEL[r.payment_mode as PaymentMode] ?? 'Manual') : 'Razorpay',
      refunded: r.refunded_at !== null,
    })
    groups.set(r.batch_start, list)
  }

  // Newest batch first; "not recorded" last.
  return [...groups.entries()]
    .sort(([a], [b]) => (a === null ? 1 : b === null ? -1 : b.localeCompare(a)))
    .map(([batchStart, list]) => ({ batchStart, rows: list, totalInr: list.filter((r) => !r.refunded).reduce((sum, r) => sum + (r.amountInr ?? 0), 0) }))
}
