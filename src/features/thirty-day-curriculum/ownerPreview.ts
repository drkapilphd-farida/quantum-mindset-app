import { createClient } from '@/lib/supabase/server'

// Owner preview (founder request, 23 Nov 2026): the founder's own account
// opens every day of the 30-day plan at once, to record demo videos without
// finishing each day first. Exactly one login, the same one the anti-leak
// watermark already excludes (getCurriculumWatermarkText.ts). Every other
// learner keeps the real rule in dayRules.ts. Paid access is not bypassed:
// the owner account must still have the program.
export const OWNER_PREVIEW_EMAIL = 'drkapilphd@gmail.com'

export function isOwnerPreviewEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === OWNER_PREVIEW_EMAIL
}

/** For the signed-in user (server only). */
export async function getIsOwnerPreview(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isOwnerPreviewEmail(user?.email)
}
