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

export type ExecutiveWorkshopTestimonial = {
  quote: string
  name: string
  designation: string
  company: string
}

export const executiveBrainWorkshopConfig = {
  // ── Event details ──────────────────────────────────────────────────
  // TODO: confirm the real date/time before launch.
  eventDateDisplay: 'Sunday, [DATE — e.g. 22 November 2026]',
  eventDateISO: '2026-11-22', // YYYY-MM-DD, used for JSON-LD + countdown — keep in sync with eventDateDisplay above.
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
  earlyBirdDeadlineISO: '', // e.g. '2026-11-10' — leave empty to hide the countdown entirely
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
      paymentLink: '', // TODO: Razorpay/Instamojo payment link — WhatsApp fallback used until this is set
      highlighted: false,
      seatCap: null,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 7999,
      availabilityNote: '',
      features: ['Everything in Early Bird'],
      paymentLink: '', // TODO
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
        'Personal EEG brain-state measurement',
        '4 private one-to-one sessions with Dr. Sharma over 21 days',
        'Personalised protocol',
        'Direct WhatsApp access',
      ],
      paymentLink: '', // TODO
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

  // ── Testimonials (section 3.13) ─────────────────────────────────────
  // NEVER invent a quote, name, company or number here. Leave this array
  // empty and the whole testimonials section hides itself automatically.
  testimonials: [] as readonly ExecutiveWorkshopTestimonial[],
} as const

// Plain checklist for a non-technical editor — every field a human still
// needs to fill in before this page is launch-ready. Kept in sync by hand
// (not derived automatically) since some fields are legitimately fine
// left as their default (e.g. seatsRemaining starting equal to totalSeats).
export const EXECUTIVE_WORKSHOP_TODO_FIELDS = [
  'eventDateDisplay / eventDateISO — confirm real workshop date',
  'earlyBirdDeadlineISO — set a real deadline, or leave empty to hide the countdown',
  'pricingPlans[*].paymentLink — add real Razorpay/Instamojo links for all 3 plans',
  'whatsappNumber — confirm the number this workshop should use',
  'contactEmail — confirm',
  'brochurePdfUrl — add once a brochure PDF exists, else leave empty',
  'corporateFormEndpoint — add a Formspree or Google Apps Script URL, else WhatsApp fallback is used',
  'metaPixelId — add if running Meta Ads for this campaign',
  'ga4MeasurementId — add only if this campaign needs a separate GA4 property from the sitewide one',
  'testimonials — add real ones once available; section stays hidden until then',
] as const
