'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { sendSessionEnquiryNotification } from '@/lib/email/sendSessionEnquiryNotification'
import { NOT_SURE, SessionEnquirySchema } from './enquirySchema'
import { getProgram, isProgramSlug } from '@/features/programs/programs'
import { getPlan, isPlanId } from '@/features/programs/plans'
import { utmToLine } from '@/lib/analytics/utmLine'

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
  const { name, phone, city, program, plan, retreatNotify, change = '', source, utm, website } = parsed.data
  if (website !== undefined && website !== '') return { success: true }
  const programName = program === NOT_SURE || !isProgramSlug(program) ? 'Not sure yet' : getProgram(program).name.en
  const planName = plan !== undefined && isPlanId(plan) ? getPlan(plan).name.en : undefined
  const utmLine = utmToLine(utm)
  const notify = program === 'personal-retreat' && retreatNotify === true

  const supabase = await createClient()
  const { error } = await supabase.from('franchise_leads').insert({
    name,
    phone,
    city,
    background: [`[1-on-1] Clarity Session request (/personal-sessions)`, `Program: ${programName}`, ...(planName !== undefined ? [`Plan: ${planName}`] : []), ...(notify ? ['Notify me about in-person retreats (Rishikesh / Lonavala): Yes'] : []), ...(source !== undefined && source !== '' ? [`From page: ${source}`] : []), ...(utmLine !== null ? [`UTM: ${utmLine}`] : [])].join('\n'),
    why_interested: change,
  })
  if (error) {
    logger.warn('[session-enquiries] failed to save enquiry', { error: error.message })
    return { success: false, error: 'Something went wrong. Please try again, or message us on WhatsApp.' }
  }

  await sendSessionEnquiryNotification({ name, phone, city, area: programName, ...(planName !== undefined ? { plan: planName } : {}), retreatNotify: notify, change })
  return { success: true }
}
