import type { Metadata } from 'next'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import ReadingSpeedTest from '@/features/reading-speed-test/components/ReadingSpeedTest'
import QsrSpeedTestLiveExperience from '@/components/qsr/speed-test/QsrSpeedTestLiveExperience'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/programs/sharp-brain/speed-test',
  title: 'Free Reading Speed Test — Sharp Brain™ | Mind Ur Mind',
  description:
    'Measure your real reading speed and comprehension: read one passage at your own pace, answer 5 questions, get your Effective Reading Speed — free, in English or Hindi.',
})

type QsrSpeedTestPageProps = {
  searchParams: Promise<{ mode?: string | undefined }>
}

// Dedicated route (not a modal) — a multi-step flow (measured test, then
// an optional app-practice demo; see ReadingSpeedTest.tsx), and a cramped
// inline widget on the main landing page would fight the page's own
// scroll/section rhythm. Reuses the QSR page's
// exact minimal chrome (QsrNav + Footer + WhatsApp widget) so this
// doesn't feel like an orphaned page — see QsrHero.tsx's secondary CTA
// and HeroSection.tsx's secondary CTA for the two entry points.
//
// ?mode=live (see the "Speed Test — Live Class + Public Standalone
// Ready" task) — a second, simpler flow (QsrSpeedTestLiveExperience)
// for screen-recorded live-class use: one pinned passage, a large
// visible timer, 5 questions, WPM+score together on one results screen,
// no RSVP demo/upsell. The default URL (no query param) renders the
// public test (ReadingSpeedTest). Public URL for live mode:
// https://mindurmind.org.in/programs/sharp-brain/speed-test?mode=live
export default async function QsrSpeedTestPage({ searchParams }: QsrSpeedTestPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const isLiveMode = params.mode === 'live'

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainNav />
      <main>{isLiveMode ? <QsrSpeedTestLiveExperience /> : <ReadingSpeedTest />}</main>
      <Footer />
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="speed_test_widget" />
    </div>
  )
}
