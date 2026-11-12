// Server only. One place that completes a verified Calm Mind batch payment —
// called by the browser after Checkout (confirmCalmPayment) and by the
// Razorpay webhook (payment.captured). The row is saved once (unique on the
// payment ID); emails go out only when this call created it, so the buyer
// never gets two confirmations.
import { calmMindBatch } from '@/config/site.config'
import { logger } from '@/lib/logger'
import { sendCalmAdminNotice, sendCalmConfirmation } from '@/lib/email/sendCalmBatchEmails'
import { saveRegistration, type CalmRegistration, type SaveResult } from './registrations'

export type CalmPaymentSource = 'checkout' | 'webhook'

export async function finalizeCalmRegistration(reg: Omit<CalmRegistration, 'paidAt'>, source: CalmPaymentSource): Promise<SaveResult> {
  const result = await saveRegistration(reg)
  if (result === 'exists') return result
  const full: CalmRegistration = { ...reg, paidAt: new Date().toISOString() }
  // 'failed' (database not reachable): still email the buyer — they paid and need their joining details.
  if (result === 'failed') logger.warn('[calm-batch] registration not saved — emailing anyway', { source })
  await sendCalmConfirmation(full)
  const linksMissing = !calmMindBatch.zoomLink || !calmMindBatch.whatsappGroupLink
  // The owner hears about every webhook-only payment (the buyer never came back to the site), and about any payment while the links are missing.
  if (source === 'webhook' || linksMissing || result === 'failed') await sendCalmAdminNotice(full, { source, linksMissing, saved: result === 'created' })
  return result
}
