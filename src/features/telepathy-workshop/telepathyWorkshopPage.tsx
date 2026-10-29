import type { Metadata } from 'next'
import { preload } from 'react-dom'
import type { Lang } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { TELEPATHY_OG_IMAGE } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from './telepathyWorkshopCopy'
import { pick } from './telepathyWorkshop'
import { TelepathyWorkshop } from './components/TelepathyWorkshop'

// Shared by the two static routes: /telepathy-workshop (no ?lang) and the
// pre-built /telepathy-workshop/[lang] copies that middleware serves for
// ?lang=hi / ?lang=en (the address bar keeps the ?lang link). Canonical
// is always /telepathy-workshop.

export function buildTelepathyMetadata(lang: Lang): Metadata {
  const title = pick(telepathyCopy.meta.title, lang)
  const description = pick(telepathyCopy.meta.description, lang)
  const base = buildPageMetadata({ path: '/telepathy-workshop', ownOgImage: true, title, description })
  const images = [{ ...TELEPATHY_OG_IMAGE, alt: pick(telepathyCopy.hero.imageAlt, lang) }]
  return {
    ...base,
    openGraph: { ...base.openGraph, locale: lang === 'hi' ? 'hi_IN' : 'en_IN', images },
    twitter: { ...base.twitter, images },
  }
}

/** Hindi headline font files (telepathy-workshop.css) — preloaded on the ?lang=hi copy only (Latin: the price digits). */
const HINDI_HEADLINE_FONTS = [
  '/fonts/telepathy-workshop/noto-serif-devanagari-600-devanagari.woff2',
  '/fonts/telepathy-workshop/noto-serif-devanagari-600-latin.woff2',
]

export function TelepathyWorkshopPage({ urlLang }: { urlLang: Lang | null }): React.JSX.Element {
  if (urlLang === 'hi') HINDI_HEADLINE_FONTS.forEach((href) => preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }))
  const faqLang = urlLang ?? 'en'
  const faqSchema = buildFaqPageSchema(telepathyCopy.faq.items.map((item) => ({ question: pick(item.q, faqLang), answer: pick(item.a, faqLang) })))
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <TelepathyWorkshop urlLang={urlLang} />
    </>
  )
}
