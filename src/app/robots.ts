import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/siteUrl'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/settings/',
        '/progress/',
        '/practice/',
        '/api/',
        '/preview/',
        '/labs/',
        '/welcome/',
        '/discover-learning-potential/',
        '/discover-welcome-preview/',
        '/unified-quantum-session-preview/',
        '/assessments/',
        '/partner-admin/',
        '/school-admin/',
        '/parent-dashboard/',
        '/masterclasses/',
        '/document-studio/',
        '/library/',
        '/courses/',
        '/reviews/',
        '/certificates/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
