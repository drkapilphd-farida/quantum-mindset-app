import type { Metadata } from 'next'
import { langOf, type ProgramRouteProps } from '@/features/programs/programRoute'
import { HubRoute, hubMetadata } from '@/features/programs/hubRoute'

// Personal Sessions hub. Normally served by middleware from the pre-built
// copies in ./[lang]; this route is the fallback. ?program= and ?plan= are
// read in the browser (HubBookingProvider).
export async function generateMetadata(props: ProgramRouteProps): Promise<Metadata> {
  return hubMetadata(await langOf(props))
}

export default async function PersonalSessionsPage(props: ProgramRouteProps): Promise<React.JSX.Element> {
  return <HubRoute lang={await langOf(props)} />
}
