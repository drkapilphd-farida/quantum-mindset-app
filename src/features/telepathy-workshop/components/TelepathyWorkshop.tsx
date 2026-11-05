'use client'

import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import { TELEPATHY_BOOKING_URL } from '@/config/telepathyWorkshopConfig'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { HeroSection } from './HeroSection'
import { FreeSessionSection, OnlineStrip, OriginLine, TradersSection, TrustStrip, WhoForSection } from './TopSections'
import { LearnSection, MuseSection, ScheduleSection, ShortStripSection } from './LearnSections'
import { AboutSection, ReviewsSection } from './ProofSections'
import { GallerySection } from './GallerySection'
import { BatchesSection, Disclaimer, FaqSection, FinalCtaSection, IncludedSection } from './BookingSections'
import { StickyBooking } from './StickyBooking'
import { trackTelepathyBookSeat } from './WhatsAppLink'

// /telepathy-workshop — the site's light workshop-page look (.warm-light),
// dark and starry only in the hero and the Muse 2 section. Positioning
// rework: a Hindi page (the language toggle is gone) — always Hindi,
// except the pre-built English copy that ?lang=en ad links open
// (see middleware.ts). The stored language choice is neither read nor
// changed here.
export function TelepathyWorkshop({ urlLang, renderedAt }: { urlLang: Lang | null; renderedAt: number }): React.JSX.Element {
  const lang: Lang = urlLang ?? 'hi'

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{
            label: pick(telepathyCopy.bookButton, lang),
            href: TELEPATHY_BOOKING_URL,
            onClick: () => trackTelepathyBookSeat('general', 'nav'),
          }}
        />
        <main>
          {/* A–C */}
          <HeroSection lang={lang} />
          <OnlineStrip lang={lang} />
          <TradersSection lang={lang} />
          <OriginLine lang={lang} />
          <TrustStrip lang={lang} />
          <FreeSessionSection lang={lang} />
          {/* D–G */}
          <WhoForSection lang={lang} />
          <LearnSection lang={lang} />
          <MuseSection lang={lang} />
          <ShortStripSection lang={lang} />
          <ScheduleSection lang={lang} />
          {/* H–J */}
          <ReviewsSection lang={lang} />
          <GallerySection lang={lang} />
          <AboutSection lang={lang} />
          {/* K–N */}
          <BatchesSection lang={lang} renderedAt={renderedAt} />
          <IncludedSection lang={lang} />
          <FaqSection lang={lang} />
          <FinalCtaSection lang={lang} />
        </main>
        <Disclaimer lang={lang} />
        <Footer />
        <StickyBooking lang={lang} />
      </div>
    </LanguageOverride>
  )
}
