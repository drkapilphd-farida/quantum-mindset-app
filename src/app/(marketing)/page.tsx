import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { homeV2 } from '@/lib/homeV2Copy'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import HomePageContent from '@/components/home/HomePageContent'

// Phase 4.2: title from copy/meta.md, description from the Phase 4.2
// prompt (all cities + online, no hotel). Keywords unchanged.
// Phase 4.3: `/` is the English homepage (English by default); Hindi is /hi.
const homeTitle = homeV2.meta.title.en
const homeDescription = homeV2.meta.description.en

export const metadata: Metadata = {
  ...withLanguageAlternates(buildPageMetadata({
    path: '/',
    title: homeTitle,
    description: homeDescription,
  }), '/', '/hi'),
  keywords: [
    'speed reading for students',
    'exam preparation reading speed',
    'competitive exam study techniques',
    'reading and memory test India',
    'memory test India',
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

// Phase 4.3: `/` is the English homepage (always English, whatever language
// is stored); /hi is the same page in Hindi (/en redirects here). The page
// itself lives in HomePageContent.
export default function HomePage(): React.JSX.Element {
  return <HomePageContent lang="en" />
}
