import type { Metadata } from 'next'
import { langOf, programLangParams, type ProgramLangRouteProps } from '@/features/programs/programRoute'
import { bookedMetadata } from '@/features/clarity-session/routes'
import { ClarityBookedPage } from '@/features/clarity-session/components/ClarityPages'

// Pre-built English and Hindi copies of /clarity-session/booked (served by middleware).
export const dynamicParams = false
export const generateStaticParams = programLangParams

export async function generateMetadata(props: ProgramLangRouteProps): Promise<Metadata> {
  return bookedMetadata(await langOf(props))
}

export default async function Page(props: ProgramLangRouteProps): Promise<React.JSX.Element> {
  return <ClarityBookedPage lang={await langOf(props)} />
}
