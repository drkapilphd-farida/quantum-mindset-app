export type EventLang = 'en' | 'hi'
export type Bi = { en: string; hi: string }

export type EventCopy = {
  meta: { title: Bi; description: Bi }
  pill: Bi
  h1: Bi
  sub: Bi
  facts: Bi[]
  priceLine: Bi
  book: Bi
  bookMessage: string
  /** Razorpay link: when set, the main button pays directly and WhatsApp becomes the 'ask' link. */
  payUrl?: string
  ask?: Bi
  forWhom: { heading: Bi; items: Bi[] }
  plan: { heading: Bi; steps: { title: Bi; line: Bi }[] }
  price: { title: Bi; amount: string; sub: Bi; included: Bi[]; note: Bi }
  faqHeading: Bi
  faq: { q: Bi; a: Bi }[]
  finalHeading: Bi
  disclaimer?: Bi
  /** Background photo for the hero (owner's own photos). */
  heroImage?: string
  photos?: { heading: Bi; sub: Bi; items: { src: string; alt: Bi }[] }
}
