import type { Metadata } from 'next'
import { langOf, programLangParams, type ProgramLangRouteProps } from '@/features/programs/programRoute'
import { CalmRoute, calmMetadata } from '@/features/calm-batch/route'

// Pre-built English and Hindi copies of /calm-mind-batch (served by
// middleware), refreshed every minute so seats left and the batch dates stay
// current.
export const dynamicParams = false
export const revalidate = 60
export const generateStaticParams = programLangParams

export async function generateMetadata(props: ProgramLangRouteProps): Promise<Metadata> {
  return calmMetadata(await langOf(props))
}

export default async function Page(props: ProgramLangRouteProps): Promise<React.JSX.Element> {
  return <CalmRoute lang={await langOf(props)} />
}
