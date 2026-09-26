import type { Metadata } from 'next'
import { DynamicDotExperience } from '@/features/visual-intelligence/components/fixation/dynamic-dot/DynamicDotExperience'

export const metadata: Metadata = {
  title: 'Dynamic Dot™ — Visual Fixation Engine™',
  robots: { index: false, follow: false },
}

export default function DynamicDotPage(): React.JSX.Element {
  return <DynamicDotExperience />
}
