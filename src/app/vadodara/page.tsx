import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { vadodaraCopy } from '@/features/vadodara/vadodaraCopy'
import { VadodaraPage } from '@/features/vadodara/VadodaraPage'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'

type Props = { searchParams: Promise<{ lang?: string | string[] }> }

// Phase 4.3: English by default, Hindi at ?lang=hi (?lang=en also English).
// The language comes from the URL only.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return withLanguageAlternates(buildPageMetadata({ path: '/vadodara', title: vadodaraCopy.meta.title[lang], description: vadodaraCopy.meta.description[lang] }), '/vadodara')
}

export default async function VadodaraRoute({ searchParams }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return <VadodaraPage lang={lang} />
}
