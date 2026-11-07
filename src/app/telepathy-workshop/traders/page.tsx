import { existsSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { HERO_VIDEO_PUBLIC_PATH } from '@/config/telepathyWorkshopConfig'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { tradersCopy } from '@/features/telepathy-workshop/traders/tradersCopy'
import { TradersPage } from '@/features/telepathy-workshop/traders/TradersPage'

type Props = { searchParams: Promise<{ lang?: string | string[] }> }

// Phase 6 — the page for the trader ads. English by default, Hindi at ?lang=hi.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return withLanguageAlternates(
    buildPageMetadata({ path: '/telepathy-workshop/traders', title: tradersCopy.meta.title[lang], description: tradersCopy.meta.description[lang] }),
    '/telepathy-workshop/traders',
  )
}

export default async function TelepathyTradersRoute({ searchParams }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await searchParams).lang) ?? 'en'
  return <TradersPage lang={lang} renderedAt={Date.now()} heroVideo={existsSync(path.join(process.cwd(), 'public', HERO_VIDEO_PUBLIC_PATH))} />
}
