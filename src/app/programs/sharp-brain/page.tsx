import type { Metadata } from 'next'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/siteUrl'
import { programs } from '@/config/site.config'
import { sharpBrainCopy } from '@/lib/sharpBrainCopy'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import {
  SharpBrainApp,
  SharpBrainAudiences,
  SharpBrainCertificate,
  SharpBrainClasses,
  SharpBrainFaq,
  SharpBrainFinal,
  SharpBrainHero,
  SharpBrainHow,
  SharpBrainOffer,
  SharpBrainOutcomes,
  SharpBrainProblems,
  SharpBrainProof,
  SharpBrainStickyBar,
  SharpBrainTrainer,
  SharpBrainWhy,
} from '@/components/sharp-brain/SharpBrainSections'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const description =
  'A 30-day brain-skills program for students, exam aspirants and working professionals: 7 live classes with Dr. Kapil Dev Sharma + 10–15 minutes of daily app practice, with your progress measured from Day 1 to Day 30.'

export const metadata: Metadata = buildPageMetadata({
  path: programs.sharpBrain.url,
  title: 'Sharp Brain™ — 30-Day Brain Skills Program for Focus, Memory & Reading | Mind Ur Mind',
  description,
  ownOgImage: true,
})

// Re-rendered every minute so the server-rendered price and batch are
// never stale for long; the browser then refreshes them from the server
// clock (SharpBrainPricingProvider).
export const revalidate = 60

// Sharp Brain™ — one universal positioning, one offer (rewritten 1 Oct 2026).
// Section order: see SharpBrainSections.tsx.
export default function SharpBrainPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(sharpBrainCopy.en.faq.items)
  const courseSchema = buildCourseSchema({
    name: 'Sharp Brain™ — 30-Day Brain Skills Program',
    description,
    url: absoluteUrl(programs.sharpBrain.url),
    audienceType: 'School and college students, competitive-exam aspirants, working professionals and parents',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <SharpBrainPricingProvider initial={pricingSnapshot(Date.now())}>
        <SharpBrainNav />
        <main>
          <SharpBrainHero />
          <SharpBrainProblems />
          <SharpBrainWhy />
          <SharpBrainOutcomes />
          <SharpBrainApp />
          <SharpBrainClasses />
          <SharpBrainAudiences />
          <SharpBrainHow />
          <SharpBrainCertificate />
          <SharpBrainProof />
          <SharpBrainTrainer />
          <SharpBrainOffer />
          <SharpBrainFaq />
          <SharpBrainFinal />
        </main>
        <Footer />
        <SharpBrainStickyBar />
      </SharpBrainPricingProvider>
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="sharp_brain_widget" bottomClassName="bottom-24 sm:bottom-7" />
    </div>
  )
}
