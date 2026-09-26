import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { trainer } from '@/config/site.config'

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

// Module-scope cache — every opengraph-image.tsx route reuses the same
// decoded photo instead of re-reading it from disk per request.
let cachedPhotoDataUrl: string | null = null

async function getFounderPhotoDataUrl(): Promise<string> {
  if (cachedPhotoDataUrl) return cachedPhotoDataUrl
  const buffer = await readFile(join(process.cwd(), 'public', trainer.photo.src))
  cachedPhotoDataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`
  return cachedPhotoDataUrl
}

type BuildOgImageInput = {
  /** Small uppercase line, e.g. "MIND UR MIND" */
  eyebrow: string
  /** Large headline text — the page-specific tagline. */
  heading: string
}

// Shared 1200x630 social-share image generator — the master founder
// photo plus a text overlay, reused (with different `heading`s) by the
// root default `opengraph-image.tsx` and every program-specific one.
// Deliberately built from a real photo + real text via next/og's
// ImageResponse (satori) rather than a static exported PNG, so a copy
// change never requires re-exporting an image asset by hand.
export async function buildOgImageResponse({ eyebrow, heading }: BuildOgImageInput): Promise<ImageResponse> {
  const photoSrc = await getFounderPhotoDataUrl()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0b0f17',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#22a896',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 22,
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#edeef3',
              maxWidth: 620,
            }}
          >
            {heading}
          </div>
        </div>
        <div
          style={{
            width: '40%',
            height: '100%',
            display: 'flex',
          }}
        >
          <img
            src={photoSrc}
            width={480}
            height={630}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  )
}
