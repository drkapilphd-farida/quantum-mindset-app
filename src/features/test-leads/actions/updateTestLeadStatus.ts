'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

const Schema = z.object({ id: z.string().uuid(), status: z.enum(['new', 'contacted', 'enrolled']) })

// Admin-only, re-checked here (a Server Action can be called from anywhere),
// same as updateFranchiseLeadStatus. Just the follow-up status.
export async function updateTestLeadStatus(input: unknown): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = Schema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid request.' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) ?? []
  if (!user || !adminEmails.includes(user.email ?? '')) {
    logger.warn('[test-leads] updateStatus — unauthorized attempt', { userId: user?.id ?? null })
    return { success: false, error: 'Not authorized.' }
  }
  const { error } = await createServiceClient()
    .from('speed_test_results')
    .update({ lead_status: parsed.data.status, lead_status_updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
  if (error) {
    logger.warn('[test-leads] updateStatus failed', { code: error.code })
    return { success: false, error: 'Could not update status.' }
  }
  revalidatePath('/admin/test-leads')
  return { success: true }
}
