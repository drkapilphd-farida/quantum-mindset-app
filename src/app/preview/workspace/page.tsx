import type { Metadata } from 'next'
import { Layers } from 'lucide-react'
import { ModulePlaceholder } from '@/components/shell/ModulePlaceholder'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function WorkspacePage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      icon={Layers}
      eyebrow="AI Learning Studio™"
      title="Workspace"
      description="Your documents, projects, and active learning sessions will live here — arriving in a future sprint."
    />
  )
}
