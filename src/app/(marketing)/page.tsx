import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
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
import { trainer, upcomingEvents } from '@/config/site.config'

// Site-rebuild Phase 1 — homepage now leads with the founder/brand
// identity (per explicit brief) rather than the QSR-flagship-only
// framing the previous title/description used; the QSR program itself
// is still the first product featured on the page and keeps its own
// title/description on its own /programs/sharp-brain route.
const homeTitle = 'Dr. Kapil Dev Sharma — Brain, Mind & Meditation Coach | Mind Ur Mind'
const homeDescription =
  `${trainer.name} — brain, mind and meditation coach with ${trainer.years.total} years in education and mind training. Sharp Brain, overthinking reset, meditation retreats, 1-on-1 coaching and corporate brain performance workshops.`

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
    'sharp brain program Vadodara',
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
// (/programs/sharp-brain) are untouched and still
// directly reachable, just not linked from here until the batch is
// confirmed. HomeGalleryGlimpse is still not rendered here (unrelated to
// this pass — see the prior architecture note this replaces).
// Re-render at least hourly so the upcoming-events list (and anything
// else date-bound) never goes stale for long; HomeUpcoming also re-filters
// in the browser.
export const revalidate = 3600

// Problem-first homepage (site-rebuild Phase 4): who Dr. Kapil Dev Sharma
// is, which problem he solves for the visitor, and the first step — in
// that order. All names, stats, prices and links come from site.config.ts.
export default function HomePage(): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()
  const faqSchema = buildFaqPageSchema(homeCopy.en.faq.items)
  const events = upcomingEvents().slice(0, 2)

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <HomeAnnouncementStrip />
      <SiteNav />
      <main>
        <HomeHero />
        <HomeProblems />
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
  )
}
