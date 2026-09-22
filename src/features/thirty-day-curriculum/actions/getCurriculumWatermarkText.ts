import { createClient } from '@/lib/supabase/server'

// The one account this deterrent never applies to — the site owner's own
// login, so testing/demoing the curriculum isn't cluttered with a
// watermark of their own identity.
const WATERMARK_EXCLUDED_EMAIL = 'drkapilphd@gmail.com'

// Anti-Leak Watermark™ — a real website cannot block a screenshot or
// screen recording; that happens at the OS/browser level, entirely
// outside any page's control (true for every site, not a gap specific
// to this app). What a visible watermark DOES do is make a captured
// screenshot or recording traceable back to whoever captured it — a
// real deterrent against casual sharing, not a false claim of
// prevention. Returns null (render nothing) for a signed-out visitor or
// the excluded owner account; otherwise the viewer's own email, plus
// their phone if one is on file, for CurriculumWatermarkOverlay to tile
// across every screen of the 30-Day Curriculum.
export async function getCurriculumWatermarkText(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) return null
  if (user.email.trim().toLowerCase() === WATERMARK_EXCLUDED_EMAIL) return null

  const { data: profile } = await supabase.from('profiles').select('phone').eq('id', user.id).maybeSingle()

  return profile?.phone ? `${user.email} · ${profile.phone}` : user.email
}
