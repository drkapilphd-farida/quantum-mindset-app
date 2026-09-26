import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/siteUrl'
import QsrNav from '@/components/qsr/QsrNav'
import QsrHero from '@/components/qsr/QsrHero'
import QsrWhoIsThisFor from '@/components/qsr/QsrWhoIsThisFor'
import QsrPainPoints from '@/components/qsr/QsrPainPoints'
import QsrBrainScience from '@/components/qsr/QsrBrainScience'
import QsrBrainwaveScience from '@/components/qsr/QsrBrainwaveScience'
import QsrNeuroCognitiveScience from '@/components/qsr/QsrNeuroCognitiveScience'
import OfflineEegWorkshopSection from '@/components/OfflineEegWorkshopSection'
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

export const metadata: Metadata = buildPageMetadata({
  path: '/programs/quantum-speed-reading',
  ownOgImage: true,
  title: 'Quantum Speed Reading — Science-Backed Neuro-Cognitive Masterclass | Dr. Kapil Dev Sharma',
  description:
    'Read 5x faster, retain more, and rebuild how your mind processes information in 30 days. 7 live masterclasses, daily app-tracked cognitive metrics, ₹9,999 one-time enrollment.',
})

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
// it covers beyond raw reading speed (MoreThanSpeed, FocusScreenTime) →
// a compact "what's included" mention of a real, separate in-app feature
// (DocumentMastery — Upload & Learn) → the week-by-week breakdown
// (Curriculum) → who is actually teaching it (Authority, CredibilityStrip,
// FounderVideo) → a focused parent-facing outcomes note (Audience) → the
// same free test again, now as a lower-commitment alternative right where
// a hesitant visitor is deciding whether to commit to ₹9,999
// (SpeedTestInlineCta) → social proof (VideoTestimonials) → final
// objection handling (Faq) → real batch cadence + final push
// (BatchNotice) before the footer.
//
// Positioning fix (see the "QSR Page Cleanup & Credibility Fixes" task,
// Fixes 2 & 3): FocusScreenTime's "Pairs Well With QSR" Habit Builder
// cross-sell card (a second, ₹99 price point inside this ₹9,999 page's
// body) was removed entirely — the Habit Builder still has a real link
// via the shared Footer's own program column, just no longer a
// promotional card in the body. DocumentMastery shrunk from a 5-
// screenshot promotional showcase down to a single compact "what's
// included" list, for the same "one clear offer per page" reason.
//
// Positioning fix (see the earlier "Fix Homepage & QSR Page Positioning" task):
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
    url: absoluteUrl('/programs/quantum-speed-reading'),
    audienceType: 'Students, exam aspirants, and lifelong learners',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <QsrNav />
      <main>
        <QsrHero />
        {/* Who Is This For? + Pain Points (see the "Homepage & QSR
            Conversion Rewrite" task) — audience confirmation and
            pain-point framing land before any feature/metric content,
            per that task's explicit ordering. The Mumbai in-person
            workshop card previously rendered here is removed from this
            page per that same task (component file and its own page
            untouched, just not linked from here until the batch is
            confirmed). */}
        <QsrWhoIsThisFor />
        <QsrPainPoints />
        <QsrBrainScience />
        {/* Brainwave Science Infographic (see the "Add Brainwave Science
            Infographic to QSR Page" task) — sits right after the 4-card
            "why this works" section (QsrBrainScience) and before the
            metrics/EEG section (QsrNeuroCognitiveScience), as the visual
            payoff of the cards above. */}
        <QsrBrainwaveScience />
        <QsrNeuroCognitiveScience />
        {/* Offline QSR + EEG Cognitive Testing, multi-city (see the
            "Homepage, QSR & Multi-City EEG Rewrite" task) — primary
            placement, right where the old single-city "EEG available in
            Vadodara" box used to sit, and exactly what
            QsrNeuroCognitiveScience's own "how this is measured" note
            above points to via id="offline-eeg". */}
        <OfflineEegWorkshopSection variant="full" />
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
