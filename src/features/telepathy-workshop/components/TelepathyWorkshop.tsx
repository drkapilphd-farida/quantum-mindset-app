'use client'

import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { LanguageOverride } from '@/context/LanguageContext'
import type { Lang } from '@/lib/i18n'
import { v2 } from '../telepathyV2Copy'
import { pick } from '../telepathyWorkshop'
import { HeroSection } from './HeroSection'
import { TradersSection } from './TopSections'
import { MuseSection, ScheduleSection } from './LearnSections'
import { Disclaimer, FaqSection, IncludedSection } from './BookingSections'
import { DateCards } from './DateCards'
import { CompareSection, DrKapilSection, LearnFourSection, ProofSection, WhySection } from './V2Sections'
import { StickyBooking } from './StickyBooking'
import { Highlights } from './Highlights'
import { WORKSHOP_HIGHLIGHTS } from '../highlights'

// /telepathy-workshop — the site's light workshop-page look (.warm-light),
// dark and starry only in the hero and the Muse 2 section. Positioning
// rework, Phase 4.3: English by default; Hindi at ?lang=hi (?lang=en still
// works for old ad links) — both pre-built copies served by middleware.ts.
// The stored language choice is neither read nor changed here.
//
// Phase 4.3 order: hero → date cards (#dates) → what brings you here (6,
// trading first) → traders (#traders) → the 4 things you learn → proof (3
// videos) → workshop highlights (photos) → EEG → Your 2 days + What's
// included → offline or online → Dr. Kapil → FAQ → date cards again. No
// venue anywhere.
export function TelepathyWorkshop({ urlLang, renderedAt, heroVideo }: { urlLang: Lang | null; renderedAt: number; heroVideo: boolean }): React.JSX.Element {
  const lang: Lang = urlLang ?? 'en'

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{ label: pick(v2.hero.ctaPrimary, lang), href: '#dates' }}
          languageLink={lang === 'hi' ? { label: 'English', href: '/telepathy-workshop' } : { label: 'हिंदी', href: '/telepathy-workshop?lang=hi' }}
        />
        <main>
          <HeroSection lang={lang} heroVideo={heroVideo} />
          <DateCards lang={lang} renderedAt={renderedAt} id="dates" />
          <WhySection lang={lang} />
          <TradersSection lang={lang} />
          <LearnFourSection lang={lang} />
          <ProofSection lang={lang} tint={false} />
          <Highlights lang={lang} photos={WORKSHOP_HIGHLIGHTS} tint />
          <MuseSection lang={lang} />
          <ScheduleSection lang={lang} />
          <IncludedSection lang={lang} />
          <CompareSection lang={lang} />
          <DrKapilSection lang={lang} />
          <FaqSection lang={lang} />
          <DateCards lang={lang} renderedAt={renderedAt} id="dates-again" heading={pick(v2.dates.finalHeading, lang)} compact />
        </main>
        <Disclaimer lang={lang} />
        <Footer />
        <StickyBooking lang={lang} />
      </div>
    </LanguageOverride>
  )
}
