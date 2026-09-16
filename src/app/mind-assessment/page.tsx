import type { Metadata } from 'next'
import { translations } from '@/lib/i18n'
import MindResetNav from '@/components/mind-reset/MindResetNav'
import Footer from '@/components/Footer'
import MindResetWhatsAppWidget from '@/components/mind-reset/MindResetWhatsAppWidget'
import OverthinkingTestExperience from '@/components/mind-reset/OverthinkingTestExperience'

export const metadata: Metadata = {
  title: { absolute: `${translations.en.overthinkingTestLanding.meta.title} | Mind Ur Mind` },
  description: translations.en.overthinkingTestLanding.meta.description,
  alternates: {
    canonical: '/mind-assessment',
  },
}

// The Overthinking Test™ — the real, working assessment (see the "Build
// the Overthinking Test Free Assessment" task), replacing the earlier
// "Coming Soon" placeholder. Route kept as /mind-assessment (unchanged
// from the placeholder) even though the product is now named
// "Overthinking Test" everywhere in the UI — renaming the URL itself
// wasn't asked for and would orphan the existing links already pointing
// here from /mentoring/overthinking-course.
//
// Reuses this page's existing minimal chrome (MindResetNav + Footer +
// MindResetWhatsAppWidget — same pattern QsrSpeedTestPage uses for its
// own dedicated multi-step quiz route) rather than inventing new chrome
// for a single page. All of the actual quiz/results/lead-capture logic
// lives in OverthinkingTestExperience, a client component (interactive
// state machine — question index, per-question answers, submitted
// lead), imported here into an otherwise-static Server Component page.
export default function MindAssessmentPage(): React.JSX.Element {
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <MindResetNav />
      <main>
        <OverthinkingTestExperience />
      </main>
      <Footer />
      <MindResetWhatsAppWidget />
    </div>
  )
}
