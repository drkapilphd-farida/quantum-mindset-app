import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

// Placeholder share image (text only) until the owner sends a designed one.
export const alt = 'Sharp Brain™ Partner Program — Mind Ur Mind'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Sharp Brain™ Partner Program',
  })
}
