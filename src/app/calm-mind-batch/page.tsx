import type { Metadata } from 'next'
import { langOf, type ProgramRouteProps } from '@/features/programs/programRoute'
import { CalmRoute, calmMetadata } from '@/features/calm-batch/route'

// 21-Day Calm Mind — live online batch (owner's brief, Nov 2026). Normally
// served by middleware from the pre-built copies in ./[lang].
export async function generateMetadata(props: ProgramRouteProps): Promise<Metadata> {
  return calmMetadata(await langOf(props))
}

export default async function Page(props: ProgramRouteProps): Promise<React.JSX.Element> {
  return <CalmRoute lang={await langOf(props)} />
}
