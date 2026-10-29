import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { langFromParam } from '@/features/telepathy-workshop/telepathyWorkshop'
import { buildTelepathyMetadata, TelepathyWorkshopPage } from '@/features/telepathy-workshop/telepathyWorkshopPage'

type Props = { params: Promise<{ lang: string }> }

// Pre-built English and Hindi copies of /telepathy-workshop, served by
// middleware for ?lang=en / ?lang=hi ad links (the visitor's address bar
// keeps /telepathy-workshop?lang=…). Visiting /telepathy-workshop/hi
// directly redirects to the ?lang link, so these never appear as pages
// of their own.
export const dynamicParams = false

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: 'en' }, { lang: 'hi' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildTelepathyMetadata(langFromParam((await params).lang) ?? 'en')
}

export default async function TelepathyWorkshopLangRoute({ params }: Props): Promise<React.JSX.Element> {
  const lang = langFromParam((await params).lang)
  if (lang === null) notFound()
  return <TelepathyWorkshopPage urlLang={lang} />
}
