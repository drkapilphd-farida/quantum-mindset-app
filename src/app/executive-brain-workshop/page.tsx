import type { Metadata } from 'next'
import { executiveBrainWorkshopConfig } from '@/config/executiveBrainWorkshopConfig'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildEventSchema } from '@/features/executive-brain-workshop/buildEventSchema'
import { getResolvedExecutiveWorkshopFaqItems } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopFaq'
import { ExecutiveWorkshopNav } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopNav'
import { ExecutiveWorkshopHero } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopHero'
import { ExecutiveWorkshopProblem } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopProblem'
import { ExecutiveWorkshopEegDemo } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopEegDemo'
import { ExecutiveWorkshopAgenda } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopAgenda'
import { ExecutiveWorkshopFollowUp } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopFollowUp'
import { ExecutiveWorkshopAudience } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopAudience'
import { ExecutiveWorkshopBenefits } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopBenefits'
import { ExecutiveWorkshopScience } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopScience'
import { ExecutiveWorkshopTrainer } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopTrainer'
import { ExecutiveWorkshopVenueMap } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopVenueMap'
import { ExecutiveWorkshopPricing } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopPricing'
import { ExecutiveWorkshopCorporate } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopCorporate'
import { ExecutiveWorkshopTestimonials } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopTestimonials'
import { ExecutiveWorkshopFaq } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopFaq'
import { ExecutiveWorkshopFinalCta } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopFinalCta'
import { ExecutiveWorkshopFooter } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopFooter'
import { ExecutiveWorkshopStickyBar } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopStickyBar'
import { ExecutiveWorkshopWhatsAppWidget } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopWhatsAppWidget'
import { ExecutiveWorkshopViewContentTracker } from '@/features/executive-brain-workshop/components/ExecutiveWorkshopViewContentTracker'
import { MetaPixel } from '@/features/executive-brain-workshop/components/MetaPixel'

const PAGE_TITLE = 'Executive Brain Performance Workshop Mumbai | Calm, Focus & Decision Clarity'
const PAGE_DESCRIPTION =
  'A one-day, science-based live workshop in Mumbai by Dr. Kapil Dev Sharma — a live EEG brain-state demo, personal before/after measurement, and 21 days of guided daily practice on WhatsApp.'

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/executive-brain-workshop',
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: '/executive-brain-workshop',
    images: ['/founder-warm.jpg'],
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/founder-warm.jpg'],
  },
}

// Executive Brain Performance Workshop™ — a standalone, config-driven
// campaign landing page (see executiveBrainWorkshopConfig.ts for every
// editable value). Not wired through this site's i18n system
// (English-only, single audience) and not wrapped in the `.warm-light`
// scoped palette every other marketing page uses — this page
// deliberately reuses the SAME custom color tokens (--color-void/panel/
// ink/teal/gold, defined in globals.css) in their un-remapped, genuinely
// dark-navy form, a distinct visual identity for this corporate/
// executive audience. Section order matches the brief: Hero -> Problem
// -> signature EEG demo (dark) -> Agenda -> 21-day follow-up -> Audience
// -> Benefits -> Science -> Trainer (+ venue map) -> Pricing ->
// Corporate -> Testimonials (hidden while empty) -> FAQ -> Final CTA ->
// Footer.
export default function ExecutiveBrainWorkshopPage(): React.JSX.Element {
  const config = executiveBrainWorkshopConfig
  const pageUrl = 'https://app.mindurmind.org.in/executive-brain-workshop'

  const eventSchema = buildEventSchema({
    venueName: config.venueName,
    venueAddress: config.venueAddress,
    venueCity: config.venueCity,
    startDateIso: `${config.eventDateISO}T${config.eventStartTimeISO}`,
    endDateIso: `${config.eventDateISO}T${config.eventEndTimeISO}`,
    pricingPlans: config.pricingPlans,
    pageUrl,
  })
  const faqSchema = buildFaqPageSchema(getResolvedExecutiveWorkshopFaqItems())

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <MetaPixel pixelId={config.metaPixelId} />
      <ExecutiveWorkshopViewContentTracker />

      <ExecutiveWorkshopNav />
      <main>
        <ExecutiveWorkshopHero />
        <ExecutiveWorkshopProblem />
        <ExecutiveWorkshopEegDemo />
        <ExecutiveWorkshopAgenda />
        <ExecutiveWorkshopFollowUp />
        <ExecutiveWorkshopAudience />
        <ExecutiveWorkshopBenefits />
        <ExecutiveWorkshopScience />
        <section className="border-b border-slate-200 bg-slate-50 px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-teal">The Venue</p>
            <h2 className="mt-3 text-[26px] font-bold tracking-tight text-slate-900 sm:text-[32px]">
              {config.venueName}, {config.venueCity}
            </h2>
            <p className="mt-2 text-[15px] text-slate-600">
              {config.eventDateDisplay} · {config.eventTimeDisplay} · {config.mealsIncludedNote}
            </p>
            <ExecutiveWorkshopVenueMap />
          </div>
        </section>
        <ExecutiveWorkshopTrainer />
        <ExecutiveWorkshopPricing />
        <ExecutiveWorkshopCorporate />
        <ExecutiveWorkshopTestimonials />
        <ExecutiveWorkshopFaq />
        <ExecutiveWorkshopFinalCta />
      </main>
      <ExecutiveWorkshopFooter />
      <ExecutiveWorkshopStickyBar />
      <ExecutiveWorkshopWhatsAppWidget />
    </div>
  )
}
