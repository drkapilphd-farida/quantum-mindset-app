import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import QsrMumbaiNav from '@/components/qsr-mumbai/QsrMumbaiNav'
import QsrMumbaiHero from '@/components/qsr-mumbai/QsrMumbaiHero'
import QsrMumbaiWhatsDifferent from '@/components/qsr-mumbai/QsrMumbaiWhatsDifferent'
import QsrMumbaiSchedule from '@/components/qsr-mumbai/QsrMumbaiSchedule'
import QsrMumbaiVenue from '@/components/qsr-mumbai/QsrMumbaiVenue'
import QsrMumbaiEegDemo from '@/components/qsr-mumbai/QsrMumbaiEegDemo'
import QsrMumbaiPricing from '@/components/qsr-mumbai/QsrMumbaiPricing'
import QsrMumbaiTestimonialsPlaceholder from '@/components/qsr-mumbai/QsrMumbaiTestimonialsPlaceholder'
import QsrMumbaiFaq from '@/components/qsr-mumbai/QsrMumbaiFaq'
import Footer from '@/components/Footer'
import QsrMumbaiStickyBar from '@/components/qsr-mumbai/QsrMumbaiStickyBar'
import QsrMumbaiWhatsAppWidget from '@/components/qsr-mumbai/QsrMumbaiWhatsAppWidget'

export const metadata: Metadata = {
  title: { absolute: 'Quantum Speed Reading — Live 2-Day Workshop in Mumbai | Mind Ur Mind' },
  description:
    'A 2-day, in-person pilot workshop in Mumbai — live coaching from Dr. Kapil Dev Sharma, a Cognitive & Focus Engagement Demo, and reading speed measured across an overnight gap. Same 30-day curriculum, same ₹9,999 price as the online Masterclass.',
  alternates: {
    canonical: '/programs/quantum-speed-reading-mumbai',
  },
}

// Mumbai In-Person QSR Workshop™ — a hybrid, in-person extension of the
// QSR 30-Day Masterclass (see the "Add Mumbai In-Person QSR Workshop"
// task), not a replacement for it. Structured like the retreat pages
// (RetreatNav/RetreatStickyBar/RetreatWhatsAppWidget pattern): its own
// minimal nav, i18n-driven throughout (t.qsrMumbaiLanding), sticky
// bottom CTA bar, WhatsApp widget — no dedicated Razorpay checkout for
// this pilot batch yet, so every CTA here is a WhatsApp inquiry (see
// WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK's own doc comment for why).
//
// Section order: hook (Hero) -> what's actually different from the
// online-only track (WhatsDifferent) -> the concrete Day 1/Day 2
// breakdown, overnight gap featured as a deliberate design choice
// (Schedule) -> venue/date/pilot-batch logistics, placeholders where
// real data isn't confirmed yet (Venue) -> what the EEG demo is and
// isn't (EegDemo) -> price (Pricing, ₹9,999, same as online) -> an
// honest empty state for testimonials until the pilot batch actually
// runs (TestimonialsPlaceholder) -> objection handling including the
// EEG/medical question and the refund-policy placeholder (Faq) ->
// footer, sticky bar, WhatsApp widget.
export default function QuantumSpeedReadingMumbaiPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(translations.en.qsrMumbaiLanding.faq.items)

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <QsrMumbaiNav />
      <main>
        <QsrMumbaiHero />
        <QsrMumbaiWhatsDifferent />
        <QsrMumbaiSchedule />
        <QsrMumbaiVenue />
        <QsrMumbaiEegDemo />
        <QsrMumbaiPricing />
        <QsrMumbaiTestimonialsPlaceholder />
        <QsrMumbaiFaq />
      </main>
      <Footer />
      <QsrMumbaiStickyBar />
      <QsrMumbaiWhatsAppWidget />
    </div>
  )
}
