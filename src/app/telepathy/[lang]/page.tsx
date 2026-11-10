import type { Metadata } from 'next'
import { ProgramRoute, programLangParams, programMetadata, type ProgramLangRouteProps } from '@/features/programs/programRoute'

// Pre-built English and Hindi copies of /telepathy, served by middleware
// (src/middleware.ts) so the page comes from the CDN, not a server render
// per visit. Visiting /telepathy/en or /hi directly redirects to the real URL.
export const dynamicParams = false
export const generateStaticParams = programLangParams

export function generateMetadata(props: ProgramLangRouteProps): Promise<Metadata> {
  return programMetadata('telepathy', props)
}

export default function Page(props: ProgramLangRouteProps): Promise<React.JSX.Element> {
  return ProgramRoute({ slug: 'telepathy', ...props })
}
