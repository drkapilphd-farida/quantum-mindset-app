import type { Metadata } from 'next'
import CorporatePageContent from '@/components/corporate/CorporatePageContent'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { corporateCopy } from '@/lib/corporateCopy'

export const metadata: Metadata = buildPageMetadata({
  path: '/corporate',
  ownOgImage: true,
  title: 'For Organisations — Corporate Teams & Schools | Mind Ur Mind',
  description:
    'Brain performance programs for companies, schools and institutions — calm, focus and clear decisions, measured before and after. Led by Dr. Kapil Dev Sharma.',
})

export default function CorporatePage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(corporateCopy.en.faq.items)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <CorporatePageContent />
    </>
  )
}
