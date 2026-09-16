import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
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

export const metadata: Metadata = {
  title: { absolute: 'The 21-Day Mind Reset System — Overthinking & Mental Clarity | Dr. Kapil Dev Sharma' },
  description:
    '21 days of daily Hindi training, meditation, and guided activity to understand overthinking and build mental clarity. ₹499 for 1-month self-paced access, or ₹999 for 6 months plus 2 live sessions with Dr. Kapil.',
}

// 21-Day Mind Reset System™ (v2) — built from the "Build the 21-Day Mind
// Reset System Landing Page" master prompt, at a staging route
// (/mentoring/mind-reset-system) rather than overwriting the live page
// at /mentoring/overthinking-course in place (see that page's own
// courseLanding content, still untouched, still using the old ₹2,999/
// ₹5,999/₹8,999 model). Dr. Sharma decides how/when this replaces that
// page — direct replacement vs. redirect — once reviewed.
//
// Structured like the other Classplus-only pages (CourseNav/
// CourseStickyBar/CourseWhatsAppWidget pattern): dark hero + dark nav
// (bounded to this page only), i18n-driven throughout
// (t.mindResetLanding), sticky bottom CTA bar, WhatsApp widget for
// pre-purchase questions only. Every purchase CTA uses the same real
// Classplus link (CLASSPLUS_OVERTHINKING_COURSE_LINK) — tier/price
// selection happens at Classplus checkout itself, not via two separate
// URLs.
//
// Pricing correction (see the "Correction: Live Sessions Move to ₹999
// Plan Only" task): live sessions are a ₹999/6-month-only feature
// throughout every section that mentions pricing or plan comparison —
// MindResetExperience, MindResetIncluded, and MindResetPricing all
// render live sessions as a distinctly separate, highlighted item, never
// folded into the ₹499 plan's feature list. MindResetFaq's "are live
// sessions included in both plans" and "what's the difference" answers
// are corrected accordingly.
//
// Section order follows the master prompt's numbered structure exactly:
// Hero -> Problem -> WhatIsOverthinking -> AssessmentCta (judgment call:
// the prompt's standalone "SELF-ASSESSMENT TEST" spec and its own
// numbered "SECTION 4" describe the same CTA twice with different
// headlines — built once here using SECTION 4's more detailed version,
// see MindResetAssessmentCta.tsx's own note) -> Experience -> Journey ->
// WhoFor -> Included -> Guide -> Pricing -> HowItWorks -> Faq ->
// FinalCta -> footer, sticky bar, WhatsApp widget.
export default function MindResetSystemPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(translations.en.mindResetLanding.faq.items)
  const courseSchema = buildCourseSchema({
    name: 'The 21-Day Mind Reset System',
    description:
      '21 days of daily Hindi training, meditation, and guided activity to understand overthinking and build mental clarity.',
    url: '/mentoring/mind-reset-system',
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
