'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { sendOverthinkingTestLeadNotification } from '@/lib/email/sendOverthinkingTestLeadNotification'
import { OverthinkingTestLeadInputSchema } from './overthinkingTestLeadSchema'

export type SubmitOverthinkingTestLeadResult = { success: true } | { success: false; error: string }

// Persists an Overthinking Test (/mind-assessment) lead — same pattern
// as submitLead.ts (Discover Your Learning Potential assessment) and
// submitFranchiseLead.ts: reachable before sign-in by design, Row Level
// Security (overthinking_test_leads_insert_anonymous) — not this
// function — is what keeps the table insert-only for the anon role.
//
// Incident fix (see the "URGENT: Fix Broken Lead Capture" task): every
// live submission was failing with a generic error, blocking 100% of
// leads from this page. Root cause — confirmed directly, not guessed —
// is that supabase/migrations/20260916000001_create_overthinking_test_leads.sql
// was written in the earlier build but was never applied to the live
// database (no Supabase CLI/DB credentials were available in the coding
// environment to run it; see that migration file's own doc comment).
// The Supabase insert below was failing with "Could not find the table
// 'public.overthinking_test_leads' in the schema cache", and the
// function was returning failure the moment that happened — so every
// real visitor hit the generic error screen and the full report never
// unlocked, even though nothing else in the flow was broken.
//
// Fix: the database insert is now a best-effort attempt, not a hard
// requirement. sendOverthinkingTestLeadNotification (Resend email, same
// pattern as sendFranchiseLeadNotification.ts) is called unconditionally
// as a second, independent save path with the exact same lead data —
// this becomes the real durable record for as long as the table isn't
// live. The visitor only sees the generic failure if BOTH the database
// write and the email genuinely fail; either one succeeding unlocks the
// report. Once the migration above is actually applied (see this repo's
// README/deploy notes, or run `supabase db push` against a linked
// project with real credentials), the database becomes the primary
// record again automatically — no code change needed, this function
// already prefers it.
//
// This does NOT fix itself: RESEND_API_KEY (and optionally
// RESEND_FROM_EMAIL / OVERTHINKING_TEST_NOTIFY_EMAIL) must be set in the
// production environment for the email fallback to actually send — see
// this task's final report for exactly what to check/set.
export async function submitOverthinkingTestLead(input: unknown): Promise<SubmitOverthinkingTestLeadResult> {
  const parsed = OverthinkingTestLeadInputSchema.safeParse(input)
  if (!parsed.success) {
    logger.warn('[overthinking-test] lead input failed validation', { issues: parsed.error.issues })
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Please check your details and try again.' }
  }

  const { fullName, whatsappNumber, overthinkingScore, worryScore, stressScore, overallScore } = parsed.data

  const supabase = await createClient()
  const { error: dbError } = await supabase.from('overthinking_test_leads').insert({
    full_name: fullName,
    whatsapp_number: whatsappNumber,
    overthinking_score: overthinkingScore,
    worry_score: worryScore,
    stress_score: stressScore,
    overall_score: overallScore,
  })
  const databaseSaveSucceeded = dbError === null

  if (dbError) {
    logger.error('[overthinking-test] database save failed — falling back to email notification', {
      error: dbError.message,
      code: dbError.code,
    })
  }

  const emailResult = await sendOverthinkingTestLeadNotification({
    name: fullName,
    whatsappNumber,
    overthinkingScore,
    worryScore,
    stressScore,
    overallScore,
    databaseSaveSucceeded,
  })

  if (!databaseSaveSucceeded && !emailResult.sent) {
    logger.error('[overthinking-test] lead was NOT saved anywhere — both database and email fallback failed', {
      dbError: dbError?.message,
      emailError: emailResult.error,
      fullName,
      whatsappNumber,
    })
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
