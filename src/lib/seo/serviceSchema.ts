import { absoluteUrl } from './siteUrl'

// schema.org Service for the 1-on-1 program pages (owner brief, Nov 2026):
// provider Dr. Kapil Dev Sharma / Mind Ur Mind, Vadodara; online and in person.
export type ServiceSchemaInput = { name: string; description: string; path: string; inLanguage: 'en' | 'hi' }

export function buildServiceSchema({ name, description, path, inLanguage }: ServiceSchemaInput): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    inLanguage,
    serviceType: '1-on-1 coaching and guided practice',
    provider: {
      '@type': 'Person',
      name: 'Dr. Kapil Dev Sharma',
      worksFor: {
        '@type': 'Organization',
        name: 'Mind Ur Mind',
        url: absoluteUrl('/'),
        address: { '@type': 'PostalAddress', addressLocality: 'Vadodara', addressRegion: 'Gujarat', addressCountry: 'IN' },
      },
    },
    areaServed: 'IN',
    availableChannel: [
      { '@type': 'ServiceChannel', name: 'Online', serviceUrl: absoluteUrl(path) },
      { '@type': 'ServiceChannel', name: 'In person', serviceLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Vadodara', addressCountry: 'IN' } } },
    ],
  }
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
