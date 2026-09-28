import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Dr. Kapil Dev Sharma — Brain, Mind & Meditation Coach'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Dr. Kapil Dev Sharma — Brain, Mind & Meditation Coach',
  })
}
