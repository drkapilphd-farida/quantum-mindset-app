import type { Metadata } from 'next'
import { langOf, programLangParams, type ProgramLangRouteProps } from '@/features/programs/programRoute'
import { HubRoute, hubMetadata } from '@/features/programs/hubRoute'

// Pre-built English and Hindi copies of /personal-sessions, served by
// middleware (src/middleware.ts). Direct visits redirect to the real URL.
export const dynamicParams = false
export const generateStaticParams = programLangParams

export async function generateMetadata(props: ProgramLangRouteProps): Promise<Metadata> {
  return hubMetadata(await langOf(props))
}

export default async function Page(props: ProgramLangRouteProps): Promise<React.JSX.Element> {
  return <HubRoute lang={await langOf(props)} />
}
