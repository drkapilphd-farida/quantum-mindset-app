import type { Metadata } from 'next'
import { langOf, type ProgramRouteProps } from '@/features/programs/programRoute'
import { clarityMetadata } from '@/features/clarity-session/routes'
import { ClaritySessionPage } from '@/features/clarity-session/components/ClarityPages'

// /clarity-session — pay ₹1,100 and choose a time (owner's conversion brief).
// Normally served by middleware from the pre-built copies in ./[lang].
export async function generateMetadata(props: ProgramRouteProps): Promise<Metadata> {
  return clarityMetadata(await langOf(props))
}

export default async function Page(props: ProgramRouteProps): Promise<React.JSX.Element> {
  return <ClaritySessionPage lang={await langOf(props)} />
}
