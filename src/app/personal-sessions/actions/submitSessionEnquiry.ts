'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { sendSessionEnquiryNotification } from '@/lib/email/sendSessionEnquiryNotification'
import { NOT_SURE, SessionEnquirySchema } from './enquirySchema'
import { getProgram, isProgramSlug } from '@/features/programs/programs'

export type SubmitSessionEnquiryResult = { success: true } | { success: false; error: string }

// /personal-sessions Clarity Session request. No migration (owner, Nov 2026): saved to the
// existing franchise_leads table, which already has an admin page
// (/admin/franchise-leads). Marked "[1-on-1]" in `background` so it is
// never mistaken for a partner application; the answer to "What would you
// like to change in your life, and why?" goes into `why_interested`.
export async function submitSessionEnquiry(input: unknown): Promise<SubmitSessionEnquiryResult> {
  const parsed = SessionEnquirySchema.safeParse(input)
  if (!parsed.success) {
    logger.warn('[session-enquiries] submit input failed validation', { issues: parsed.error.issues.map((issue) => issue.path.join('.')) })
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check your details and try again.' }
  }
  const { name, phone, city, program, change, source, website } = parsed.data
  if (website !== undefined && website !== '') return { success: true }
  const programName = program === NOT_SURE || !isProgramSlug(program) ? 'Not sure yet' : getProgram(program).name.en

  const supabase = await createClient()
  const { error } = await supabase.from('franchise_leads').insert({
    name,
    phone,
    city,
    background: [`[1-on-1] Clarity Session request (/personal-sessions)`, `Program: ${programName}`, ...(source !== undefined && source !== '' ? [`From page: ${source}`] : [])].join('\n'),
    why_interested: change,
  })
  if (error) {
    logger.warn('[session-enquiries] failed to save enquiry', { error: error.message })
    return { success: false, error: 'Something went wrong. Please try again, or message us on WhatsApp.' }
  }

  await sendSessionEnquiryNotification({ name, phone, city, area: programName, change })
  return { success: true }
}
