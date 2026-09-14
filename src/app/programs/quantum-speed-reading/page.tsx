import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import QsrNav from '@/components/qsr/QsrNav'
import QsrMumbaiBanner from '@/components/qsr/QsrMumbaiBanner'
import QsrHero from '@/components/qsr/QsrHero'
import QsrBrainScience from '@/components/qsr/QsrBrainScience'
import QsrNeuroCognitiveScience from '@/components/qsr/QsrNeuroCognitiveScience'
import QsrAgeGroups from '@/components/qsr/QsrAgeGroups'
import QsrAppPreview from '@/components/qsr/QsrAppPreview'
import QsrMechanics from '@/components/qsr/QsrMechanics'
import QsrMoreThanSpeed from '@/components/qsr/QsrMoreThanSpeed'
import QsrFocusScreenTime from '@/components/qsr/QsrFocusScreenTime'
import QsrDocumentMastery from '@/components/qsr/QsrDocumentMastery'
import QsrCurriculum from '@/components/qsr/QsrCurriculum'
import QsrExamBenefits from '@/components/qsr/QsrExamBenefits'
import QsrAuthority from '@/components/qsr/QsrAuthority'
import QsrCredibilityStrip from '@/components/qsr/QsrCredibilityStrip'
import QsrFounderVideo from '@/components/qsr/QsrFounderVideo'
import QsrLiveIntroSession from '@/components/qsr/QsrLiveIntroSession'
import QsrAudience from '@/components/qsr/QsrAudience'
import QsrVideoTestimonials from '@/components/qsr/QsrVideoTestimonials'
import QsrFaq from '@/components/qsr/QsrFaq'
import QsrBatchNotice from '@/components/qsr/QsrBatchNotice'
import QsrSpeedTestInlineCta from '@/components/qsr/QsrSpeedTestInlineCta'
import Footer from '@/components/Footer'
import QsrStickyBar from '@/components/qsr/QsrStickyBar'
import QsrWhatsAppWidget from '@/components/qsr/QsrWhatsAppWidget'
import { WORKSHOP_CITIES } from '@/config/workshopCities'

export const metadata: Metadata = {
  // { absolute } bypasses the root layout's title.template — see the
  // matching note in retreats/online-11-day/page.tsx.
  title: { absolute: 'Quantum Speed Reading — Science-Backed Neuro-Cognitive Masterclass | Dr. Kapil Dev Sharma' },
  description:
    'Read 5x faster, retain more, and rebuild how your mind processes information in 30 days. 7 live masterclasses, daily app-tracked cognitive metrics, ₹9,999 one-time enrollment.',
}

// Flagship Program Landing Page™ — the real destination TierFlagship's
// homepage CTA already points to (/programs/quantum-speed-reading), and
// the public landing page ThirtyDayMasterclassHeroCard's own comment
// names as still outstanding ("wherever eventually becomes the public
// landing page — out of scope here"). Single-goal direct-response page:
// deliberately no shared Navbar/nav links away from enrollment, just
// this page's own minimal QsrNav plus a sticky bottom CTA bar and a
// WhatsApp widget tuned to this exact program.
//
// Section order follows a deliberate narrative arc: hook (Hero) → why it
// works (BrainScience, NeuroCognitiveScience) → a free, no-risk taste of
// the technique itself (SpeedTestInlineCta) → how the training meets
// kids and adults differently (AgeGroups) → what daily practice feels
// like (AppPreview) → how the program is structured (Mechanics) → what
// it covers beyond raw reading speed (MoreThanSpeed, FocusScreenTime —
// the latter cross-sells the standalone Habit App) → a real, separate
// AI-powered bonus feature (DocumentMastery — Upload & Learn, five real
// product screenshots) → the week-by-week breakdown (Curriculum) → who
// is actually teaching it (Authority, CredibilityStrip, FounderVideo) →
// a focused parent-facing outcomes note (Audience) → the same free test
// again, now as a lower-commitment alternative right where a hesitant
// visitor is deciding whether to commit to ₹9,999 (SpeedTestInlineCta)
// → social proof (VideoTestimonials) → final objection handling (Faq)
// → real batch cadence + final push (BatchNotice) before the footer.
//
// Positioning fix (see the "Fix Homepage & QSR Page Positioning" task):
// removed QsrAllRoundDevelopment entirely — its "Complete Development,
// Not Just Speed Reading" framing (Reading & Memory + Focus & Calm +
// Life Skills + Family Bonding as four equal pillars) diluted the core
// "read faster, retain more" promise into a generic self-improvement
// bundle, and Focus/Calm + Life-Skills content already has its own,
// better-scoped home in MoreThanSpeed/FocusScreenTime above — nothing
// real was lost, just de-duplicated. The one distinct detail with no
// other home (the monthly parent-child reading activity) moved into
// QsrAudience's existing parent-outcomes list. QsrAudience's own
// "Three kinds of people take this Masterclass" 3-persona grid
// (Students/Professionals/Lifelong Learners) is also gone for the same
// reason — diluted ICP — leaving just its parent-outcomes note and one
// real trust quote; testimonials elsewhere already show who this is for
// without a dedicated multi-persona pitch. Three total speed-test CTAs
// on this page (Hero + these two) — deliberately no
// fourth or sticky/floating version, to avoid feeling spammy.
export default function QuantumSpeedReadingLandingPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(translations.en.qsrLanding.faq.items)
  // Primary Course entity — Quantum Speed Reading is this site's primary,
  // front-facing brand identity (see Positioning SEO Fix), targeted at
  // students, exam aspirants, and lifelong learners.
  const courseSchema = buildCourseSchema({
    name: 'Quantum Speed Reading — 30-Day Masterclass',
    description:
      'Read faster, retain more, and rebuild how your mind processes information in 30 days. 7 live masterclasses, daily app-tracked drills, guided by Dr. Kapil Dev Sharma.',
    url: '/programs/quantum-speed-reading',
    audienceType: 'Students, exam aspirants, and lifelong learners',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <QsrNav />
      {/* Mumbai in-person workshop banner (see the "Add Mumbai In-Person
          QSR Workshop" task) — the one small addition to this otherwise-
          locked page. Deliberately a thin inline note between the nav and
          hero, not a card competing with the hero/CTA below it. */}
      <QsrMumbaiBanner />
      <main>
        <QsrHero />
        <QsrBrainScience />
        <QsrNeuroCognitiveScience />
        <QsrSpeedTestInlineCta variant="afterScience" />
        <QsrAgeGroups />
        <QsrAppPreview />
        <QsrMechanics />
        <QsrMoreThanSpeed />
        <QsrFocusScreenTime />
        <QsrDocumentMastery />
        <QsrCurriculum />
        <QsrExamBenefits />
        <QsrAuthority />
        <QsrCredibilityStrip cities={WORKSHOP_CITIES} />
        <QsrFounderVideo />
        <QsrLiveIntroSession />
        <QsrAudience />
        <QsrSpeedTestInlineCta variant="beforePricing" />
        <QsrVideoTestimonials />
        <QsrFaq />
        <QsrBatchNotice />
      </main>
      <Footer />
      <QsrStickyBar />
      <QsrWhatsAppWidget />
    </div>
  )
}
