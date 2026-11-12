import type { Metadata } from 'next'
import { CalmRoute, calmLangOf, calmLangParams, calmMetadata, type CalmLangProps } from '@/features/calm-batch/route'

// Pre-built English and Hindi copies of /calm-mind-batch (served by
// middleware), refreshed every minute so seats left and the batch dates stay
// current.
export const dynamicParams = false
export const revalidate = 60
export const generateStaticParams = calmLangParams

export async function generateMetadata(props: CalmLangProps): Promise<Metadata> {
  return calmMetadata(await calmLangOf(props))
}

export default async function Page(props: CalmLangProps): Promise<React.JSX.Element> {
  return <CalmRoute lang={await calmLangOf(props)} />
}
