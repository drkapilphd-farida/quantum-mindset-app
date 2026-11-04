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
  SharpBrainCertificate,
  SharpBrainDay30,
  SharpBrainFaq,
  SharpBrainFinal,
  SharpBrainHero,
  SharpBrainHow,
  SharpBrainIncluded,
  SharpBrainOffer,
  SharpBrainPain,
  SharpBrainParents,
  SharpBrainProof,
  SharpBrainReframe,
  SharpBrainScrollDepth,
  SharpBrainSkills,
  SharpBrainStickyBar,
  SharpBrainTrainer,
} from '@/components/sharp-brain/SharpBrainSections'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'

// Description = the hero sub (EN), word for word.
const description = sharpBrainCopy.en.hero.sub

export const metadata: Metadata = buildPageMetadata({
  path: programs.sharpBrain.url,
  title: 'Sharp Brain — 30-day focus, reading & memory training for Class 6–12 | Mind Ur Mind',
  description,
  ownOgImage: true,
})

// Re-rendered every minute so the server-rendered price, seat counter and
// next class are never stale for long; the browser then refreshes them from
// the server (SharpBrainPricingProvider).
export const revalidate = 60

// Sharp Brain™ for parents of Class 6–12 children (rewritten 4 Nov 2026):
// rolling admission, ₹2,999 for the first 100 seats. Section order: see
// SharpBrainSections.tsx.
export default async function SharpBrainPage(): Promise<React.JSX.Element> {
  const faqSchema = buildFaqPageSchema(sharpBrainCopy.en.faq.items)
  const courseSchema = buildCourseSchema({
    name: 'Sharp Brain™ — 30-day focus, reading & memory training',
    description,
    url: absoluteUrl(programs.sharpBrain.url),
    audienceType: 'Parents of Class 6–12 school children; also college students, exam aspirants and professionals',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <SharpBrainPricingProvider initial={await pricingSnapshot()}>
        <SharpBrainNav />
        <main>
          <SharpBrainHero />
          <SharpBrainPain />
          <SharpBrainReframe />
          <SharpBrainSkills />
          <SharpBrainDay30 />
          <SharpBrainHow />
          <SharpBrainParents />
          <SharpBrainCertificate />
          <SharpBrainProof />
          <SharpBrainTrainer />
          <SharpBrainIncluded />
          <SharpBrainOffer />
          <SharpBrainFaq />
          <SharpBrainFinal />
        </main>
        <Footer />
        <SharpBrainStickyBar />
        <SharpBrainScrollDepth />
      </SharpBrainPricingProvider>
      {/* Phones: the sticky bar already has a WhatsApp button, and the floating one covered the hero. */}
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="sharp_brain_widget" bottomClassName="max-sm:!hidden sm:bottom-7" />
    </div>
  )
}
