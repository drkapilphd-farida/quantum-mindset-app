'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { leadTag } from '@/features/partner/earnings'
import { sendPartnerApplicationNotification } from '@/lib/email/sendPartnerApplicationNotification'
import { PartnerApplicationSchema } from './partnerApplicationSchema'

export type SubmitPartnerApplicationResult = { success: true } | { success: false; error: string }

// /partner apply form. Saved to the same place as the earlier franchise
// form (franchise_leads, read at /admin/franchise-leads) — no migration:
// the tag and the four answers go into the existing text columns
// (background = tag + source + Q1/Q2, why_interested = Q3/Q4).
// The email is best-effort; the application counts as saved once the
// insert succeeds.
export async function submitPartnerApplication(input: unknown): Promise<SubmitPartnerApplicationResult> {
  const parsed = PartnerApplicationSchema.safeParse(input)
  if (!parsed.success) {
    logger.warn('[partner-applications] submit input failed validation', { issues: parsed.error.issues.map((issue) => issue.path.join('.')) })
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check your details and try again.' }
  }

  const { name, phone, city, occupation, contact, invest, start, website } = parsed.data
  // Honeypot filled → a bot. Pretend it worked, save nothing.
  if (website !== undefined && website !== '') return { success: true }

  const tag = leadTag(contact, invest)
  const supabase = await createClient()
  const { error } = await supabase.from('franchise_leads').insert({
    name,
    phone,
    city,
    background: [`[${tag}] Partner application (/partner)`, `What they do now: ${occupation}`, `Contact with children or parents: ${contact}`].join('\n'),
    why_interested: [`Ready to invest ₹45,000 + GST: ${invest}`, `When to start: ${start}`].join('\n'),
  })

  if (error) {
    logger.warn('[partner-applications] failed to save application', { error: error.message })
    return { success: false, error: 'Something went wrong. Please try again, or message us on WhatsApp.' }
  }

  await sendPartnerApplicationNotification({ tag, name, phone, city, occupation, contact, invest, start })
  return { success: true }
}
