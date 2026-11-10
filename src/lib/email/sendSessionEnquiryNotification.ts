import { Resend } from 'resend'
import { logger } from '@/lib/logger'

// /personal-sessions enquiry → email to the owner. Same Resend setup and
// "unconfigured = skip, never throw" rule as the franchise/partner emails.
// Includes a one-tap WhatsApp link to reply to the person.
const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'

export type SessionEnquiryNotification = { name: string; phone: string; city: string; area: string; plan?: string; retreatNotify?: boolean; change: string }

export async function sendSessionEnquiryNotification(enquiry: SessionEnquiryNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('[session-enquiries] RESEND_API_KEY not set — skipping email notification')
    return
  }
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const notifyEmail = process.env.FRANCHISE_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL
  const reply = `Namaste ${enquiry.name}, thank you for your enquiry about personal sessions with Dr. Kapil.`
  const replyLink = `https://wa.me/${enquiry.phone.replace('+', '')}?text=${encodeURIComponent(reply)}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: notifyEmail,
    subject: `[1-on-1] Clarity Session request — ${enquiry.area} — ${enquiry.name} (${enquiry.city})`,
    text: [
      `New Clarity Session request (/personal-sessions)`,
      ``,
      `Name: ${enquiry.name}`,
      `WhatsApp: ${enquiry.phone}`,
      `City: ${enquiry.city}`,
      `Program: ${enquiry.area}`,
      ...(enquiry.plan !== undefined ? [`Plan: ${enquiry.plan}`] : []),
      ...(enquiry.retreatNotify === true ? ['Notify me about in-person retreats (Rishikesh / Lonavala): Yes'] : []),
      ``,
      `What would you like to change in your life, and why?`,
      enquiry.change,
      ``,
      `Reply on WhatsApp (one tap):`,
      replyLink,
      ``,
      `All enquiries: /admin/franchise-leads (marked [1-on-1])`,
    ].join('\n'),
  })
  if (error) logger.warn('[session-enquiries] failed to send notification email', { error: error.message })
}
