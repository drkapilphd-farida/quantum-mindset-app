'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { OverthinkingTestLeadInputSchema } from './overthinkingTestLeadSchema'

export type SubmitOverthinkingTestLeadResult = { success: true } | { success: false; error: string }

// Persists an Overthinking Test (/mind-assessment) lead — same pattern
// as submitLead.ts (Discover Your Learning Potential assessment) and
// submitFranchiseLead.ts: Reachable before sign-in by design (the whole
// point of this flow is to capture contact info for a visitor with no
// account yet), so this never checks for a signed-in user. Row Level
// Security (overthinking_test_leads_insert_anonymous), not this
// function, is what actually keeps the table insert-only for the anon
// role; this Server Action's job is input validation and keeping the
// raw Supabase call off the client.
//
// This is the required, primary lead-storage mechanism (see the "Build
// the Overthinking Test Free Assessment" task, Section 6a) — it must
// succeed independent of whether the visitor goes on to tap Send on the
// follow-up WhatsApp message (buildOverthinkingTestWhatsAppLink, called
// separately by the client after this resolves successfully).
export async function submitOverthinkingTestLead(input: unknown): Promise<SubmitOverthinkingTestLeadResult> {
  const parsed = OverthinkingTestLeadInputSchema.safeParse(input)
  if (!parsed.success) {
    logger.warn('[overthinking-test] lead input failed validation', { issues: parsed.error.issues })
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check your details and try again.' }
  }

  const { fullName, whatsappNumber, overthinkingScore, worryScore, stressScore, overallScore } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase.from('overthinking_test_leads').insert({
    full_name: fullName,
    whatsapp_number: whatsappNumber,
    overthinking_score: overthinkingScore,
    worry_score: worryScore,
    stress_score: stressScore,
    overall_score: overallScore,
  })

  if (error) {
    logger.warn('[overthinking-test] failed to save lead', { error: error.message })
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
