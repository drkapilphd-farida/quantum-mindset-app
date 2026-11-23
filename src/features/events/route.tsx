import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { EventLandingPage } from './EventLandingPage'
import type { EventCopy, EventLang } from './types'

export type EventRouteProps = { searchParams: Promise<{ lang?: string | string[] }> }

export async function eventLang(props: EventRouteProps): Promise<EventLang> {
  return langFromParam((await props.searchParams).lang) ?? 'en'
}

export async function eventMetadata(copy: EventCopy, path: string, props: EventRouteProps): Promise<Metadata> {
  const lang = await eventLang(props)
  return withLanguageAlternates(buildPageMetadata({ path, title: copy.meta.title[lang], description: copy.meta.description[lang] }), path)
}

export async function EventRoute({ copy, path, ...props }: EventRouteProps & { copy: EventCopy; path: string }): Promise<React.JSX.Element> {
  return <EventLandingPage copy={copy} lang={await eventLang(props)} path={path} />
}
