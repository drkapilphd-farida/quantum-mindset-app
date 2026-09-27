// Executive Brain Performance Workshop™ — single source of truth for
// every operational value on /executive-brain-workshop (date, time,
// prices, seats, links, tracking IDs). Edit this file only — no other
// file in this feature should hardcode a date, price, seat count, or
// link. See the end of this file for `EXECUTIVE_WORKSHOP_TODO_FIELDS`,
// a plain checklist of what still needs a real value before launch.

export type ExecutiveWorkshopPricingPlan = {
  id: 'early-bird' | 'standard' | 'executive'
  name: string
  price: number
  /** Shown under the price, e.g. "first 15 seats / till 10 Nov 2026". Empty string hides the line. */
  availabilityNote: string
  features: readonly string[]
  paymentLink: string
  highlighted: boolean
  /** Cap this plan's seats specifically (e.g. Executive 1:1 Track limited to 5). null = no separate cap. */
  seatCap: number | null
}


// The one real, hosted Razorpay Payment Link for this workshop — a
// payer-entered-amount link (Razorpay's own Payment Pages let the payer
// type the amount rather than the page fixing it), which is why every
// price button also shows a short note asking the payer to confirm the
// exact plan/amount on WhatsApp after paying — see
// ExecutiveWorkshopPricing.tsx.
const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@mindurmindacademy'

export const executiveBrainWorkshopConfig = {
  // ── Event details ──────────────────────────────────────────────────
  eventDateDisplay: 'Sunday, 18 October 2026',
  eventDateISO: '2026-10-18', // YYYY-MM-DD, used for JSON-LD + countdown — keep in sync with eventDateDisplay above.
  eventTimeDisplay: '10:00 AM – 5:30 PM',
  eventStartTimeISO: '10:00:00+05:30',
  eventEndTimeISO: '17:30:00+05:30',
  mealsIncludedNote: 'Lunch and tea included',

  venueName: 'Hotel Better Home International',
  venueAddress: 'Sahar Road, Andheri East, Mumbai, Maharashtra',
  venueCity: 'Mumbai',
  venueMapsSearchQuery: 'Hotel Better Home International, Sahar Road, Andheri East, Mumbai',

  // Total real seats for the room — used for the "seats remaining" line.
  // Never auto-decrement this from anywhere; only a manual edit here
  // changes what visitors see.
  totalSeats: 30,
  seatsRemaining: 30,

  // ── Pricing (section 3.11) ─────────────────────────────────────────
  gstApplicable: true, // shows "+ GST as applicable" next to every price when true
  earlyBirdSeatsLimit: 15,
  // 11:59 PM IST on this date — see ExecutiveWorkshopCountdown.tsx's own
  // +05:30 handling. Typed as `string` (not narrowed to this literal by
  // the object's own `as const`) so call sites can compare it against
  // '' to decide whether to hide the countdown, without a "no overlap"
  // type error once a real date is set here.
  earlyBirdDeadlineISO: '2026-10-11' as string,
  refundPolicyText:
    'Full refund up to 7 days before the workshop. Your seat is transferable to a colleague at any time — just let us know.',

  pricingPlans: [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 4999,
      availabilityNote: 'First 15 seats',
      features: [
        'Full-day workshop',
        'Lunch & tea',
        'Personal before/after measurement',
        'Workbook',
        '21-day WhatsApp practice',
        'Weekly online review calls',
        'Certificate of participation',
      ],
      paymentLink: RAZORPAY_PAYMENT_LINK,
      highlighted: false,
      seatCap: null,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 7999,
      availabilityNote: '',
      features: ['Everything in Early Bird'],
      paymentLink: RAZORPAY_PAYMENT_LINK,
      highlighted: true,
      seatCap: null,
    },
    {
      id: 'executive',
      name: 'Executive 1:1 Track',
      price: 29999,
      availabilityNote: 'Limited to 5 participants',
      features: [
        'Everything above',
        'Personal live EEG brain-state session',
        '4 private one-to-one sessions with Dr. Kapil Dev Sharma over 21 days',
        'Personalised protocol',
        'Direct WhatsApp access',
      ],
      paymentLink: RAZORPAY_PAYMENT_LINK,
      highlighted: false,
      seatCap: 5,
    },
  ] as readonly ExecutiveWorkshopPricingPlan[],

  // ── Contact / links ─────────────────────────────────────────────────
  // E.164 without '+', used to build wa.me links.
  whatsappNumber: '919540123161', // TODO: confirm this is the right number for this workshop
  contactEmail: 'info@mindurmind.org.in', // TODO: confirm
  brochurePdfUrl: '', // TODO: e.g. '/downloads/executive-brain-workshop-brochure.pdf' — button hides when empty

  // Corporate enquiry form target. Formspree endpoint or a Google Apps
  // Script Web App URL both work (both accept a POST). Left empty: the
  // form falls back to opening WhatsApp with every field pre-filled —
  // never a dead end.
  corporateFormEndpoint: '', // TODO

  // ── Tracking ─────────────────────────────────────────────────────────
  // Meta Pixel ID for THIS campaign page specifically (separate from any
  // sitewide pixel). Leave empty to not load Meta Pixel at all.
  metaPixelId: '', // TODO
  // Google Analytics 4 measurement ID for this campaign specifically. The
  // sitewide GA4 (NEXT_PUBLIC_GA_MEASUREMENT_ID, already configured in
  // .env) fires on every page including this one regardless — this is
  // only for an ADDITIONAL, page-scoped GA4 property if the campaign
  // needs separate reporting. Leave empty to skip.
  ga4MeasurementId: '', // TODO

} as const

// Plain checklist for a non-technical editor — every field a human still
// needs to fill in before this page is launch-ready. Kept in sync by hand
// (not derived automatically) since some fields are legitimately fine
// left as their default (e.g. seatsRemaining starting equal to totalSeats).
export const EXECUTIVE_WORKSHOP_TODO_FIELDS = [
  'whatsappNumber — confirm the number this workshop should use',
  'contactEmail — confirm',
  'brochurePdfUrl — add once a brochure PDF exists, else leave empty',
  'corporateFormEndpoint — add a Formspree or Google Apps Script URL, else WhatsApp fallback is used',
  'metaPixelId — add if running Meta Ads for this campaign',
  'ga4MeasurementId — add only if this campaign needs a separate GA4 property from the sitewide one',
  'testimonials — add real reviews of THIS workshop to src/config/testimonials.ts (program: executiveWorkshop) and list the names in site.config verifiedTestimonialNames',
] as const

// Registrations Closed™ — after the event date has fully passed,
// ExecutiveWorkshopPricing.tsx replaces the pricing grid with a closed
// message + a WhatsApp "Notify me" button instead of payment buttons.
// Compares against the event's own end time (not just the date) so the
// workshop day itself still shows live pricing right up until it
// actually finishes.
export function hasExecutiveWorkshopEventPassed(): boolean {
  const eventEnd = new Date(`${executiveBrainWorkshopConfig.eventDateISO}T${executiveBrainWorkshopConfig.eventEndTimeISO}`)
  return Date.now() > eventEnd.getTime()
}
