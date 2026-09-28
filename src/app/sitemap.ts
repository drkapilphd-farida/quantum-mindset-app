import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/siteUrl'
import { retiredPageRedirect } from '@/config/retiredPages'

// Regenerated hourly so date-retired pages drop out soon after their date.
export const revalidate = 3600

// Every real, indexable, public marketing/program page — everything
// auth-gated (dashboard/admin/preview/portals), mid-funnel/utility
// (welcome/*, discover-learning-potential's own sub-steps,
// assessments/*), or orphaned/legacy (the old Stripe `/courses`
// marketplace, `/reviews`, `/certificates/[token]`) is intentionally
// excluded here and carries its own `noindex` meta tag instead — see
// docs/site-inventory.md for the full page-by-page inventory this list
// was built from.
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/corporate', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gallery', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/franchise-individual', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/executive-brain-workshop', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/prefrontal-power-mumbai', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/mind-assessment', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/programs/sharp-brain', changeFrequency: 'weekly', priority: 1 },
  { path: '/programs/sharp-brain/speed-test', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/programs/habit-builder', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/retreats/residential', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/retreats/online-11-day', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/mentoring/overthinking-course', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/mentoring/personal-class', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/assessments', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/discover-learning-potential', changeFrequency: 'monthly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.filter((route) => retiredPageRedirect(route.path) === null).map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // The legacy course marketplace (/courses/*) is deliberately NOT
  // listed: it is noindex and disallowed in robots.ts, so listing it only
  // produced "submitted URL marked noindex" errors in Search Console.
  return staticUrls
}
