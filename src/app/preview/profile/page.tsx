import type { Metadata } from 'next'
import { User } from 'lucide-react'
import { ModulePlaceholder } from '@/components/shell/ModulePlaceholder'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ProfilePage(): React.JSX.Element {
  return (
    <ModulePlaceholder
      icon={User}
      eyebrow="Account"
      title="Profile"
      description="Your personal and family profile settings will live here — arriving in a future sprint."
    />
  )
}
