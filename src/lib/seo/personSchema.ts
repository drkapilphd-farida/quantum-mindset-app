import { SITE_URL } from './siteUrl'
import { brand, trainer } from '@/config/site.config'

// schema.org Person JSON-LD — same server-side, escape-then-inject
// pattern as faqSchema.ts/courseSchema.ts. Rendered on the homepage and
// /about. Description deliberately states both dates from the resolved
// founding line ("Mind Ur Mind founded 2014 · Quantum Speed Reading
// since 2015") rather than a single ambiguous year — see the
// site-inventory audit's 2014-vs-2015 finding.
export function buildPersonSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: trainer.name,
    jobTitle: trainer.en.title,
    description: trainer.en.shortBio,
    url: SITE_URL,
    image: `${SITE_URL}${trainer.photo.src}`,
    worksFor: {
      '@type': 'Organization',
      name: brand.name,
      url: SITE_URL,
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
