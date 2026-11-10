import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import { buildOgImageResponse } from '@/lib/seo/ogImage'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { COMMON, SHARED_PROGRAM_FAQS, say } from './common'
import { clarityHref, getProgram } from './programs'
import { ProgramPage } from './components/ProgramPage'
import { ProgramsShell } from './components/ProgramsShell'
import { notFound } from 'next/navigation'
import type { ProgramLang, ProgramSlug } from './types'

// Shared by the 15 program routes (src/app/<slug>/page.tsx). English by
// default, Hindi at ?lang=hi, each language with its own title,
// description, FAQ schema and Service schema.

export type ProgramRouteProps = { searchParams: Promise<{ lang?: string | string[] }> }
export type ProgramLangRouteProps = { params: Promise<{ lang: string }> }

/** The pre-built English and Hindi copies ([lang] routes), served by middleware for /<slug> and /<slug>?lang=hi. */
export function programLangParams(): { lang: string }[] {
  return [{ lang: 'en' }, { lang: 'hi' }]
}

export async function langOf(props: ProgramRouteProps | ProgramLangRouteProps): Promise<ProgramLang> {
  if ('params' in props) {
    const lang = langFromParam((await props.params).lang)
    if (lang === null) notFound()
    return lang
  }
  return langFromParam((await props.searchParams).lang) ?? 'en'
}

export async function programMetadata(slug: ProgramSlug, props: ProgramRouteProps | ProgramLangRouteProps): Promise<Metadata> {
  const lang = await langOf(props)
  const p = getProgram(slug)
  return withLanguageAlternates(buildPageMetadata({ path: `/${slug}`, title: say(p.seoTitle, lang), description: say(p.seoDescription, lang), ownOgImage: true }), `/${slug}`)
}

export async function ProgramRoute({ slug, ...props }: { slug: ProgramSlug } & (ProgramRouteProps | ProgramLangRouteProps)): Promise<React.JSX.Element> {
  const lang = await langOf(props as ProgramRouteProps | ProgramLangRouteProps)
  const p = getProgram(slug)
  const faqs = [...p.faqs.filter((f) => f.hidden !== true), ...SHARED_PROGRAM_FAQS]
  const faqSchema = buildFaqPageSchema(faqs.map((f) => ({ question: say(f.q, lang), answer: say(f.a, lang) })))
  const serviceSchema = buildServiceSchema({ name: say(p.seoTitle, lang).replace(/ \| (Mind Ur Mind|मन उर मन)$/, ''), description: say(p.seoDescription, lang), path: `/${slug}`, inLanguage: lang })
  return (
    <ProgramsShell lang={lang} path={`/${slug}`} ctaHref={clarityHref(slug, lang)} ctaLabel={say(COMMON.bookButton, lang)} schemas={[faqSchema, serviceSchema]}>
      <ProgramPage program={p} lang={lang} />
    </ProgramsShell>
  )
}

/** Placeholder share image (text only) until designed images arrive. */
export function programOgImage(slug: ProgramSlug): ReturnType<typeof buildOgImageResponse> {
  return buildOgImageResponse({ eyebrow: 'Mind Ur Mind · 1-on-1 with Dr. Kapil', heading: getProgram(slug).seoTitle.en.replace(/ \| Mind Ur Mind$/, '') })
}
