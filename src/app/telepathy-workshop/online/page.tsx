import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { onlineCopy } from '@/features/telepathy-workshop/online/onlineCopy'
import { TelepathyOnlinePage } from '@/features/telepathy-workshop/online/TelepathyOnlinePage'

export const metadata: Metadata = buildPageMetadata({ path: '/telepathy-workshop/online', title: onlineCopy.meta.title, description: onlineCopy.meta.description })

// Rebuilt every hour, so the batch block switches to the "next date soon"
// line soon after the last evening.
export const revalidate = 3600

export default function TelepathyOnlineRoute(): React.JSX.Element {
  return <TelepathyOnlinePage />
}
