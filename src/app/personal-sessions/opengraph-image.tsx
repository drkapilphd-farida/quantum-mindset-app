import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Personal Sessions with Dr. Kapil Dev Sharma — Mind Ur Mind'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({ eyebrow: 'Mind Ur Mind', heading: 'Personal Sessions with Dr. Kapil' })
}
