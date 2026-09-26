import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'
import { brand } from '@/config/site.config'

export const alt = 'Mind Ur Mind'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

// Sitewide default — every page without its own opengraph-image.tsx
// inherits this one via Next.js's file-convention fallback.
export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: brand.name,
    heading: brand.positioning,
  })
}
