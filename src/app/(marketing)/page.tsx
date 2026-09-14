import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import HomeAnnouncementStrip from '@/components/HomeAnnouncementStrip'
import HeroSection from '@/components/HeroSection'
import ProgramSelector from '@/components/ProgramSelector'
import HomePrefrontalPowerFeature from '@/components/HomePrefrontalPowerFeature'
import HomeHabitBuilderFeature from '@/components/HomeHabitBuilderFeature'
import HomeOverviewVideo from '@/components/HomeOverviewVideo'
import ProgramCardsGrid from '@/components/ProgramCardsGrid'
import HomeMumbaiWorkshopFeature from '@/components/HomeMumbaiWorkshopFeature'
import HomeSpeedTestCta from '@/components/HomeSpeedTestCta'
import HomeWhyMindUrMind from '@/components/HomeWhyMindUrMind'
import Testimonials from '@/components/Testimonials'
import HomeGuideSection from '@/components/HomeGuideSection'
import FAQSection from '@/components/FAQSection'
import HomeFinalCta from '@/components/HomeFinalCta'
import HomeFranchiseTeaser from '@/components/HomeFranchiseTeaser'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import Footer from '@/components/Footer'

// Final, length-tested strings (53-char title, 145-char description) —
// short enough to render in full everywhere (browser tab, Google SERP,
// OG/Twitter link previews), so one pair is now used for all of them
// instead of a full-length tag title + a separately-trimmed OG/Twitter
// variant.
const homeTitle = 'Quantum Speed Reading for Exam Success | Mind Ur Mind'
const homeDescription =
  'Read faster, retain more, and prepare smarter for exams. Trusted speed reading masterclass by Dr. Kapil Dev Sharma — 10,000+ students since 2015.'

export const metadata: Metadata = {
  // { absolute: homeTitle }, not a plain string — the root layout defines
  // title.template ('%s | Quantum Mind'), and a plain string here would
  // get that template applied on top (rendering as "...Sharma | Quantum
  // Mind" in the actual <title> tag, confirmed via a real page load).
  // `absolute` is Next's documented escape hatch to bypass an inherited
  // template for exactly this page.
  title: { absolute: homeTitle },
  description: homeDescription,
  keywords: [
    'speed reading for students',
    'exam preparation reading speed',
    'competitive exam study techniques',
    'reading speed test India',
    'quantum speed reading Vadodara',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: '/',
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
}

// Homepage V2™ — rebuilt around a QSR-first funnel (see the "Fix Homepage
// & QSR Page Positioning" task): Hero → Where Would You Like to Begin
// (#begin — QSR renders as a single dominant flagship block, with Habit
// Builder/Retreats/Mentoring demoted underneath as clearly secondary) →
// a date-bound live-event banner → a brand overview video → the full
// 5-program catalog (#explore-programs, QSR still the dark/dominant card
// there) → a dedicated free Speed Test section → Why Mind Ur Mind
// (ecosystem framing) → Testimonials → Dr. Kapil → FAQ → Final CTA → a
// compact Habit Builder on-ramp banner (deliberately last, after every
// QSR-reinforcing section, framed as a low-commitment fallback rather
// than a competing first impression) → footer. HomeGalleryGlimpse is no
// longer rendered here (not part of this architecture — the file itself
// is untouched, so nothing was deleted, it simply isn't part of the
// homepage flow anymore). HomeFranchiseTeaser stays, small and low-weight
// as it already was, right before the footer — a different audience
// (trainers/edupreneurs) than the primary funnel above, and Navbar's own
// link list no longer carries it per the new nav spec, so this banner
// (plus the Footer's own "Become a Partner" link) is what keeps that path
// discoverable.
export default function HomePage(): React.JSX.Element {
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <HomeAnnouncementStrip />
      <Navbar />
      <main>
        <HeroSection />
        <ProgramSelector />
        {/* PREfrontal POWER (27 Sept 2026, Mumbai) — a date-bound live
            event, not a sixth evergreen digital program, so it sits
            between the pathway cards and the featured Habit Builder
            rather than inside the 01-05 "Explore Our Programs" catalog
            or immediately after/inside Habit Builder itself (which is
            the lead conversion offer and shouldn't get a second,
            unrelated CTA interrupting it). */}
        <HomePrefrontalPowerFeature />
        <HomeOverviewVideo />
        <ProgramCardsGrid />
        {/* Mumbai in-person QSR workshop (see the "Add Mumbai In-Person
            QSR Workshop" task) — below the QSR flagship catalog card
            above it, styled no more prominently than any other secondary
            card on this page, per the same hierarchy rules established
            in the positioning-fix task. */}
        <HomeMumbaiWorkshopFeature />
        <HomeSpeedTestCta />
        <HomeWhyMindUrMind />
        <Testimonials />
        <HomeGuideSection />
        <FAQSection />
        <HomeFinalCta />
        {/* Positioning fix (see the "Fix Homepage & QSR Page Positioning"
            task) — HomeHabitBuilderFeature used to render right after the
            pathway cards, at homepage-hero scale, competing with the QSR
            flagship offer for the first-scroll attention it should own.
            Now shrunk to a compact banner and moved here: below every
            QSR-reinforcing section (catalog, speed test, testimonials,
            final CTA), above the footer, so it reads as a genuine
            low-commitment fallback for a visitor who scrolled this far
            without converting on the Masterclass — never as a competing
            first impression. */}
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
