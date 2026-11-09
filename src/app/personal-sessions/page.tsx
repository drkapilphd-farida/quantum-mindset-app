import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { buildServiceSchema } from '@/lib/seo/serviceSchema'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { COMMON, say } from '@/features/programs/common'
import { HUB } from '@/features/programs/hubCopy'
import { isProgramSlug } from '@/features/programs/programs'
import { isPlanId } from '@/features/programs/plans'
import { HubPage } from '@/features/programs/components/HubPage'
import { ProgramsShell } from '@/features/programs/components/ProgramsShell'

type Props = { searchParams: Promise<{ lang?: string | string[]; program?: string | string[]; plan?: string | string[] }> }

const PATH = '/personal-sessions'

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return withLanguageAlternates(buildPageMetadata({ path: PATH, title: say(HUB.meta.title, lang), description: say(HUB.meta.description, lang), ownOgImage: true }), PATH)
}

// Personal Sessions hub (owner's strict design brief, Nov 2026). English by
// default, Hindi at ?lang=hi; ?program=<slug> and ?plan=<id> pre-select the booking form.
export default async function PersonalSessionsPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const params = await searchParams
  const lang = langFromParam(params.lang) ?? 'en'
  const programParam = Array.isArray(params.program) ? params.program[0] : params.program
  const initialProgram = isProgramSlug(programParam) ? programParam : null
  const planParam = Array.isArray(params.plan) ? params.plan[0] : params.plan
  const initialPlan = isPlanId(planParam) ? planParam : null
  const faqSchema = buildFaqPageSchema(HUB.faq.items.map((f) => ({ question: say(f.q, lang), answer: say(f.a, lang) })))
  const serviceSchema = buildServiceSchema({ name: say(HUB.meta.title, lang), description: say(HUB.meta.description, lang), path: PATH, inLanguage: lang })
  return (
    <ProgramsShell lang={lang} path={PATH} ctaHref="#book" ctaLabel={say(COMMON.bookButton, lang)} schemas={[faqSchema, serviceSchema]}>
      <HubPage lang={lang} initialProgram={initialProgram} initialPlan={initialPlan} />
    </ProgramsShell>
  )
}
