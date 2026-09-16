import { Resend } from 'resend'
import { logger } from '@/lib/logger'

// Same Resend pattern as sendFranchiseLeadNotification.ts — deliberately
// no-ops (logs a warning, never throws) when RESEND_API_KEY isn't set,
// same "unconfigured = skip, don't break the real thing it's attached
// to" posture. Added as an immediate, reliable fallback lead-storage
// path (see the "URGENT: Fix Broken Lead Capture" task) for when the
// overthinking_test_leads Supabase table doesn't exist yet in a given
// environment — submitOverthinkingTestLead.ts calls this regardless of
// whether the Supabase insert succeeded, and only reports failure to
// the visitor if BOTH this and the database write failed.
const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'

// Same 0–7 Low / 8–14 Moderate / 15–20 High thresholds as
// OverthinkingTestExperience.tsx's own bandFor() — duplicated here
// (not imported) because that file is a client component and this one
// is server-only; keeping this one small and self-contained is simpler
// than threading a shared util through the client/server boundary for
// three lines of logic. If the thresholds ever change, update both.
function bandLabel(score0to20: number): string {
  if (score0to20 <= 7) return 'Low'
  if (score0to20 <= 14) return 'Moderate'
  return 'High'
}

export type OverthinkingTestLeadNotificationInput = {
  name: string
  whatsappNumber: string
  overthinkingScore: number
  worryScore: number
  stressScore: number
  overallScore: number
  databaseSaveSucceeded: boolean
}

export async function sendOverthinkingTestLeadNotification(lead: OverthinkingTestLeadNotificationInput): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('[overthinking-test] RESEND_API_KEY not set — skipping email notification')
    return { sent: false, error: 'RESEND_API_KEY not set' }
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const notifyEmail = process.env.OVERTHINKING_TEST_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notifyEmail,
    subject: `New Overthinking Test lead — ${lead.name}`,
    text: [
      `New Overthinking Test (/mind-assessment) submission:`,
      ``,
      `Name: ${lead.name}`,
      `WhatsApp: ${lead.whatsappNumber}`,
      `Overthinking Score: ${lead.overthinkingScore}/20 (${bandLabel(lead.overthinkingScore)})`,
      `Worry Score: ${lead.worryScore}/20 (${bandLabel(lead.worryScore)})`,
      `Stress Score: ${lead.stressScore}/20 (${bandLabel(lead.stressScore)})`,
      `Overall Score: ${lead.overallScore}/60`,
      ``,
      lead.databaseSaveSucceeded
        ? `Also saved to the overthinking_test_leads table.`
        : `NOTE: the database save FAILED for this lead — this email is the only record. Check the overthinking_test_leads table/migration.`,
    ].join('\n'),
  })

  if (error) {
    logger.warn('[overthinking-test] failed to send notification email', { error: error.message })
    return { sent: false, error: error.message }
  }

  return { sent: true }
}
