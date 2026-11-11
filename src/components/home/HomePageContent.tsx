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
import { HomeFinalCta, HomeFranchiseStrip, HomeFreeTools, HomeHowSessions, HomeMeetKapil, HomePaths, HomeSharpBrainReviews, HomeTrustStrip } from '@/components/home/HomeV2Sections'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import Footer from '@/components/Footer'

// The homepage, shared by `/` (English) and `/hi` (Hindi) — positioning
// rework. LanguageOverride fixes the page's language whatever language is
// stored (the stored choice, shared with the app, is left alone).
// Order (owner's homepage upgrade, Nov 2026): hero → trust strip → two
// paths → how Personal Sessions work → reviews (Sharp Brain, Personal
// Sessions) → meet Dr. Kapil → free tools → podcast → FAQ → final call to
// action → partner strip → footer.
export default function HomePageContent({ lang }: { lang: Lang }): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()
  const faqSchema = buildFaqPageSchema(homeCopy.en.faq.items)

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
          <HomeTrustStrip />
          <HomePaths />
          <HomeHowSessions />
          <HomeSharpBrainReviews />
          <HomeMeetKapil />
          <HomeFreeTools />
          <HomePodcastFeature />
          <HomeFaq />
          <HomeFinalCta />
          <HomeFranchiseStrip />
        </main>
        <Footer />
        <WhatsAppWidget bottomClassName="bottom-24 sm:bottom-7" autoDismissBubbleMs={6000} revealAfterElementId="top" />
      </div>
    </LanguageOverride>
  )
}
