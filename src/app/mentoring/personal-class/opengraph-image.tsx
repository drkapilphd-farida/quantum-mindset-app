import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Personal Class — 1-on-1 Mentoring'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Personal Class — 1-on-1 Mentoring',
  })
}
