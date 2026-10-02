import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import { SharpBrainFinal, SharpBrainProof, SharpBrainReviewsHero, SharpBrainStickyBar } from '@/components/sharp-brain/SharpBrainSections'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: '/reviews',
    title: 'Video Reviews — Sharp Brain™ | Mind Ur Mind',
    description: 'Video reviews from learners in earlier batches of the Sharp Brain 30-Day Program, with Dr. Kapil Dev Sharma.',
  }),
  robots: { index: false, follow: false },
}

// Re-rendered every minute so the price follows the batch/early-bird logic.
export const revalidate = 60

// Video reviews for Sharp Brain™ (rebuilt 2 Oct 2026 in the program page's
// design): hero with live price → the same video-review section as
// /programs/sharp-brain ("From earlier batches", YouTube channel) → final CTA.
// No review counts or other numbers that can't be verified.
export default function ReviewsPage(): React.JSX.Element {
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainPricingProvider initial={pricingSnapshot(Date.now())}>
        <SharpBrainNav />
        <main>
          <SharpBrainReviewsHero />
          <SharpBrainProof />
          <SharpBrainFinal />
        </main>
        <Footer />
        <SharpBrainStickyBar />
      </SharpBrainPricingProvider>
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="reviews_widget" bottomClassName="bottom-24 sm:bottom-7" />
    </div>
  )
}
