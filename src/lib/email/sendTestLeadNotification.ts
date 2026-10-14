import { Resend } from 'resend'
import { logger } from '@/lib/logger'

// Emails the founder the moment a free-test lead is saved, so a lead is never
// missed even if the visitor never presses Send in WhatsApp. Same posture as
// sendFranchiseLeadNotification: no RESEND_API_KEY = skip (logged), never
// throws — the lead is already saved before this runs.
const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'

export type TestLeadNotification = {
  firstName: string | null
  whatsappNumber: string
  lang: string
  effectiveWpm: number
  wpm: number
  comprehensionPercent: number
  retention: string | null
  memory: string | null
  profile: string | null
  offer: string | null
  utmSource: string | null
}

export async function sendTestLeadNotification(lead: TestLeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('[test-leads] RESEND_API_KEY not set — skipping email notification')
    return
  }
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const notifyEmail = process.env.TEST_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL
  const who = lead.firstName?.trim() || 'No name'
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New test lead — ${who} · ${lead.effectiveWpm} WPM`,
      text: [
        `New free-test lead:`,
        ``,
        `Name: ${who}`,
        `WhatsApp: +${lead.whatsappNumber}  (https://wa.me/${lead.whatsappNumber})`,
        `Language: ${lead.lang}`,
        `Effective speed: ${lead.effectiveWpm} WPM (reading ${lead.wpm} WPM, understanding ${lead.comprehensionPercent}%)`,
        lead.retention ? `Retention: ${lead.retention}` : null,
        lead.memory ? `Memory: ${lead.memory}` : null,
        `Profile: ${lead.profile ?? '—'}`,
        `Offer: ${lead.offer ?? 'none'}`,
        `Source: ${lead.utmSource ?? 'direct'}`,
        ``,
        `All leads: https://app.mindurmind.org.in/admin/test-leads`,
      ]
        .filter((l): l is string => l !== null)
        .join('\n'),
    })
    if (error) logger.warn('[test-leads] notification email failed', { error: error.message })
  } catch (e) {
    logger.warn('[test-leads] notification email threw', { error: e instanceof Error ? e.message : 'unknown' })
  }
}
