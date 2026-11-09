import { PROGRAM_META } from './programMeta'
import { PROGRAM_REVIEWS } from './reviewVideos'
import { BUSINESS_LOSS, MINDSET, STRESS, SUBCONSCIOUS } from './copyMind'
import { COHERENCE, MANIFESTATION, TELEPATHY, TRADERS } from './copyRelPerf'
import { ASTRAL, AURA, CHAKRA, COSMIC_FUSION, KUNDALINI, RETREAT, SAMADHI } from './copySpiritual'
import type { ProgramCopy } from './copyTypes'
import type { SessionPlanId } from '@/config/site.config'
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

// Real, locally stored frames for the review videos we have them for;
// otherwise YouTube's own thumbnail (allowed in next.config images).
const LOCAL_THUMBS: Record<string, string> = {
  pRG3sdsXiHM: '/learner-videos/pRG3sdsXiHM-thumb.jpg',
  l_3qAC_pgPI: '/learner-videos/l_3qAC_pgPI-thumb.jpg',
  WZMSSuRTr78: '/learner-videos/WZMSSuRTr78-thumb.jpg',
  ZyD_iQTOR60: '/learner-videos/ZyD_iQTOR60-thumb.jpg',
  s87Pxs0EP58: '/learner-videos/s87Pxs0EP58-thumb.jpg',
  vbNGdtGRxeQ: '/retreat-videos/vbNGdtGRxeQ-thumb.jpg',
  '8a3vd3ep7QY': '/retreat-videos/8a3vd3ep7QY-thumb.jpg',
  NubHGGlQdo8: '/retreat-videos/NubHGGlQdo8-thumb.jpg',
  X66b3WfrsZw: '/retreat-videos/X66b3WfrsZw-thumb.jpg',
  'Dp2aE_-aZ0g': '/retreat-videos/Dp2aE_-aZ0g-thumb.jpg',
  uNWLFqACpDU: '/learner-videos/uNWLFqACpDU-thumb.jpg',
}

export function videoThumb(id: string): string {
  return LOCAL_THUMBS[id] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** Program page URL (Hindi at ?lang=hi). */
export function programHref(slug: ProgramSlug, lang: 'en' | 'hi'): string {
  return lang === 'hi' ? `/${slug}?lang=hi` : `/${slug}`
}

/** The hub's booking form with this program (and plan, if given) pre-selected. */
export function bookingHref(slug: ProgramSlug | null, lang: 'en' | 'hi', plan?: SessionPlanId): string {
  const params = new URLSearchParams()
  if (slug !== null) params.set('program', slug)
  if (plan !== undefined) params.set('plan', plan)
  if (lang === 'hi') params.set('lang', 'hi')
  const query = params.toString()
  return `/personal-sessions${query === '' ? '' : `?${query}`}#book`
}
