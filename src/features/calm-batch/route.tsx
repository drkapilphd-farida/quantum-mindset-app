import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
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
// Language helpers are local (not from programRoute) so this page doesn't pull
// in — and preload — the program pages' Mukta font, which it doesn't use.
const PATH = '/calm-mind-batch'

export type CalmSearchProps = { searchParams: Promise<{ lang?: string | string[] }> }
export type CalmLangProps = { params: Promise<{ lang: string }> }

export function calmLangParams(): { lang: string }[] {
  return [{ lang: 'en' }, { lang: 'hi' }]
}

export async function calmLangOf(props: CalmSearchProps | CalmLangProps): Promise<Lang> {
  if ('params' in props) {
    const lang = langFromParam((await props.params).lang)
    if (lang === null) notFound()
    return lang
  }
  return langFromParam((await props.searchParams).lang) ?? 'en'
}

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
