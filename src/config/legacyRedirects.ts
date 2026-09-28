// Permanent 301 redirects for renamed URLs — loaded by next.config.ts.
//
// site-rebuild Phase 5B: "Quantum Speed Reading" was renamed Sharp Brain™,
// and the word "Quantum" was removed from every visible URL. Old links
// (bookmarks, ads, WhatsApp messages, emails, app deep links built from
// saved exercise IDs) keep working through these redirects. Specific paths
// come before the catch-all prefixes.

type Redirect = { source: string; destination: string; statusCode: 301 }

const EXERCISE_SLUG_RENAMES: readonly [oldSlug: string, newSlug: string][] = [
  ['quantum-hidden-target-grid', 'hidden-target-grid'],
  ['quantum-mental-rotation', 'mental-rotation'],
  ['esp-zener-telepathy', 'zener-intuition'],
  ['photographic-memory', 'visual-memory'],
  ['photographic-reading', 'visual-reading'],
  ['hemispheric-color-sync', 'color-word-sync'],
]

function exerciseRedirects(base: string): Redirect[] {
  return EXERCISE_SLUG_RENAMES.flatMap(([oldSlug, newSlug]) => [
    { source: `${base}/${oldSlug}`, destination: `/labs/sharp-brain/${newSlug}`, statusCode: 301 },
    { source: `${base}/${oldSlug}/:path*`, destination: `/labs/sharp-brain/${newSlug}/:path*`, statusCode: 301 },
  ])
}

const WORDPRESS_REDIRECTS: Redirect[] = [
  ['/faq', '/#faq'],
  ['/testimonials', '/#proof'],
  ['/personalclass', '/mentoring/personal-class'],
  ['/workshops', '/#upcoming'],
  ['/anxiety', '/mentoring/overthinking-course'],
  ['/telepathy', '/'],
  ['/telepathycourse', '/'],
  ['/about-us-telepathy', '/'],
  ['/free', '/'],
  ['/elementor-landing-page-1483', '/'],
].map(([source, destination]) => ({ source: source as string, destination: destination as string, statusCode: 301 as const }))

export const LEGACY_REDIRECTS: Redirect[] = [
  // Marketing: the program page (and its sub-pages such as the speed test)
  { source: '/programs/quantum-speed-reading-mumbai', destination: '/programs/sharp-brain', statusCode: 301 },
  { source: '/programs/quantum-speed-reading', destination: '/programs/sharp-brain', statusCode: 301 },
  { source: '/programs/quantum-speed-reading/:path*', destination: '/programs/sharp-brain/:path*', statusCode: 301 },
  // App: exercises whose slug itself changed (old base and new base)
  ...exerciseRedirects('/labs/quantum-speed-reading'),
  ...exerciseRedirects('/labs/sharp-brain'),
  // App: everything else under the old base
  { source: '/labs/quantum-speed-reading', destination: '/labs/sharp-brain', statusCode: 301 },
  { source: '/labs/quantum-speed-reading/:path*', destination: '/labs/sharp-brain/:path*', statusCode: 301 },
  { source: '/unified-quantum-session-preview', destination: '/unified-session-preview', statusCode: 301 },
  { source: '/unified-quantum-session-preview/:path*', destination: '/unified-session-preview/:path*', statusCode: 301 },
  {
    source: '/discover-learning-potential/reading/quantum-speed-reading-intro',
    destination: '/discover-learning-potential/reading/sharp-brain-intro',
    statusCode: 301,
  },
  { source: '/preview/learning-projects/:id/quantum-journey', destination: '/preview/learning-projects/:id/learning-journey', statusCode: 301 },
  // Old WordPress site (still in Google's index, 28 Sep 2026): each URL to
  // the closest current page. Discontinued topics (telepathy etc.) go to the
  // homepage rather than to a program they would misdescribe. /courses is
  // left alone — that path is a real (legacy) page on this site.
  ...WORDPRESS_REDIRECTS,
]
