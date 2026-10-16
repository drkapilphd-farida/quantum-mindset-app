'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { track } from '@/lib/fbq'

type MetaPixelProps = {
  pixelId: string
}

// Site-wide Meta Pixel loader (root layout) — renders nothing when
// pixelId is empty (site.config.ts `analytics.metaPixelId`). Standard Meta base code: init +
// PageView on first load, then a PageView on every client-side route change
// (the first render is skipped, so the first page isn't counted twice). The
// other events go through lib/fbq.ts (see lib/analytics/conversions.ts).
export function MetaPixel({ pixelId }: MetaPixelProps): React.JSX.Element | null {
  const pathname = usePathname()
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (pixelId !== '') track('PageView')
  }, [pathname, pixelId])

  if (pixelId === '') return null

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- Meta's own documented noscript fallback pixel; next/image's optimization pipeline doesn't apply to a 1x1 tracking pixel. */}
        <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} alt="" />
      </noscript>
    </>
  )
}
