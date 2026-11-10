import { OG_IMAGE_SIZE } from '@/lib/seo/ogImage'
import { programOgImage } from '@/features/programs/programRoute'

export const alt = 'Mind Ur Mind — 1-on-1 with Dr. Kapil Dev Sharma'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default function Image(): ReturnType<typeof programOgImage> {
  return programOgImage('business-loss-mindset')
}
