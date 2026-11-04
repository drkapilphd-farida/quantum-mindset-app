// Sharp Brain for parents — the price as a pure function of how many intro
// seats are already paid (config: sharpBrainOffer in site.config.ts). The
// server counts the seats; the browser never decides a price.

/** Every value masterclass_payments.offer can hold (older payments keep theirs). */
export const OFFER_KINDS = ['earlybird', 'regular', 'test1000', 'parent_2999', 'parent_3999', 'instalment_1', 'instalment_2'] as const
export type OfferKind = (typeof OFFER_KINDS)[number]

/** Payments that take one of the intro seats (an instalment plan takes its seat with the first instalment). */
export const INTRO_SEAT_OFFERS = ['parent_2999', 'instalment_1'] as const satisfies readonly OfferKind[]

export type ParentOfferKind = 'parent_2999' | 'parent_3999'

export type OfferConfig = { struckInr: number; introInr: number; introSeats: number; laterInr: number }

export type CurrentPrice = {
  offer: ParentOfferKind
  amountInr: number
  struckInr: number
  introInr: number
  laterInr: number
  introSeats: number
  /** Intro seats still free (0 once the later price applies). */
  seatsLeft: number
}

export function priceForSeats(seatsTaken: number, config: OfferConfig): CurrentPrice {
  const seatsLeft = Math.max(0, config.introSeats - Math.max(0, Math.floor(seatsTaken)))
  const intro = seatsLeft > 0
  return {
    offer: intro ? 'parent_2999' : 'parent_3999',
    amountInr: intro ? config.introInr : config.laterInr,
    struckInr: config.struckInr,
    introInr: config.introInr,
    laterInr: config.laterInr,
    introSeats: config.introSeats,
    seatsLeft,
  }
}

export function isOfferKind(value: string): value is OfferKind {
  return (OFFER_KINDS as readonly string[]).includes(value)
}
