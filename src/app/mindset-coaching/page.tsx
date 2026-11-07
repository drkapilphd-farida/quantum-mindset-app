import type { Metadata } from 'next'
import { ProgramRoute, programMetadata, type ProgramRouteProps } from '@/features/programs/programRoute'

// 1-on-1 program page (owner's design brief, Nov 2026) — see src/features/programs.
export function generateMetadata(props: ProgramRouteProps): Promise<Metadata> {
  return programMetadata('mindset-coaching', props)
}

export default function Page(props: ProgramRouteProps): Promise<React.JSX.Element> {
  return ProgramRoute({ slug: 'mindset-coaching', ...props })
}
