import { SHARP_BRAIN_PRICES } from './site.config'

// Sharp Brain™ Partner Program (/partner) — every number on the page lives
// here, exactly as given by the owner in the partner brief (Nov 2026).

export const PARTNER_PROGRAM = {
  /** Partner fee, plus GST. */
  feeInr: 45000,
  emi: { count: 3, amountInr: 15000 },
  /** Partner + EEG Brain State Demo package, plus GST. */
  eegPackageInr: 89000,
  /** Sharp Brain prices the partner sells. */
  selfPriceInr: SHARP_BRAIN_PRICES.selfPacedInr,
  livePriceInr: SHARP_BRAIN_PRICES.liveInr,
  /** What the partner keeps per student, after royalty. */
  perStudent: {
    self: 2549, // ₹2,999 − 15% royalty
    liveDrKapil: 4499, // ₹8,999 − 50% royalty (Dr. Kapil takes the live classes)
    liveSelf: 7649, // ₹8,999 − 15% royalty (partner is Level 2 certified)
  },
  calculator: {
    self: { min: 0, max: 40, default: 10 },
    live: { min: 0, max: 20, default: 3 },
  },
} as const

/**
 * Founding Partners badge: "first 10 at ₹35,000 · N seats left".
 * CHANGE `seatsLeft` BY HAND when a founding seat is sold. Nothing on the
 * page counts down on its own. Set `seatsLeft` to 0 to hide the badge.
 */
export const FOUNDING_PARTNERS = {
  total: 10,
  priceInr: 35000,
  seatsLeft: 10,
} as const

/**
 * The reply the owner can send an applicant on WhatsApp (one tap from the
 * notification email). Fill in the two links when they are ready.
 */
export const PARTNER_VIDEO_LINK = '[VIDEO_LINK]'
export const PARTNER_BOOKING_LINK = '[BOOKING_LINK]'
