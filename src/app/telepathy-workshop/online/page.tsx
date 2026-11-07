import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { onlineCopy } from '@/features/telepathy-workshop/online/onlineCopy'
import { TelepathyOnlinePage } from '@/features/telepathy-workshop/online/TelepathyOnlinePage'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'

type Props = { searchParams: Promise<{ lang?: string | string[] }> }

// Phase 4.3: English by default, Hindi at ?lang=hi (?lang=en also English).
// The language comes from the URL only.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return withLanguageAlternates(
    buildPageMetadata({ path: '/telepathy-workshop/online', title: onlineCopy.meta.title[lang], description: onlineCopy.meta.description[lang] }),
    '/telepathy-workshop/online',
  )
}

export default async function TelepathyOnlineRoute({ searchParams }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return <TelepathyOnlinePage lang={lang} />
}
