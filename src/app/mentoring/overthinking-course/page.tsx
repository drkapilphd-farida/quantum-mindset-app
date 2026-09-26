import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/siteUrl'
import MindResetNav from '@/components/mind-reset/MindResetNav'
import MindResetHero from '@/components/mind-reset/MindResetHero'
import MindResetProblem from '@/components/mind-reset/MindResetProblem'
import MindResetWhatIsOverthinking from '@/components/mind-reset/MindResetWhatIsOverthinking'
import MindResetAssessmentCta from '@/components/mind-reset/MindResetAssessmentCta'
import MindResetExperience from '@/components/mind-reset/MindResetExperience'
import MindResetJourney from '@/components/mind-reset/MindResetJourney'
import MindResetWhoFor from '@/components/mind-reset/MindResetWhoFor'
import MindResetIncluded from '@/components/mind-reset/MindResetIncluded'
import MindResetGuide from '@/components/mind-reset/MindResetGuide'
import MindResetPricing from '@/components/mind-reset/MindResetPricing'
import MindResetHowItWorks from '@/components/mind-reset/MindResetHowItWorks'
import MindResetFaq from '@/components/mind-reset/MindResetFaq'
import MindResetFinalCta from '@/components/mind-reset/MindResetFinalCta'
import Footer from '@/components/Footer'
import MindResetStickyBar from '@/components/mind-reset/MindResetStickyBar'
import MindResetWhatsAppWidget from '@/components/mind-reset/MindResetWhatsAppWidget'

export const metadata: Metadata = buildPageMetadata({
  path: '/mentoring/overthinking-course',
  ownOgImage: true,
  title: 'The 21-Day Mind Reset System — Overthinking & Mental Clarity | Dr. Kapil Dev Sharma',
  description:
    '21 days of daily Hindi training, meditation, and guided activity to understand overthinking and build mental clarity. ₹499 for 1-month self-paced access, or ₹999 for 6 months plus 2 live sessions with Dr. Kapil.',
})

// 21-Day Mind Reset System™ (v2) — this IS the live page now (see the
// "MASTER PROMPT (FINAL, SELF-CONTAINED)" task): the redesign built at a
// staging route in an earlier pass (/mentoring/mind-reset-system) has
// been promoted here in place, replacing the old ₹2,999/₹5,999/₹8,999
// courseLanding content entirely. That old content — the Course* compon
// -ents and the `courseLanding` i18n block — has been deleted outright
// (not just unlinked), since it was fully orphaned once this page
// stopped rendering it and leaving ~600 lines of stale, wrong-pricing
// content sitting in the repo risked a future edit reintroducing it by
// mistake. The staging route itself now 308-redirects here (see
// next.config.ts) rather than 404ing for anyone who bookmarked it during
// review.
//
// Structured like the other Classplus-only pages: dark hero + dark nav
// (bounded to this page only, see MindResetNav.tsx/MindResetHero.tsx),
// i18n-driven throughout (t.mindResetLanding), sticky bottom CTA bar,
// WhatsApp widget for pre-purchase questions only. Every purchase CTA
// uses the same real Classplus link (CLASSPLUS_OVERTHINKING_COURSE_LINK)
// — tier/price selection happens at Classplus checkout itself, not via
// two separate URLs. Outstanding manual check (cannot be verified from
// this codebase, see that config's own doc comment): confirm on the
// Classplus dashboard that the ₹499 (no live sessions) / ₹999 (2 live
// sessions) split is actually configured there to match this page.
//
// Pricing correction: live sessions are a ₹999/6-month-only feature
// throughout every section that mentions pricing or plan comparison —
// MindResetExperience, MindResetIncluded, and MindResetPricing all
// render live sessions as a distinctly separate, highlighted item, never
// folded into the ₹499 plan's feature list. MindResetFaq's "are live
// sessions included in both plans" and "what's the difference" answers
// are corrected accordingly. No trace of the old ₹2,999/₹5,999/₹8,999
// tiers remains anywhere on this page.
//
// Section order follows the master prompt's numbered structure exactly:
// Hero -> Problem -> WhatIsOverthinking -> AssessmentCta (judgment call,
// unchanged from the staging build: the prompt's standalone "SELF-
// ASSESSMENT TEST" spec and its own numbered "SECTION 4" describe the
// same CTA twice with different headlines — built once here using
// SECTION 4's more detailed version, see MindResetAssessmentCta.tsx's
// own note) -> Experience -> Journey -> WhoFor -> Included -> Guide ->
// Pricing -> HowItWorks -> Faq -> FinalCta -> footer, sticky bar,
// WhatsApp widget. No Habit Builder CTA anywhere on this page.
export default function OverthinkingMasteryCoursePage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(translations.en.mindResetLanding.faq.items)
  const courseSchema = buildCourseSchema({
    name: 'The 21-Day Mind Reset System',
    description:
      '21 days of daily Hindi training, meditation, and guided activity to understand overthinking and build mental clarity.',
    url: absoluteUrl('/mentoring/overthinking-course'),
    audienceType: 'Indian parents, students, working professionals, homemakers, and entrepreneurs',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <MindResetNav />
      <main>
        <MindResetHero />
        <MindResetProblem />
        <MindResetWhatIsOverthinking />
        <MindResetAssessmentCta />
        <MindResetExperience />
        <MindResetJourney />
        <MindResetWhoFor />
        <MindResetIncluded />
        <MindResetGuide />
        <MindResetPricing />
        <MindResetHowItWorks />
        <MindResetFaq />
        <MindResetFinalCta />
      </main>
      <Footer />
      <MindResetStickyBar />
      <MindResetWhatsAppWidget />
    </div>
  )
}
