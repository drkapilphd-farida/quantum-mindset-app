// Pages served from pre-built English and Hindi copies (<path>/en, <path>/hi),
// so they come from the CDN instead of a server render on every visit —
// owner's conversion brief (speed: no blank white screen while loading).
// src/middleware.ts rewrites <path> and <path>?lang=hi to them; the address
// bar keeps the real URL. Kept free of imports: the middleware bundle loads it.
// programs.test.ts checks the program slugs match PROGRAM_SLUGS.
export const PREBUILT_PROGRAM_SLUGS = [
  'stress-anxiety-support',
  'mindset-coaching',
  'subconscious-reprogramming',
  'business-loss-mindset',
  'telepathy',
  'heart-brain-coherence',
  'manifestation',
  'intuition-for-traders',
  'cosmic-fusion',
  'aura-reading',
  'chakra-activation',
  'samadhi-meditation',
  'kundalini-meditation',
  'astral-projection',
  'personal-retreat',
] as const

export const PREBUILT_LANG_PATHS: readonly string[] = ['/personal-sessions', '/clarity-session', '/clarity-session/booked', ...PREBUILT_PROGRAM_SLUGS.map((slug) => `/${slug}`)]

/** <path> → its pre-built copy for the visitor's ?lang (English unless lang=hi). */
export function prebuiltRewritePath(pathname: string, langParam: string | null): string | null {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  if (!PREBUILT_LANG_PATHS.includes(path)) return null
  return `${path}/${langParam === 'hi' ? 'hi' : 'en'}`
}

/** A direct visit to <path>/en or <path>/hi → the real URL (so the copies never show up as pages of their own). */
export function prebuiltCopyRedirect(pathname: string): { path: string; lang: 'en' | 'hi' } | null {
  const match = /^(.+)\/(en|hi)\/?$/.exec(pathname)
  if (match === null) return null
  const [, path = '', lang] = match
  if (!PREBUILT_LANG_PATHS.includes(path)) return null
  return { path, lang: lang === 'hi' ? 'hi' : 'en' }
}
