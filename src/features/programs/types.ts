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

/** Small paragraph under the FAQ (from the approved copy). */
export type Disclaimer = 'mind' | 'traders' | 'foundation'

export type Faq = { q: Bi; a: Bi; /** Shown only when false/absent — the owner's [PLACEHOLDER] answers stay hidden. */ hidden?: boolean }

export type Program = {
  slug: ProgramSlug
  group: GroupId
  /** Short name (cards, dropdown, related, breadcrumb). */
  name: Bi
  /** One line on the hub card. */
  line: Bi
  /** Google title / description — the search words (owner, Nov 2026). */
  seoTitle: Bi
  seoDescription: Bi
  /** Visible H1 (problem-led) and subline — word for word from the approved copy. */
  h1: Bi
  subline: Bi
  soundLike: Bi[]
  /** "Why this happens": the sentence that begins "What is missing" is shown in bold. */
  why: { before: Bi; missing?: Bi; after?: Bi }
  changes: Bi[]
  faqTopic: Bi
  faqs: Faq[]
  related: [ProgramSlug, ProgramSlug, ProgramSlug]
  /** Review video IDs (reviewVideos.ts): first 3 = large cards, the rest = sideways row. Hero shows the first; none → photo, section hidden. */
  reviews: string[]
  disclaimers: Disclaimer[]
}
