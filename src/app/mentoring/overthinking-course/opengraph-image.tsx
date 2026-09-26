import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'
import { programs } from '@/config/site.config'

export const alt = programs.overthinkingReset.name
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: programs.overthinkingReset.name,
  })
}
