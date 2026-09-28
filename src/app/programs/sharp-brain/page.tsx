import type { Metadata } from 'next'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/seo/siteUrl'
import { programs } from '@/config/site.config'
import { sharpBrainCopy } from '@/lib/sharpBrainCopy'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import {
  SharpBrainAudiences,
  SharpBrainFaq,
  SharpBrainFinal,
  SharpBrainFormats,
  SharpBrainHero,
  SharpBrainHow,
  SharpBrainParents,
  SharpBrainProof,
  SharpBrainSkills,
  SharpBrainStickyBar,
  SharpBrainTrainer,
} from '@/components/sharp-brain/SharpBrainSections'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata: Metadata = buildPageMetadata({
  path: programs.sharpBrain.url,
  title: 'Sharp Brain™ — Focus · Memory · Smart Reading | Dr. Kapil Dev Sharma',
  description:
    'A cognitive skills program for focus, memory, smart reading and mobile discipline — improvement measured from your own Day 1 to Day 30. 7 live classes and 30 days of app practice, ₹9,999 one-time.',
  ownOgImage: true,
})

// Sharp Brain™ — Focus · Memory · Smart Reading (formerly "Quantum Speed
// Reading"; renamed in site-rebuild Phase 5B). Order: hero → who it's for
// (tabs) → 5 skills → how it works → formats & prices (+ guarantee) → for
// parents → proof → trainer → FAQ → final CTA + free starter.
export default function SharpBrainPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(sharpBrainCopy.en.faq.items)
  const courseSchema = buildCourseSchema({
    name: 'Sharp Brain™ — Focus · Memory · Smart Reading',
    description:
      'A 30-day cognitive skills program for focus, memory, smart reading and mobile discipline, with 7 live classes by Dr. Kapil Dev Sharma and daily app practice. Improvement measured from your own Day 1 to Day 30.',
    url: absoluteUrl(programs.sharpBrain.url),
    audienceType: 'Parents of children aged 10–17, students, exam aspirants and working professionals',
  })

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <SharpBrainNav />
      <main>
        <SharpBrainHero />
        <SharpBrainAudiences />
        <SharpBrainSkills />
        <SharpBrainHow />
        <SharpBrainFormats />
        <SharpBrainParents />
        <SharpBrainProof />
        <SharpBrainTrainer />
        <SharpBrainFaq />
        <SharpBrainFinal />
      </main>
      <Footer />
      <SharpBrainStickyBar />
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="sharp_brain_widget" bottomClassName="bottom-24 sm:bottom-7" />
    </div>
  )
}
