import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { LanguageOverride } from '@/context/LanguageContext'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { SCHOOLS_COPY, SCHOOLS_PATH, schoolsHref } from '@/features/schools/copy'
import { getSchoolSettings } from '@/features/schools/settingsServer'
import { faqFor } from '@/features/schools/settings'
import { buildSchoolsSchema } from '@/features/schools/schema'
import {
  SchoolAbout,
  SchoolBook,
  SchoolChallenge,
  SchoolFaq,
  SchoolHero,
  SchoolHowItWorks,
  SchoolPackages,
  SchoolResults,
  SchoolSafety,
  SchoolSamplePassport,
  SchoolWhatEveryoneGets,
  whatsappHref,
} from '@/features/schools/components/SchoolSections'

export const metadata: Metadata = withLanguageAlternates(
  buildPageMetadata({
    path: SCHOOLS_PATH,
    title: SCHOOLS_COPY.en.meta.title,
    description: SCHOOLS_COPY.en.meta.description,
    ownOgImage: true,
  }),
  SCHOOLS_PATH,
)

type Props = { searchParams: Promise<{ lang?: string | string[] }> }

// "Sharp Brain for Schools" — the EEG Brain & Focus Assessment page for
// principals (founder brief, 15 Nov 2026). English by default, Hindi at
// ?lang=hi. Photos, sample reports, prices, results and FAQ edits come from
// /admin/school-page (school_page_settings); empty sections stay hidden.
export default async function SchoolsPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  const c = SCHOOLS_COPY[lang]
  const settings = await getSchoolSettings()
  const faq = faqFor(settings, lang).map((x) => ({ question: x.q, answer: x.a }))
  const languageLink = { label: c.nav.language, href: lang === 'hi' ? SCHOOLS_PATH : schoolsHref('hi') }

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildSchoolsSchema() }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildFaqPageSchema(faq) }} />
        <SiteNav languageLink={languageLink} cta={{ label: c.nav.cta, href: '#book', external: false }} />
        <main className="play overflow-x-clip" data-lang={lang} data-schools-page={lang}>
          <SchoolHero lang={lang} settings={settings} />
          <SchoolChallenge lang={lang} />
          <SchoolHowItWorks lang={lang} />
          <SchoolWhatEveryoneGets lang={lang} />
          <SchoolSamplePassport lang={lang} settings={settings} />
          <SchoolPackages lang={lang} settings={settings} />
          <SchoolResults lang={lang} settings={settings} />
          <SchoolAbout lang={lang} />
          <SchoolSafety lang={lang} />
          <SchoolFaq lang={lang} settings={settings} />
          <SchoolBook lang={lang} />
        </main>
        <Footer />
        <WhatsAppWidget href={whatsappHref(c.hero.whatsappText)} analyticsLocation="schools_widget" />
      </div>
    </LanguageOverride>
  )
}
