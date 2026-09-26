'use client'

import Script from 'next/script'

type MetaPixelProps = {
  pixelId: string
}

// Page-scoped Meta Pixel loader — renders nothing when pixelId is empty
// (see executiveBrainWorkshopConfig.ts). Standard Meta base code, fires
// PageView automatically on load; trackMetaPixelEvent (metaPixel.ts)
// fires the rest (ViewContent/InitiateCheckout/Lead) from this page's
// own components.
export function MetaPixel({ pixelId }: MetaPixelProps): React.JSX.Element | null {
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
