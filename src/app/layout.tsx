import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Inter, Instrument_Serif, IBM_Plex_Mono, Noto_Sans_Devanagari } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { LanguageProvider } from '@/context/LanguageContext'
import { SITE_URL, SITE_NAME } from '@/lib/seo/siteUrl'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Warm Luxury Mentorship™ — additive only: these 4 fonts and the
// variables they define (--font-homepage-sans/-mono/-display/-devanagari)
// are consumed exclusively by .warm-light (globals.css) and its two
// pages' own components (src/app/(marketing)/page.tsx and
// src/app/programs/quantum-speed-reading/page.tsx). Every other route
// keeps using Geist exactly as before — nothing here touches
// --font-sans/--font-mono globally. Deliberately namespaced (not
// `--font-mono`/`--font-display`) so they can never collide with the
// app-wide token names those existing utilities already resolve to.
const homepageSans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-homepage-sans',
  display: 'swap',
})

const homepageDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-homepage-devanagari',
  display: 'swap',
})

const homepageDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-homepage-display',
  display: 'swap',
})

const homepageMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-homepage-mono',
  display: 'swap',
})

// Strict App Naming™ — every surface that shows "the app name" (browser
// tab, PWA install prompt, iOS home screen label, social share cards)
// says exactly "Mind Ur Mind," nothing appended. Only the `description`
// fields (not name fields) still use full prose — naming a product and
// describing it are different things.
//
// `metadataBase` is the hardcoded SITE_URL, not an environment variable
// — see src/lib/seo/siteUrl.ts's own comment for why. This is also what
// makes every relative `openGraph`/`twitter` image path (including the
// `opengraph-image.tsx` file-convention images) resolve to an absolute
// URL automatically.
//
// This root default description/OG only apply to a page that sets
// none of its own — every real page should go through
// src/lib/seo/metadata.ts's `buildPageMetadata()` instead, which always
// sets a page-specific description.
export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Mind Ur Mind — brain, mind and meditation coaching by Dr. Kapil Dev Sharma, Vadodara.',
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    // black-translucent — content draws edge-to-edge under the iOS
    // status bar (translucent icons over our own background) instead of
    // 'default''s solid white status bar strip. This is what "true
    // full-screen, no URL bar" actually means on iOS Safari standalone
    // launches; safe-area-inset padding (viewportFit: 'cover' below,
    // already threaded through every exercise layout) is what keeps
    // real content clear of the status bar/notch area under this mode.
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  // Next.js's appleWebApp.capable only renders the newer, non-prefixed
  // <meta name="mobile-web-app-capable"> tag (verified directly in
  // next/dist/lib/metadata/generate/basic.js — it never emits the
  // apple-prefixed one). iOS Safari's own "Add to Home Screen" standalone
  // detection has historically required the legacy apple-prefixed tag
  // specifically; the unprefixed one is the newer, Chromium-originated
  // standard. `other` is Next's supported escape hatch for exactly this
  // — added defensively so standalone mode isn't silently dependent on
  // which iOS Safari version a given user is running.
  other: {
    'apple-mobile-web-app-capable': 'yes',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: 'Mind Ur Mind — brain, mind and meditation coaching by Dr. Kapil Dev Sharma, Vadodara.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Mind Ur Mind — brain, mind and meditation coaching by Dr. Kapil Dev Sharma, Vadodara.',
  },
}

// themeColor lives on the separate `viewport` export, not `metadata` —
// Next.js deprecated (and warns/build-errors on) putting it there.
// viewportFit: 'cover' — Immersive Exercise Mode™'s prerequisite: without
// it, iOS Safari's env(safe-area-inset-*) always resolves to 0, silently
// making every safe-area padding rule in ReadingLayout.tsx/
// ExercisePracticeLayout.tsx/ThetaBreathingAnchor.tsx a no-op.
export const viewport: Viewport = {
  themeColor: '#2B4CE8',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${homepageSans.variable} ${homepageDevanagari.variable} ${homepageDisplay.variable} ${homepageMono.variable} scroll-smooth`}
    >
      <body className="antialiased">
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
        <Toaster />
        <ServiceWorkerRegistration />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
