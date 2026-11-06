import type { Metadata } from 'next'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildCourseSchema } from '@/lib/seo/courseSchema'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { LanguageOverride } from '@/context/LanguageContext'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { absoluteUrl } from '@/lib/seo/siteUrl'
import { programs } from '@/config/site.config'
import { sharpBrainCopy } from '@/lib/sharpBrainCopy'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import {
  SharpBrainApp,
  SharpBrainCertificate,
  SharpBrainClasses,
  SharpBrainCompare,
  SharpBrainFaq,
  SharpBrainOffers,
  SharpBrainOffersFinal,
  SharpBrainOffersHero,
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

export const metadata: Metadata = withLanguageAlternates(
  buildPageMetadata({
    path: programs.sharpBrain.url,
    title: 'Sharp Brain™ — 30-Day Brain Skills Program for Focus, Memory & Reading | Mind Ur Mind',
    description,
    ownOgImage: true,
  }),
  programs.sharpBrain.url,
)

type Props = { searchParams: Promise<{ lang?: string | string[] }> }

// Re-rendered every minute so the server-rendered price and batch are
// never stale for long; the browser then refreshes them from the server
// clock (SharpBrainPricingProvider).
export const revalidate = 60

// Sharp Brain™ — Phase 6B: two offers on one page (live batch ₹8,999 via the
// existing checkout, self-paced ₹2,999 via a Razorpay payment link).
// English by default, Hindi at ?lang=hi (the language comes from the URL).
// Section order: see SharpBrainSections.tsx.
export default async function SharpBrainPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  const path = programs.sharpBrain.url
  const languageLink = lang === 'hi' ? { label: 'English', href: path } : { label: 'हिंदी', href: `${path}?lang=hi` }
  const faqSchema = buildFaqPageSchema(sharpBrainCopy[lang].faq.items)
  const courseSchema = buildCourseSchema({
    name: 'Sharp Brain™ — 30-Day Brain Skills Program',
    description,
    url: absoluteUrl(programs.sharpBrain.url),
    audienceType: 'School and college students, competitive-exam aspirants, working professionals and parents',
  })

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
        <SharpBrainPricingProvider initial={pricingSnapshot(Date.now())}>
          <SharpBrainNav enrolHref="#enrol" languageLink={languageLink} />
          <main>
            <SharpBrainOffersHero />
            <SharpBrainProblems />
            <SharpBrainWhy />
            <SharpBrainApp />
            <SharpBrainClasses />
            <SharpBrainCompare />
            <SharpBrainOffers />
            <SharpBrainCertificate />
            <SharpBrainProof />
            <SharpBrainTrainer />
            <SharpBrainFaq />
            <SharpBrainOffersFinal />
          </main>
          <Footer />
          <SharpBrainStickyBar enrolHref="#enrol" hideRegularPrice />
        </SharpBrainPricingProvider>
        <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="sharp_brain_widget" bottomClassName="bottom-24 sm:bottom-7" />
      </div>
    </LanguageOverride>
  )
}
