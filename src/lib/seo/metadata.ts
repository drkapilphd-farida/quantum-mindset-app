import type { Metadata } from 'next'
import { SITE_NAME, absoluteUrl } from './siteUrl'

type BuildPageMetadataInput = {
  /** Route path, e.g. '/programs/quantum-speed-reading'. Used for canonical + og:url. */
  path: string
  /** Full, literal page title — always rendered as-is (bypasses the root layout's title template). */
  title: string
  /** Page-specific meta description — must describe THIS page's actual content, not a sitewide default. */
  description: string
  /**
   * Defaults to true. Set false for thin/utility/auth-gated pages so they carry
   * `<meta name="robots" content="noindex,nofollow">` instead of a bespoke description.
   */
  index?: boolean
  /**
   * Set true when this route has its own `opengraph-image.tsx` next to its
   * page.tsx. Config-set images override file-based ones in Next.js, so the
   * default image must be left out for those routes or it would replace
   * their page-specific image.
   */
  ownOgImage?: boolean
}

// Central metadata builder — every real, public page on the site should
// go through this so canonical/og:url/og:title/og:description/twitter
// fields never drift out of sync with each other.
//
// og:image/twitter:image default to the root `app/opengraph-image.tsx`
// explicitly: a page that sets its own `openGraph` object replaces the
// parent's `openGraph` wholesale in Next.js, so without this the root
// default image is silently dropped (confirmed in the Phase 1 build —
// /, /about, /contact etc. rendered no og:image at all). A route with
// its own `opengraph-image.tsx` must pass `ownOgImage: true`, which leaves
// images unset so Next's file convention resolves it (config-set images
// would override the file-based one). The relative
// URL is resolved to an absolute one against `metadataBase` (SITE_URL).
const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Mind Ur Mind · Brain, Mind & Meditation Coach — Dr. Kapil Dev Sharma',
}

export function buildPageMetadata({ path, title, description, index = true, ownOgImage = false }: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const images = ownOgImage ? {} : { images: [DEFAULT_OG_IMAGE] }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    ...(index ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      ...images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...images,
    },
  }
}
