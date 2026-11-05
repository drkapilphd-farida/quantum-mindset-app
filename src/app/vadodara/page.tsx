import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { vadodaraCopy } from '@/features/vadodara/vadodaraCopy'
import { VadodaraPage } from '@/features/vadodara/VadodaraPage'

export const metadata: Metadata = buildPageMetadata({ path: '/vadodara', title: vadodaraCopy.meta.title, description: vadodaraCopy.meta.description })

// Rebuilt every hour, so the batch block switches to the "next date soon"
// line soon after the batch's last day.
export const revalidate = 3600

export default function VadodaraRoute(): React.JSX.Element {
  return <VadodaraPage />
}
