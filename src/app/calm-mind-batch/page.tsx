import type { Metadata } from 'next'
import { CalmRoute, calmLangOf, calmMetadata, type CalmSearchProps } from '@/features/calm-batch/route'

// 21-Day Calm Mind — live online batch (owner's brief, Nov 2026). Normally
// served by middleware from the pre-built copies in ./[lang].
export async function generateMetadata(props: CalmSearchProps): Promise<Metadata> {
  return calmMetadata(await calmLangOf(props))
}

export default async function Page(props: CalmSearchProps): Promise<React.JSX.Element> {
  return <CalmRoute lang={await calmLangOf(props)} />
}
