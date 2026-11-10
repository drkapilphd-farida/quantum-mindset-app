import type { Metadata } from 'next'
import { langOf, programLangParams, type ProgramLangRouteProps } from '@/features/programs/programRoute'
import { clarityMetadata } from '@/features/clarity-session/routes'
import { ClaritySessionPage } from '@/features/clarity-session/components/ClarityPages'

// Pre-built English and Hindi copies of /clarity-session (served by middleware).
export const dynamicParams = false
export const generateStaticParams = programLangParams

export async function generateMetadata(props: ProgramLangRouteProps): Promise<Metadata> {
  return clarityMetadata(await langOf(props))
}

export default async function Page(props: ProgramLangRouteProps): Promise<React.JSX.Element> {
  return <ClaritySessionPage lang={await langOf(props)} />
}
