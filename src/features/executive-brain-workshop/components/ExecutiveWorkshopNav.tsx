'use client'

import SiteNav from '@/components/site/SiteNav'
import { trackGaEvent } from '@/lib/analytics/ga4'

// Site-wide header with this page's "Reserve My Seat" as the header button.
// English-only page, so no language toggle.
export function ExecutiveWorkshopNav(): React.JSX.Element {
  function handleReserveClick(): void {
    trackGaEvent('signup_cta_click', { location: 'nav' })
  }

  return <SiteNav showLanguageToggle={false} cta={{ label: 'Reserve My Seat', href: '#pricing', onClick: handleReserveClick }} />
}
