import type { ExecutiveWorkshopPricingPlan } from '@/config/executiveBrainWorkshopConfig'
import { SITE_URL } from '@/lib/seo/siteUrl'

type BuildEventSchemaInput = {
  venueName: string
  venueAddress: string
  venueCity: string
  startDateIso: string // full ISO datetime, e.g. 2026-11-22T10:00:00+05:30
  endDateIso: string
  pricingPlans: readonly ExecutiveWorkshopPricingPlan[]
  pageUrl: string
}

// schema.org Event JSON-LD — same "escape '<' so a stray '</script>'
// inside any value can't terminate the injected <script> tag early"
// posture as buildFaqPageSchema.ts. offers only include a plan once it
// has a real price (every plan here does) — never a fabricated price.
export function buildEventSchema(input: BuildEventSchemaInput): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Executive Brain Performance Workshop',
    description:
      'A one-day, science-based live workshop in Mumbai by Dr. Kapil Dev Sharma — a live EEG brain-state demo, personal before/after measurement, and 21 days of guided daily practice on WhatsApp.',
    startDate: input.startDateIso,
    endDate: input.endDateIso,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: input.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: input.venueAddress,
        addressLocality: input.venueCity,
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Mind Ur Mind',
      url: SITE_URL,
    },
    performer: {
      '@type': 'Person',
      name: 'Dr. Kapil Dev Sharma',
    },
    offers: input.pricingPlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: input.pageUrl,
    })),
  }

  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
