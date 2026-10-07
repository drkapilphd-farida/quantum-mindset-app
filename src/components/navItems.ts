import type { MessageKey } from '@/lib/app-i18n/translate'
import { BarChart3, BookOpen, Brain, LayoutDashboard, Radio, Settings, type LucideIcon } from 'lucide-react'
import type { AppDomain } from '@/lib/domains/appDomain'
import { programs } from '@/config/site.config'

export type NavItem = { href: string; labelKey: MessageKey | null; label?: string; icon: LucideIcon }

// Domain Split™ — habit.mindurmind.org.in shows ONLY the 21-Day Habit
// Builder (its journey + own streak tracker) and Settings; every other
// item below is app.mindurmind.org.in-only. "Dashboard" is the one item
// both domains share — it's the same URL path on both, the page itself
// (see (dashboard)/dashboard/page.tsx) renders different content per
// domain. Cross-domain routes are also actively redirected at the
// middleware level (src/middleware.ts's DOMAIN_ROUTES) — this split
// keeps the nav honest with that enforcement, it isn't the enforcement
// itself.
const SHARED_LEADING_NAV_ITEMS = [{ href: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard }] as const

// journey/analytics already existed (built for the dashboard-page journey
// card's own "view analytics" link) but had no nav entry anywhere — the
// habit domain's real "streak tracker" surface. Labeled "History" per
// explicit product request — same real page, just matching the simpler
// 3-item mental model (Dashboard / History / Settings) the standalone
// ₹99 product is sold on. Settings was already promised by this file's
// own top comment but never actually included — added for real now,
// pointing at the same /settings page the account dropdown already links
// to, just also reachable from the main nav on this domain.
const HABIT_NAV_ITEMS = [
  { href: '/labs/sharp-brain/journey/analytics', labelKey: 'nav.history', icon: BarChart3 },
  { href: '/settings', labelKey: 'nav.settings', icon: Settings },
] as const

// Two-Pillar Simplification™ — the app domain now stands on exactly two
// pillars, not three. "Advanced Drills" (the standalone drill catalog:
// Coach dashboard, Reading DNA hub, Reports, Right Brain/Reading/
// Visualization/Intuition hubs) is retired — its training content lives
// only inside the 30-Day Masterclass's own daily missions now, never as
// a separate browsable catalog. "Sharp Brain" opens the 30-day plan (the
// daily practice); live classes, recordings and the Parents Dashboard tab
// sit under their own "Live Classes" item.
const QSR_NAV_ITEMS = [
  // Brand name — stays in English in every language.
  { href: '/labs/sharp-brain/thirty-day-curriculum', labelKey: null, label: programs.sharpBrain.shortName, icon: Brain },
  { href: '/masterclasses', labelKey: 'nav.liveClasses', icon: Radio },
  { href: '/document-studio', labelKey: 'nav.documentStudio', icon: BookOpen },
] as const

// "History" belongs to the Practice Journey, shown only to learners who
// already started it (see hasStartedPracticeJourney).
export function navItemsFor(appDomain: AppDomain, showPracticeJourney: boolean): readonly NavItem[] {
  if (appDomain !== 'habit') return [...SHARED_LEADING_NAV_ITEMS, ...QSR_NAV_ITEMS]
  const habitItems = HABIT_NAV_ITEMS.filter((item) => showPracticeJourney || !item.href.startsWith('/labs/sharp-brain/journey'))
  return [...SHARED_LEADING_NAV_ITEMS, ...habitItems]
}
