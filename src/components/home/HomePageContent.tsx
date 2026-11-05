import type { Lang } from '@/lib/i18n'
import { LanguageOverride } from '@/context/LanguageContext'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { homeCopy } from '@/lib/homeCopy'
import SiteNav from '@/components/site/SiteNav'
import HomeAnnouncementStrip from '@/components/HomeAnnouncementStrip'
import HomeHero from '@/components/home/HomeHero'
import HomeProblems from '@/components/home/HomeProblems'
import HomeStartFree from '@/components/home/HomeStartFree'
import HomeProof from '@/components/home/HomeProof'
import HomeHowWeWork from '@/components/home/HomeHowWeWork'
import HomeAbout from '@/components/home/HomeAbout'
import HomePodcastFeature from '@/components/HomePodcastFeature'
import HomeUpcoming from '@/components/home/HomeUpcoming'
import HomeOrganisations from '@/components/home/HomeOrganisations'
import HomeFaq from '@/components/home/HomeFaq'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import Footer from '@/components/Footer'
import { upcomingEvents } from '@/config/site.config'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'

// The homepage, shared by `/` (Hindi) and `/en` (English) — positioning
// rework. LanguageOverride fixes the page's language whatever language is
// stored (the stored choice, shared with the app, is left alone).
// Problem-first homepage (site-rebuild Phase 4): who Dr. Kapil Dev Sharma
// is, which problem he solves for the visitor, and the first step — in
// that order. All names, stats, prices and links come from site.config.ts.
export default function HomePageContent({ lang }: { lang: Lang }): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()
  const faqSchema = buildFaqPageSchema(homeCopy.en.faq.items)
  const events = upcomingEvents().slice(0, 2)

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
          <SharpBrainPricingProvider initial={pricingSnapshot(Date.now())}>
            <HomeProblems />
          </SharpBrainPricingProvider>
          <HomeStartFree />
          <HomeProof />
          <HomeHowWeWork />
          <HomeAbout />
          <HomePodcastFeature />
          <HomeUpcoming initial={events} />
          <HomeOrganisations />
          <HomeFaq />
        </main>
        <Footer />
        <WhatsAppWidget bottomClassName="bottom-24 sm:bottom-7" autoDismissBubbleMs={6000} revealAfterElementId="top" />
      </div>
    </LanguageOverride>
  )
}
