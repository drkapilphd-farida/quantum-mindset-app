import type { Metadata } from 'next'
import QsrNav from '@/components/qsr/QsrNav'
import Footer from '@/components/Footer'
import QsrWhatsAppWidget from '@/components/qsr/QsrWhatsAppWidget'
import QsrSpeedTestExperience from '@/components/qsr/speed-test/QsrSpeedTestExperience'
import QsrSpeedTestLiveExperience from '@/components/qsr/speed-test/QsrSpeedTestLiveExperience'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/programs/quantum-speed-reading/speed-test',
  title: 'Free Reading Speed Test — Quantum Speed Reading',
  description:
    'Measure your real reading speed and comprehension in 2 minutes, then feel what a trained pace is like — free, no payment required.',
})

type QsrSpeedTestPageProps = {
  searchParams: Promise<{ mode?: string | undefined }>
}

// Dedicated route (not a modal) — this is a genuine multi-step flow
// (7 stages: intro, calibration, quiz, transition, speed demo, quiz,
// results), and a cramped inline widget on the main landing page would
// fight the page's own scroll/section rhythm. Reuses the QSR page's
// exact minimal chrome (QsrNav + Footer + WhatsApp widget) so this
// doesn't feel like an orphaned page — see QsrHero.tsx's secondary CTA
// and HeroSection.tsx's secondary CTA for the two entry points.
//
// ?mode=live (see the "Speed Test — Live Class + Public Standalone
// Ready" task) — a second, simpler flow (QsrSpeedTestLiveExperience)
// for screen-recorded live-class use: one pinned passage, a large
// visible timer, 5 questions, WPM+score together on one results screen,
// no RSVP demo/upsell. The default URL (no query param) keeps rendering
// the existing QsrSpeedTestExperience funnel unchanged — every existing
// link to this page (homepage, QSR hero, QSR page inline CTAs) is
// unaffected. Public URL for live mode:
// https://mindurmind.org.in/programs/quantum-speed-reading/speed-test?mode=live
export default async function QsrSpeedTestPage({ searchParams }: QsrSpeedTestPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const isLiveMode = params.mode === 'live'

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <QsrNav />
      <main>{isLiveMode ? <QsrSpeedTestLiveExperience /> : <QsrSpeedTestExperience />}</main>
      <Footer />
      <QsrWhatsAppWidget />
    </div>
  )
}
