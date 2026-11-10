import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import { COMMON, say } from './common'
import { HUB } from './hubCopy'
import { clarityHref } from './programs'
import { HubPage } from './components/HubPage'
import { ProgramsShell } from './components/ProgramsShell'
import type { ProgramLang } from './types'

// /personal-sessions, shared by the pre-built [lang] copies and the fallback route.
const PATH = '/personal-sessions'

export function hubMetadata(lang: ProgramLang): Metadata {
  return withLanguageAlternates(buildPageMetadata({ path: PATH, title: say(HUB.meta.title, lang), description: say(HUB.meta.description, lang), ownOgImage: true }), PATH)
}

export function HubRoute({ lang }: { lang: ProgramLang }): React.JSX.Element {
  const faqSchema = buildFaqPageSchema(HUB.faq.items.map((f) => ({ question: say(f.q, lang), answer: say(f.a, lang) })))
  const serviceSchema = buildServiceSchema({ name: say(HUB.meta.title, lang), description: say(HUB.meta.description, lang), path: PATH, inLanguage: lang })
  return (
    <ProgramsShell lang={lang} path={PATH} ctaHref={clarityHref(null, lang)} ctaLabel={say(COMMON.bookButton, lang)} schemas={[faqSchema, serviceSchema]}>
      <HubPage lang={lang} />
    </ProgramsShell>
  )
}
