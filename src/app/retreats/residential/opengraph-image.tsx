import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Residential Retreats — Lonavala & Rishikesh'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Residential Retreats — Lonavala & Rishikesh',
  })
}
