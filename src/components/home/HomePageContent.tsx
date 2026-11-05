import type { Lang } from '@/lib/i18n'
import { LanguageOverride } from '@/context/LanguageContext'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { homeCopy } from '@/lib/homeCopy'
import SiteNav from '@/components/site/SiteNav'
import HomeAnnouncementStrip from '@/components/HomeAnnouncementStrip'
import HomeHero from '@/components/home/HomeHero'
import HomePodcastFeature from '@/components/HomePodcastFeature'
import HomeFaq from '@/components/home/HomeFaq'
import { HomeBenefits, HomeFranchiseStrip, HomeJourney, HomeMuse, HomeOverthinkingStrip, HomeSharpBrainStrip } from '@/components/home/HomeV2Sections'
import { DateCards } from '@/features/telepathy-workshop/components/DateCards'
import { ProofSection } from '@/features/telepathy-workshop/components/V2Sections'
import { Highlights } from '@/features/telepathy-workshop/components/Highlights'
import { HOME_HIGHLIGHTS } from '@/features/telepathy-workshop/highlights'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import Footer from '@/components/Footer'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'

// The homepage, shared by `/` (English) and `/hi` (Hindi) — positioning
// rework. LanguageOverride fixes the page's language whatever language is
// stored (the stored choice, shared with the app, is left alone).
// Phase 4.2 order (copy/home-v2.md): hero → what changes after 2 days →
// date cards (#dates) → proof (3 telepathy videos) → workshop highlights
// (6 photos; Phase 4.3 — the old Learning/Meditation reviews section is no
// longer rendered here) → EEG → the journey ahead → Sharp Brain strip (its
// early-bird price/timer lives only there) → overthinking strip → podcast
// → FAQ → franchise strip → footer. The old #solve 4-card section and the
// other old sections are no longer rendered.
export default function HomePageContent({ lang }: { lang: Lang }): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()
  const faqSchema = buildFaqPageSchema(homeCopy.en.faq.items)
  const renderedAt = Date.now()

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
        <HomeAnnouncementStrip />
        <SiteNav />
        <main>
          <HomeHero />
          <HomeBenefits />
          <DateCards lang={lang} renderedAt={renderedAt} id="dates" />
          <div className="tw-page" data-lang={lang}>
            <ProofSection lang={lang} tint={false} />
          </div>
          <Highlights lang={lang} photos={HOME_HIGHLIGHTS} tint />
          <HomeMuse />
          <HomeJourney />
          <SharpBrainPricingProvider initial={pricingSnapshot(renderedAt)}>
            <HomeSharpBrainStrip />
          </SharpBrainPricingProvider>
          <HomeOverthinkingStrip />
          <HomePodcastFeature />
          <HomeFaq />
          <HomeFranchiseStrip />
        </main>
        <Footer />
        <WhatsAppWidget bottomClassName="bottom-24 sm:bottom-7" autoDismissBubbleMs={6000} revealAfterElementId="top" />
      </div>
    </LanguageOverride>
  )
}
