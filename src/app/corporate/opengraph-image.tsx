import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Brain performance programs for teams and schools'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Brain performance programs for teams and schools',
  })
}
