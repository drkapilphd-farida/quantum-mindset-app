'use client'

import SiteNav from '@/components/site/SiteNav'
import { trackGaEvent } from '@/lib/analytics/ga4'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

// Site-wide header with this page's "Reserve My Seat" as the header button.
// English-only page, so no language toggle.
export function ExecutiveWorkshopNav(): React.JSX.Element {
  function handleReserveClick(): void {
    trackGaEvent('signup_cta_click', { location: 'nav' })
    trackMetaPixelEvent('InitiateCheckout', { content_name: 'nav_reserve_seat' })
  }

  return <SiteNav showLanguageToggle={false} cta={{ label: 'Reserve My Seat', href: '#pricing', onClick: handleReserveClick }} />
}
