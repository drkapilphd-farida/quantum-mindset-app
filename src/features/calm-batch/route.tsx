import type { Metadata } from 'next'
import { calmMindBatch } from '@/config/site.config'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { hasPaymentLinksApi } from '@/lib/razorpay/paymentLinksApi'
import { batchState, type Lang } from './batch'
import { CALM_COPY } from './copy'
import { countPaidRegistrations } from './registrations'
import { CalmBatchPage } from './components/CalmBatchPage'

// /calm-mind-batch, shared by the pre-built [lang] copies and the fallback route.
const PATH = '/calm-mind-batch'

export function calmMetadata(lang: Lang): Metadata {
  return withLanguageAlternates(buildPageMetadata({ path: PATH, title: CALM_COPY.meta.title[lang], description: CALM_COPY.meta.description[lang] }), PATH)
}

export async function CalmRoute({ lang }: { lang: Lang }): Promise<React.JSX.Element> {
  // Real seats: verified paid registrations for this batch (null = database not reachable → no seat line).
  const paid = await countPaidRegistrations(calmMindBatch.nextBatch.startDate)
  const state = batchState(Date.now(), paid)
  const f = CALM_COPY.faq
  const faqSchema = buildFaqPageSchema([f.missed, f.camera, f.language, f.medication, f.time, f.links].map((item) => ({ question: item.q[lang], answer: item.a[lang] })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <CalmBatchPage lang={lang} state={state} checkout={hasPaymentLinksApi()} />
    </>
  )
}
