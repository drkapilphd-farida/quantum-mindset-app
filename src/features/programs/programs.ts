import { aura, astral, chakra, cosmicFusion, kundalini, manifestation, samadhi, telepathy } from './programsSpiritual'
import { businessLoss, coherence, mindset, retreat, stress, subconscious, traders } from './programsMind'
import type { GroupId, Program, ProgramSlug } from './types'

// All 15 programs, in the hub's card order (owner's design file).
export const PROGRAMS: readonly Program[] = [
  stress,
  mindset,
  subconscious,
  businessLoss,
  telepathy,
  coherence,
  manifestation,
  traders,
  cosmicFusion,
  aura,
  chakra,
  samadhi,
  kundalini,
  astral,
  retreat,
]

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
}

export function videoThumb(id: string): string {
  return LOCAL_THUMBS[id] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** Program page URL (Hindi at ?lang=hi). */
export function programHref(slug: ProgramSlug, lang: 'en' | 'hi'): string {
  return lang === 'hi' ? `/${slug}?lang=hi` : `/${slug}`
}

/** The hub's booking form with this program pre-selected. */
export function bookingHref(slug: ProgramSlug | null, lang: 'en' | 'hi'): string {
  const params = new URLSearchParams()
  if (slug !== null) params.set('program', slug)
  if (lang === 'hi') params.set('lang', 'hi')
  const query = params.toString()
  return `/personal-sessions${query === '' ? '' : `?${query}`}#book`
}
