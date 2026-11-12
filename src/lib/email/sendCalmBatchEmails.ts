import { Resend } from 'resend'
import { calmMindBatch } from '@/config/site.config'
import { logger } from '@/lib/logger'
import { buildBatchIcs, formatBatchDate } from '@/features/calm-batch/batch'
import type { CalmRegistration } from '@/features/calm-batch/registrations'

// 21-Day Calm Mind batch emails (owner's brief): confirmation with the .ics,
// the owner's "payment came in" notice when the joining links are missing,
// and class reminders. Same Resend setup and "unconfigured = skip, never
// throw" rule as the other emails.

const DEFAULT_NOTIFY_EMAIL = 'drkapilphd@gmail.com'

function client(): { resend: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    logger.warn('[calm-batch] RESEND_API_KEY not set — skipping email')
    return null
  }
  return { resend: new Resend(apiKey), from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev' }
}

const start = (): string => formatBatchDate(calmMindBatch.nextBatch.startDate, 'en')
const schedule = (): string => `${calmMindBatch.nextBatch.days.en} · ${calmMindBatch.nextBatch.time.en}`

/** Plain-text body of the confirmation email (exported for tests). */
export function confirmationText(name: string, links: { zoom: string | undefined; whatsapp: string | undefined }): string {
  const classes = calmMindBatch.nextBatch.classDates.map((iso, i) => `  Class ${i + 1}: ${formatBatchDate(iso, 'en')}, 8:00–9:00 PM IST`).join('\n')
  return [
    `Namaste ${name},`,
    ``,
    `You're in! Welcome to the 21-Day Calm Mind batch with Dr. Kapil Dev Sharma.`,
    ``,
    `Starts: ${start()} · ${schedule()}`,
    classes,
    ``,
    `Zoom link: ${links.zoom ?? 'reaches you on WhatsApp within 2 hours'}`,
    `WhatsApp group: ${links.whatsapp ?? 'reaches you on WhatsApp within 2 hours'}`,
    ``,
    `The attached calendar file adds all 6 classes to your calendar.`,
    ``,
    `Before class 1: a quiet place · headphones · write in one line what you want to feel on day 21.`,
    ``,
    `This is a coaching and meditation program, not a substitute for medical or psychological treatment. If you are in crisis, please contact a doctor or Tele-MANAS 14416.`,
  ].join('\n')
}

export async function sendCalmConfirmation(reg: CalmRegistration): Promise<void> {
  const c = client()
  if (c === null || reg.email === '') return
  const links = { zoom: calmMindBatch.zoomLink || undefined, whatsapp: calmMindBatch.whatsappGroupLink || undefined }
  const { error } = await c.resend.emails.send({
    from: c.from,
    to: reg.email,
    subject: `You're in: 21-Day Calm Mind batch starts ${start()}`,
    text: confirmationText(reg.name, links),
    attachments: [{ filename: 'calm-mind-classes.ics', content: Buffer.from(buildBatchIcs({ zoomLink: links.zoom })).toString('base64') }],
  })
  if (error) logger.warn('[calm-batch] confirmation email failed', { error: error.message })
}

/** The owner's notice that a payment came in while the joining links are not set (send them by hand). */
export async function sendCalmAdminNotice(reg: CalmRegistration): Promise<void> {
  const c = client()
  if (c === null) return
  const { error } = await c.resend.emails.send({
    from: c.from,
    to: process.env.FRANCHISE_LEAD_NOTIFY_EMAIL ?? DEFAULT_NOTIFY_EMAIL,
    subject: `[Calm Mind batch] Payment received — ${reg.name} — send joining details`,
    text: [
      `A payment for the 21-Day Calm Mind batch (${start()}) came in, but the Zoom / WhatsApp links are not set (CALM_BATCH_ZOOM_LINK / CALM_BATCH_WHATSAPP_LINK).`,
      `The buyer was told the joining details reach them on WhatsApp within 2 hours.`,
      ``,
      `Name: ${reg.name}`,
      `WhatsApp: ${reg.phone}`,
      `Email: ${reg.email}`,
      `Payment ID: ${reg.paymentId}`,
      ``,
      `All registrations: /admin/calm-mind-batch`,
    ].join('\n'),
  })
  if (error) logger.warn('[calm-batch] admin notice failed', { error: error.message })
}

export type CalmReminder = { kind: 'day-before' | 'hour-before'; classNumber: number }

export function reminderSubject(r: CalmReminder): string {
  return r.kind === 'day-before' ? `Tomorrow: your 21-Day Calm Mind batch starts (8:00 PM IST)` : `In 1 hour: Calm Mind live class ${r.classNumber} of 6 (8:00 PM IST)`
}

export async function sendCalmReminder(r: CalmReminder, regs: CalmRegistration[]): Promise<{ sent: number; failed: number }> {
  const c = client()
  const summary = { sent: 0, failed: 0 }
  if (c === null) return summary
  const zoom = calmMindBatch.zoomLink || 'in your confirmation email and on WhatsApp'
  for (const reg of regs) {
    if (reg.email === '') continue
    const { error } = await c.resend.emails.send({
      from: c.from,
      to: reg.email,
      subject: reminderSubject(r),
      text: [`Namaste ${reg.name},`, ``, r.kind === 'day-before' ? `Your 21-Day Calm Mind batch starts tomorrow, 8:00–9:00 PM IST.` : `Live class ${r.classNumber} of 6 starts in 1 hour (8:00 PM IST).`, ``, `Zoom: ${zoom}`, ``, `A quiet place and headphones help. See you there!`].join('\n'),
    })
    if (error) summary.failed += 1
    else summary.sent += 1
  }
  return summary
}
