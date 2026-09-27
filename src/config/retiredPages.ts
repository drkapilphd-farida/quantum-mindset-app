// Pages that retire on a date: from `afterISO` onward they 301-redirect to
// `to` (middleware.ts) and drop out of sitemap.xml. Kept dependency-free
// because middleware runs on every request.
export const RETIRED_PAGES: readonly { path: string; to: string; afterISO: string }[] = [
  // PREfrontal POWER Mumbai ran on 27 Sep 2026; afterwards visitors go to
  // the next leadership workshop.
  { path: '/prefrontal-power-mumbai', to: '/executive-brain-workshop', afterISO: '2026-09-27T23:59:59+05:30' },
]

export function retiredPageRedirect(pathname: string, now: Date = new Date()): string | null {
  const match = RETIRED_PAGES.find((page) => pathname === page.path || pathname.startsWith(`${page.path}/`))
  if (match === undefined) return null
  return now.getTime() > new Date(match.afterISO).getTime() ? match.to : null
}
