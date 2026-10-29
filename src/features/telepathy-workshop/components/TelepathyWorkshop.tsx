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
import { GuruSection, MuseSection, ProblemSection, RelationshipsSection, SkillsSection, TradersSection } from './StorySections'
import { AboutSection, ReviewsSection, WhoForSection } from './ProofSections'
import { DatesSection, Disclaimer, FaqSection, FinalCtaSection } from './BookingSections'
import { GallerySection } from './GallerySection'
import { StickyWhatsApp } from './StickyWhatsApp'
import { trackTelepathyLead } from './WhatsAppLink'

// /telepathy-workshop — uses the site's one EN/हिंदी language setting
// (LanguageContext + the header toggle). A ?lang=hi / ?lang=en ad link
// switches it on arrival (through the same setLang the toggle uses, so it
// is remembered like a toggle tap); until then the page renders in the
// URL's language so the first paint already matches the ad.
export function TelepathyWorkshop({ urlLang }: { urlLang: Lang | null }): React.JSX.Element {
  const { lang: siteLang, setLang } = useLanguage()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (urlLang !== null) setLang(urlLang)
    setSynced(true)
  }, [urlLang, setLang])

  const lang: Lang = !synced && urlLang !== null ? urlLang : siteLang

  return (
    <div className="tw-cosmic min-h-screen font-sans antialiased" data-lang={lang} lang={lang}>
      <SiteNav
        cta={{
          label: pick(telepathyCopy.stickyBar, lang),
          href: telepathyWhatsAppHref('general'),
          external: true,
          onClick: () => trackTelepathyLead('general', 'nav'),
        }}
      />
      <main>
        <HeroSection lang={lang} />
        <ProblemSection lang={lang} />
        <GuruSection lang={lang} />
        <SkillsSection lang={lang} />
        <RelationshipsSection lang={lang} />
        <TradersSection lang={lang} />
        <MuseSection lang={lang} />
        <GallerySection lang={lang} />
        <AboutSection lang={lang} />
        <ReviewsSection lang={lang} />
        <WhoForSection lang={lang} />
        <DatesSection lang={lang} />
        <FaqSection lang={lang} />
        <FinalCtaSection lang={lang} />
      </main>
      <Disclaimer lang={lang} />
      <Footer />
      <StickyWhatsApp lang={lang} />
    </div>
  )
}
