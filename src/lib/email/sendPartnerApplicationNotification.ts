import { Resend } from 'resend'
import { logger } from '@/lib/logger'
import { PARTNER_BOOKING_LINK, PARTNER_VIDEO_LINK } from '@/config/partnerProgram'
import type { LeadTag } from '@/features/partner/earnings'

// /partner application → email to the owner, same Resend setup and same
// "unconfigured = skip, never throw" rule as sendFranchiseLeadNotification.
// The email carries a one-tap WhatsApp link that opens a chat with the
// applicant, with the 3-minute video and booking link already typed in
// (the site has no WhatsApp API, so the owner sends it with one tap).
const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'

export type PartnerApplicationNotification = {
  tag: LeadTag
  name: string
  phone: string
  city: string
  occupation: string
  contact: string
  invest: string
  start: string
}

export function applicantReplyText(name: string): string {
  return [
    `Namaste ${name}, thank you for applying to the Sharp Brain Partner Program.`,
    `Here is my 3-minute video: ${PARTNER_VIDEO_LINK}`,
    `Book your 30-minute meeting here: ${PARTNER_BOOKING_LINK}`,
    `— Dr. Kapil Dev Sharma`,
  ].join('\n')
}

export async function sendPartnerApplicationNotification(lead: PartnerApplicationNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('[partner-applications] RESEND_API_KEY not set — skipping email notification')
    return
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const notifyEmail = process.env.FRANCHISE_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL
  const replyLink = `https://wa.me/${lead.phone.replace('+', '')}?text=${encodeURIComponent(applicantReplyText(lead.name))}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notifyEmail,
    subject: `[${lead.tag}] New partner application — ${lead.name} (${lead.city})`,
    text: [
      `New Sharp Brain Partner application (/partner) — tag ${lead.tag}`,
      ``,
      `Name: ${lead.name}`,
      `WhatsApp: ${lead.phone}`,
      `City / Area: ${lead.city}`,
      `What they do now: ${lead.occupation}`,
      `Contact with children or parents: ${lead.contact}`,
      `Ready to invest ₹45,000 + GST: ${lead.invest}`,
      `When to start: ${lead.start}`,
      ``,
      `Send them the video and booking link on WhatsApp (one tap):`,
      replyLink,
      ``,
      `All applications: /admin/franchise-leads`,
    ].join('\n'),
  })

  if (error) {
    logger.warn('[partner-applications] failed to send notification email', { error: error.message })
  }
}
