import { PROGRAM_META } from './programMeta'
import { PROGRAM_REVIEWS } from './reviewVideos'
import { BUSINESS_LOSS, MINDSET, STRESS, SUBCONSCIOUS } from './copyMind'
import { COHERENCE, MANIFESTATION, TELEPATHY, TRADERS } from './copyRelPerf'
import { ASTRAL, AURA, CHAKRA, COSMIC_FUSION, KUNDALINI, RETREAT, SAMADHI } from './copySpiritual'
import type { ProgramCopy } from './copyTypes'
import type { SessionPlanId } from '@/config/site.config'
import { reviewFrameSrc, type ThumbFrame } from '@/lib/video/reviewFrames'
import type { GroupId, Program, ProgramSlug } from './types'

// The approved copy (Nov 8, 2026) for each program, joined with what the
// copy does not change (names, card lines, SEO, videos) — PROGRAM_META.
const COPY: Record<ProgramSlug, ProgramCopy> = {
  'stress-anxiety-support': STRESS,
  'mindset-coaching': MINDSET,
  'subconscious-reprogramming': SUBCONSCIOUS,
  'business-loss-mindset': BUSINESS_LOSS,
  telepathy: TELEPATHY,
  'heart-brain-coherence': COHERENCE,
  manifestation: MANIFESTATION,
  'intuition-for-traders': TRADERS,
  'cosmic-fusion': COSMIC_FUSION,
  'aura-reading': AURA,
  'chakra-activation': CHAKRA,
  'samadhi-meditation': SAMADHI,
  'kundalini-meditation': KUNDALINI,
  'astral-projection': ASTRAL,
  'personal-retreat': RETREAT,
}

/** Hub card order (owner's design file). */
const ORDER: ProgramSlug[] = [
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
]

export const PROGRAMS: readonly Program[] = ORDER.map((slug) => ({ ...PROGRAM_META[slug], ...COPY[slug], reviews: PROGRAM_REVIEWS[slug] }))

export const PROGRAM_SLUGS: readonly ProgramSlug[] = PROGRAMS.map((p) => p.slug)

export function getProgram(slug: ProgramSlug): Program {
  const program = PROGRAMS.find((p) => p.slug === slug)
  if (program === undefined) throw new Error(`Unknown program: ${slug}`)
  return program
}

export function isProgramSlug(value: string | null | undefined): value is ProgramSlug {
  return value !== null && value !== undefined && (PROGRAM_SLUGS as readonly string[]).includes(value)
}

export function programsInGroup(group: GroupId | 'all'): readonly Program[] {
  return group === 'all' ? PROGRAMS : PROGRAMS.filter((p) => p.group === group)
}

/** YouTube's own default thumbnail — only the fallback when an in-video frame fails to load. */
export function defaultThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/**
 * Thumbnail for a review video (owner, Nov 2026): a frame from inside the
 * video — hq2 (50%) by default, or the video's own `thumbFrame` — never
 * YouTube's title card. Cropping: lib/video/reviewFrames.ts.
 */
export function reviewThumb(id: string, thumbFrame?: ThumbFrame): string {
  return reviewFrameSrc(id, thumbFrame)
}

/** Program page URL (Hindi at ?lang=hi). */
export function programHref(slug: ProgramSlug, lang: 'en' | 'hi'): string {
  return lang === 'hi' ? `/${slug}?lang=hi` : `/${slug}`
}

/** Every "Book a Clarity Session" button (conversion brief): the pay-and-book page; the program travels along for the payment notes. */
export function clarityHref(slug: ProgramSlug | null, lang: 'en' | 'hi'): string {
  const params = new URLSearchParams()
  if (slug !== null) params.set('program', slug)
  if (lang === 'hi') params.set('lang', 'hi')
  const query = params.toString()
  return `/clarity-session${query === '' ? '' : `?${query}`}`
}

/** The hub's enquiry form with this program (and plan, if given) pre-selected. */
export function bookingHref(slug: ProgramSlug | null, lang: 'en' | 'hi', plan?: SessionPlanId): string {
  const params = new URLSearchParams()
  if (slug !== null) params.set('program', slug)
  if (plan !== undefined) params.set('plan', plan)
  if (lang === 'hi') params.set('lang', 'hi')
  const query = params.toString()
  return `/personal-sessions${query === '' ? '' : `?${query}`}#book`
}
