import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

// Share image for /schools (text only, same style as the other pages).
export const alt = 'Sharp Brain for Schools: EEG Brain & Focus Assessment — Mind Ur Mind'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Sharp Brain for Schools',
    heading: 'EEG Brain & Focus Assessment',
  })
}
