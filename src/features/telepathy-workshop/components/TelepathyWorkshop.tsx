'use client'

import { useEffect, useState } from 'react'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { telepathyWhatsAppHref } from '@/config/telepathyWorkshopConfig'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { pick } from '../telepathyWorkshop'
import { HeroSection } from './HeroSection'
import { FreeSessionSection, TrustStrip, WhoForSection } from './TopSections'
import { LearnSection, MuseSection, ScheduleSection, ShortStripSection } from './LearnSections'
import { AboutSection, ReviewsSection } from './ProofSections'
import { GallerySection } from './GallerySection'
import { BatchesSection, Disclaimer, FaqSection, FinalCtaSection, IncludedSection } from './BookingSections'
import { StickyWhatsApp } from './StickyWhatsApp'
import { trackTelepathyLead } from './WhatsAppLink'

// /telepathy-workshop — the site's light workshop-page look (.warm-light),
// dark and starry only in the hero and the Muse 2 section. Uses the site's
// one EN/हिंदी language setting (LanguageContext + the header toggle). A
// ?lang=hi / ?lang=en ad link switches it on arrival (through the same
// setLang the toggle uses, so it is remembered like a toggle tap); until
// then the page renders in the URL's language so the first paint matches the ad.
export function TelepathyWorkshop({ urlLang, renderedAt }: { urlLang: Lang | null; renderedAt: number }): React.JSX.Element {
  const { lang: siteLang, setLang } = useLanguage()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (urlLang !== null) setLang(urlLang)
    setSynced(true)
  }, [urlLang, setLang])

  const lang: Lang = !synced && urlLang !== null ? urlLang : siteLang

  return (
    <div className="warm-light tw-page min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
      <SiteNav
        cta={{
          label: pick(telepathyCopy.bookButton, lang),
          href: telepathyWhatsAppHref('general'),
          external: true,
          onClick: () => trackTelepathyLead('general', 'nav'),
        }}
      />
      <main>
        {/* A–C */}
        <HeroSection lang={lang} />
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
      <StickyWhatsApp lang={lang} />
    </div>
  )
}
