import type { Metadata } from 'next'
import { CertificateExperience } from '@/features/certificate/components/CertificateExperience'
import { getCertificateState } from '@/features/certificate/actions'
import { CERT_FONT_CLASSES } from '@/features/certificate/fonts'
import { certLabels } from '@/features/certificate/labels'
import { getAppT } from '@/lib/app-i18n/server'
import { CATALOG, ENGLISH } from '@/lib/app-i18n/catalog'
import { createTranslator } from '@/lib/app-i18n/translate'
import { SITE_URL } from '@/lib/seo/siteUrl'

export const metadata: Metadata = {
  title: 'Your certificate — Sharp Brain',
  robots: { index: false, follow: false },
}

// Sharp Brain 30-day certificate (Phase 3, item 2). Unlocked by Day 30 alone
// (a lapsed subscription never takes a certificate away). The certificate's
// words are resolved here in the learner's language and in English, so the
// learner can download either.
export default async function CertificatePage(): Promise<React.JSX.Element> {
  const [state, { lang }] = await Promise.all([getCertificateState(), getAppT()])
  const labels = {
    own: certLabels(createTranslator(CATALOG[lang], ENGLISH)),
    en: certLabels(createTranslator(ENGLISH, ENGLISH)),
  }
  return (
    <div className={CERT_FONT_CLASSES}>
      <CertificateExperience initialState={state} lang={lang} labels={labels} siteUrl={SITE_URL} />
    </div>
  )
}
