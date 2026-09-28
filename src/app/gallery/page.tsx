import type { Metadata } from 'next'
import GalleryPageContent from '@/components/GalleryPageContent'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/gallery',
  title: 'Gallery — Mind Ur Mind',
  description: 'Real moments from Mind Ur Mind workshops, retreats, and Sharp Brain sessions.',
})

export default function GalleryPage(): React.JSX.Element {
  return <GalleryPageContent />
}
