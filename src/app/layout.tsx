import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Geist_Mono,
  Inter,
  Instrument_Serif,
  IBM_Plex_Mono,
  Noto_Sans_Devanagari,
  Noto_Sans_Kannada,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Gujarati,
  Noto_Sans_Bengali,
} from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { NavigationProgress } from '@/components/NavigationProgress'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import ConversionTracker from '@/components/analytics/ConversionTracker'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { analytics } from '@/config/site.config'
import { LanguageProvider } from '@/context/LanguageContext'
import { SITE_URL, SITE_NAME } from '@/lib/seo/siteUrl'
import './globals.css'

// Only Inter (the main marketing body font) is preloaded. The others load
// on demand when a page actually uses them, so ~250 KB of font preloads no
// longer compete with the hero image and text on slow mobile connections.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: false,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
})

// Warm Luxury Mentorship™ — additive only: these 4 fonts and the
// variables they define (--font-homepage-sans/-mono/-display/-devanagari)
// are consumed exclusively by .warm-light (globals.css) and its two
// pages' own components (src/app/(marketing)/page.tsx and
// src/app/programs/sharp-brain/page.tsx). Every other route
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
  preload: false,
})

// App languages (Kannada, Tamil, Telugu, Gujarati; Marathi uses the
// Devanagari font above). Not preloaded, and each @font-face carries its
// script's unicode-range, so a browser downloads a file only when the page
// actually shows that script — i.e. only for the language that is selected.
const notoKannada = Noto_Sans_Kannada({ subsets: ['kannada'], weight: ['400', '600', '700'], variable: '--font-noto-kannada', display: 'swap', preload: false })
const notoTamil = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['400', '600', '700'], variable: '--font-noto-tamil', display: 'swap', preload: false })
const notoTelugu = Noto_Sans_Telugu({ subsets: ['telugu'], weight: ['400', '600', '700'], variable: '--font-noto-telugu', display: 'swap', preload: false })
const notoGujarati = Noto_Sans_Gujarati({ subsets: ['gujarati'], weight: ['400', '600', '700'], variable: '--font-noto-gujarati', display: 'swap', preload: false })
const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], weight: ['400', '600', '700'], variable: '--font-noto-bengali', display: 'swap', preload: false })

const homepageDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-homepage-display',
  display: 'swap',
  preload: false,
})

const homepageMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-homepage-mono',
  display: 'swap',
  preload: false,
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
      className={`${geistSans.variable} ${geistMono.variable} ${homepageSans.variable} ${homepageDevanagari.variable} ${homepageDisplay.variable} ${homepageMono.variable} ${notoKannada.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoGujarati.variable} ${notoBengali.variable} scroll-smooth`}
    >
      <body className="antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
        <Toaster />
        <ServiceWorkerRegistration />
        <GoogleAnalytics />
        <MetaPixel pixelId={analytics.metaPixelId} />
        <ConversionTracker />
      </body>
    </html>
  )
}
