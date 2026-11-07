// 1-on-1 program pages (owner's strict design brief, Nov 2026).

export type Bi = { en: string; hi: string }
export type ProgramLang = 'en' | 'hi'

export type GroupId = 'mind' | 'rel' | 'perf' | 'spirit' | 'deep'

export type ProgramSlug =
  | 'stress-anxiety-support'
  | 'mindset-coaching'
  | 'subconscious-reprogramming'
  | 'business-loss-mindset'
  | 'telepathy'
  | 'heart-brain-coherence'
  | 'manifestation'
  | 'intuition-for-traders'
  | 'cosmic-fusion'
  | 'aura-reading'
  | 'chakra-activation'
  | 'samadhi-meditation'
  | 'kundalini-meditation'
  | 'astral-projection'
  | 'personal-retreat'

export type VideoCard = { id: string; title: Bi }

export type Disclaimer = 'mind' | 'traders'

export type Program = {
  slug: ProgramSlug
  group: GroupId
  /** Short name (cards, dropdown, related). */
  name: Bi
  /** One line on the hub card. */
  line: Bi
  h1: Bi
  seoTitle: Bi
  seoDescription: Bi
  heroLine: Bi
  /** Added after the experience line (Telepathy: "· telepathy taught since 2017"). */
  experienceSuffix?: Bi
  usedFor: { title: Bi; text: Bi }[]
  who: Bi[]
  how: { lead: Bi; rest: Bi }[]
  /** "How Dr. Kapil teaches it" (spiritual etc.) or "… works with you" (mind pages). */
  howHeading: 'teaches' | 'works'
  quote: Bi
  faqTopic: Bi
  faqs: { q: Bi; a: Bi }[]
  related: [ProgramSlug, ProgramSlug, ProgramSlug]
  /** Review videos (16:9). Hero shows the first; empty → hero shows the photo, reviews section hidden. */
  videos: VideoCard[]
  /** YouTube Shorts (9:16) for the sideways row under the cards. */
  shorts: string[]
  disclaimers: Disclaimer[]
}
