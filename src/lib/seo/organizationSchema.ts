import { SITE_URL } from './siteUrl'
import { brand, trainer } from '@/config/site.config'

// schema.org Organization JSON-LD — same server-side, escape-then-inject
// pattern as faqSchema.ts/courseSchema.ts. Rendered on the homepage and
// /about (see the "founding line" resolution: Mind Ur Mind the
// organization was founded in 2014; Quantum Speed Reading, one of its
// programs, was developed in 2015 — foundingDate here refers to the
// organization itself, not the QSR programme).
export function buildOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: SITE_URL,
    logo: `${SITE_URL}${trainer.photo.src}`,
    foundingDate: String(brand.foundedYear),
    founder: {
      '@type': 'Person',
      name: trainer.name,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vadodara',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
  }

  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
