// Permanent (301/308) redirects for renamed URLs — loaded by next.config.ts.
//
// site-rebuild Phase 5B: "Quantum Speed Reading" was renamed Sharp Brain™,
// and the word "Quantum" was removed from every visible URL. Old links
// (bookmarks, ads, WhatsApp messages, emails, app deep links built from
// saved exercise IDs) keep working through these redirects. Specific paths
// come before the catch-all prefixes.

type Redirect = { source: string; destination: string; permanent: true }

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
    { source: `${base}/${oldSlug}`, destination: `/labs/sharp-brain/${newSlug}`, permanent: true },
    { source: `${base}/${oldSlug}/:path*`, destination: `/labs/sharp-brain/${newSlug}/:path*`, permanent: true },
  ])
}

export const LEGACY_REDIRECTS: Redirect[] = [
  // Marketing: the program page (and its sub-pages such as the speed test)
  { source: '/programs/quantum-speed-reading-mumbai', destination: '/programs/sharp-brain', permanent: true },
  { source: '/programs/quantum-speed-reading', destination: '/programs/sharp-brain', permanent: true },
  { source: '/programs/quantum-speed-reading/:path*', destination: '/programs/sharp-brain/:path*', permanent: true },
  // App: exercises whose slug itself changed (old base and new base)
  ...exerciseRedirects('/labs/quantum-speed-reading'),
  ...exerciseRedirects('/labs/sharp-brain'),
  // App: everything else under the old base
  { source: '/labs/quantum-speed-reading', destination: '/labs/sharp-brain', permanent: true },
  { source: '/labs/quantum-speed-reading/:path*', destination: '/labs/sharp-brain/:path*', permanent: true },
  { source: '/unified-quantum-session-preview', destination: '/unified-session-preview', permanent: true },
  { source: '/unified-quantum-session-preview/:path*', destination: '/unified-session-preview/:path*', permanent: true },
  {
    source: '/discover-learning-potential/reading/quantum-speed-reading-intro',
    destination: '/discover-learning-potential/reading/sharp-brain-intro',
    permanent: true,
  },
  { source: '/preview/learning-projects/:id/quantum-journey', destination: '/preview/learning-projects/:id/learning-journey', permanent: true },
]
