import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'
import Navbar from '@/components/Navbar'
import HomeAnnouncementStrip from '@/components/HomeAnnouncementStrip'
import HeroSection from '@/components/HeroSection'
import { HomeExecutiveWorkshopFeature } from '@/components/HomeExecutiveWorkshopFeature'
import { HomeCorporateWorkshopStrip } from '@/components/HomeCorporateWorkshopStrip'
import ProgramSelector from '@/components/ProgramSelector'
import HomePrefrontalPowerFeature from '@/components/HomePrefrontalPowerFeature'
import HomeHabitBuilderFeature from '@/components/HomeHabitBuilderFeature'
import HomeOverviewVideo from '@/components/HomeOverviewVideo'
import HomePodcastFeature from '@/components/HomePodcastFeature'
import ProgramCardsGrid from '@/components/ProgramCardsGrid'
import HomeSpeedTestCta from '@/components/HomeSpeedTestCta'
import HomeWhyMindUrMind from '@/components/HomeWhyMindUrMind'
import OfflineEegWorkshopSection from '@/components/OfflineEegWorkshopSection'
import Testimonials from '@/components/Testimonials'
import HomeGuideSection from '@/components/HomeGuideSection'
import FAQSection from '@/components/FAQSection'
import HomeFinalCta from '@/components/HomeFinalCta'
import HomeFranchiseTeaser from '@/components/HomeFranchiseTeaser'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import Footer from '@/components/Footer'

// Site-rebuild Phase 1 — homepage now leads with the founder/brand
// identity (per explicit brief) rather than the QSR-flagship-only
// framing the previous title/description used; the QSR program itself
// is still the first product featured on the page and keeps its own
// title/description on its own /programs/quantum-speed-reading route.
const homeTitle = 'Dr. Kapil Dev Sharma — Brain, Mind & Meditation Coach | Mind Ur Mind'
const homeDescription =
  'Dr. Kapil Dev Sharma — brain, mind and meditation coach with 26 years in education and mind training. Quantum Speed Reading, overthinking reset, meditation retreats, 1-on-1 coaching and corporate brain performance workshops.'

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: '/',
    title: homeTitle,
    description: homeDescription,
  }),
  keywords: [
    'speed reading for students',
    'exam preparation reading speed',
    'competitive exam study techniques',
    'reading speed test India',
    'quantum speed reading Vadodara',
    'Dr. Kapil Dev Sharma',
    'brain and mind coach Vadodara',
  ],
}

// Homepage V3™ — conversion-focused rewrite (see the "Homepage & QSR
// Conversion Rewrite" task): Hero (single positioning headline + pain
// point + one primary CTA into the free live intro session) →
// Executive Brain Performance Workshop feature (see the "Executive
// Brain Performance Workshop: page fixes + homepage positioning" task,
// section 2.3 — directly below the hero since this homepage's hero is a
// single static block, not a slider) → exactly 3
// audience-first path cards (#begin — "Learning for myself" / "Looking
// for my child" / "Deeper mind training", replacing the old
// product-first QSR-flagship-plus-3-secondary-paths layout) → Founder
// Podcast Feature (Dr. Kapil's appearance on Solomon Daniel's podcast —
// broad brand/founder-authority content, not QSR-specific, so it sits
// here rather than inside the QSR-only Testimonials carousel; "hear from
// the founder himself" before student/parent results) → Testimonials,
// moved up to sit directly behind the path cards as immediate social
// proof → brand overview video → the full program
// catalog (#explore-programs) → a short "For Corporate Teams" strip
// pointing HR/L&D visitors at the Executive Workshop's own #corporate
// section → free Speed Test → Why Mind Ur Mind → Dr.
// Kapil → FAQ → Final CTA → PREfrontal POWER and Habit Builder, both
// pushed to the very bottom (deliberately last, after every
// QSR-reinforcing section) since neither should compete with the QSR-led
// primary fold for first-scroll attention → Franchise teaser → footer.
// The Mumbai in-person workshop banner (previously rendered here via
// HomeMumbaiWorkshopFeature) is removed from the homepage entirely per
// that task — the component file and its own page
// (/programs/quantum-speed-reading-mumbai) are untouched and still
// directly reachable, just not linked from here until the batch is
// confirmed. HomeGalleryGlimpse is still not rendered here (unrelated to
// this pass — see the prior architecture note this replaces).
export default function HomePage(): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <HomeAnnouncementStrip />
      <Navbar />
      <main>
        <HeroSection />
        <HomeExecutiveWorkshopFeature />
        <ProgramSelector />
        <HomePodcastFeature />
        <Testimonials />
        <HomeOverviewVideo />
        <ProgramCardsGrid />
        <HomeCorporateWorkshopStrip />
        <HomeSpeedTestCta />
        <HomeWhyMindUrMind />
        {/* Offline QSR + EEG Cognitive Testing teaser (see the "Homepage,
            QSR & Multi-City EEG Rewrite" task) — shorter homepage
            version, one CTA pointing at the full multi-city section on
            the QSR page rather than duplicating the city grid here. */}
        <OfflineEegWorkshopSection variant="teaser" />
        <HomeGuideSection />
        <FAQSection />
        <HomeFinalCta />
        <HomePrefrontalPowerFeature />
        <HomeHabitBuilderFeature />
        <HomeFranchiseTeaser />
      </main>
      <Footer />
      {/* Mobile QA™ — the new hero has one more line (the credentials
          trust strip below the CTA row) than before, which pushed its CTA
          row low enough on short mobile viewports to collide with this
          widget's own pre-tuned bottom-16 default (see WhatsAppWidget.tsx's
          own doc comment on why that default exists). A little more
          bottom clearance on mobile only, same technique already used on
          the QSR/Franchise pages. autoDismissBubbleMs closes the large
          explanatory bubble after 6s (it was previously left open
          indefinitely on this page only, unlike every other page using
          this widget) — confirmed via user report to be the main source
          of it persistently covering hero/testimonial content while
          scrolling; the compact button alone remains available. Footer's
          own bottom padding (see Footer.tsx) is what keeps the button
          clear of the footer's copyright/link row at max scroll.
          revealAfterElementId="top": measured via Playwright that at
          1024x768 this widget's fixed bottom-right position overlaps the
          hero founder portrait's bottom-right corner (the hand) by ~13px
          — confirmed real, not a false positive. A fixed pixel threshold
          cleared that breakpoint but still overlapped on mobile (much
          taller stacked hero) — measuring the actual hero section
          (id="top") and revealing only once it's fully scrolled out of
          view removes the overlap at every breakpoint, not just the one
          it was tuned against. */}
      <WhatsAppWidget bottomClassName="bottom-24 sm:bottom-7" autoDismissBubbleMs={6000} revealAfterElementId="top" />
    </div>
  )
}
