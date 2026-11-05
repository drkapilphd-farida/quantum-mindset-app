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

// /telepathy-workshop — the site's light workshop-page look (.warm-light),
// dark and starry only in the hero and the Muse 2 section. Positioning
// rework: a Hindi page (the language toggle is gone) — always Hindi,
// except the pre-built English copy that ?lang=en ad links open
// (see middleware.ts). The stored language choice is neither read nor
// changed here.
//
// Phase 4.2 order (copy/telepathy-v2.md): hero → date cards (#dates) → what
// brings you here (6) → the 4 things you learn → proof (3 videos) → Muse 2
// → traders (#traders) → Your 2 days + What's included → offline or online
// → Dr. Kapil → FAQ → date cards again. No venue anywhere.
export function TelepathyWorkshop({ urlLang, renderedAt, heroVideo }: { urlLang: Lang | null; renderedAt: number; heroVideo: boolean }): React.JSX.Element {
  const lang: Lang = urlLang ?? 'hi'

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
        <SiteNav
          cta={{ label: pick(v2.hero.ctaPrimary, lang), href: '#dates' }}
          languageLink={lang === 'hi' ? { label: 'English', href: '/telepathy-workshop?lang=en' } : { label: 'हिंदी', href: '/telepathy-workshop?lang=hi' }}
        />
        <main>
          <HeroSection lang={lang} heroVideo={heroVideo} />
          <DateCards lang={lang} renderedAt={renderedAt} id="dates" />
          <WhySection lang={lang} />
          <LearnFourSection lang={lang} />
          <ProofSection lang={lang} />
          <MuseSection lang={lang} />
          <TradersSection lang={lang} />
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
