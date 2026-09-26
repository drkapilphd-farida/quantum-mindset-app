import { buildOgImageResponse, OG_IMAGE_SIZE } from '@/lib/seo/ogImage'

export const alt = 'Quantum Mindset & Habit Builder'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

export default async function Image(): Promise<ReturnType<typeof buildOgImageResponse>> {
  return buildOgImageResponse({
    eyebrow: 'Mind Ur Mind',
    heading: 'Quantum Mindset & Habit Builder — 21 Days',
  })
}
