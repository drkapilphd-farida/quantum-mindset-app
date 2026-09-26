// Single source of truth for the site's public production URL and name.
// Every piece of metadata (canonical, og:url, og:image, sitemap.xml,
// robots.txt, JSON-LD, and the legacy Stripe/certificate redirect URLs)
// reads from this constant instead of an environment variable — this is
// the fix for the exact bug that shipped `http://localhost:3000` as
// canonical/og:url/og:image on production: those call sites read
// `process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'` directly,
// and the Vercel env var's actual value had drifted to the literal
// string "http://localhost:3000" — a valid URL, so no validation ever
// caught it. A hardcoded constant makes that whole bug class
// structurally impossible: there is no environment variable left to
// misconfigure for any of these surfaces.
export const SITE_URL = 'https://www.mindurmind.org.in'

export const SITE_NAME = 'Mind Ur Mind'

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
