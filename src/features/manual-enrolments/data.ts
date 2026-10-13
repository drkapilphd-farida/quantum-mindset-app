import { createServiceClient } from '@/lib/supabase/service'
import { manualStatus, refundBy, type ManualStatus, type PaymentMode } from './rules'

export type ManualEnrolment = {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  amountInr: number | null
  mode: PaymentMode
  paidOn: string
  refundBy: string
  batchStart: string | null
  recordedBy: string | null
  note: string | null
  status: ManualStatus
}

/** Every manual enrolment, newest payment first (admin only — service client). */
export async function listManualEnrolments(): Promise<ManualEnrolment[]> {
  const { data } = await createServiceClient()
    .from('masterclass_payments')
    .select('id, email, customer_name, phone, amount_cents, payment_mode, paid_on, batch_start, recorded_by, note, refunded_at, user_id, granted_at')
    .eq('source', 'manual')
    .order('paid_on', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1000)
  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    name: r.customer_name,
    phone: r.phone,
    amountInr: r.amount_cents === null ? null : r.amount_cents / 100,
    mode: (r.payment_mode ?? 'gpay') as PaymentMode,
    paidOn: r.paid_on ?? '',
    refundBy: r.paid_on ? refundBy(r.paid_on) : '',
    batchStart: r.batch_start,
    recordedBy: r.recorded_by,
    note: r.note,
    status: manualStatus(r),
  }))
}
