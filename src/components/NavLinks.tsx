'use client'

import Link from 'next/link'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { useAppT } from '@/lib/app-i18n/client'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen, LayoutDashboard, Radio, Settings, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppDomain } from '@/lib/domains/appDomain'
import { programs } from '@/config/site.config'

type NavItem = { href: string; labelKey: MessageKey | null; label?: string; icon: LucideIcon }

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
// a separate browsable catalog. Parents Dashboard stays reachable as a
// tab inside Pillar 1 (/masterclasses), not a separate top-level item.
const QSR_NAV_ITEMS = [
  // Brand name — stays in English in every language.
  { href: '/masterclasses', labelKey: null, label: programs.sharpBrain.shortName, icon: Radio },
  { href: '/document-studio', labelKey: 'nav.documentStudio', icon: BookOpen },
] as const

// "History" belongs to the Practice Journey, shown only to learners who
// already started it (see hasStartedPracticeJourney).
function navItemsFor(appDomain: AppDomain, showPracticeJourney: boolean): readonly NavItem[] {
  if (appDomain !== 'habit') return [...SHARED_LEADING_NAV_ITEMS, ...QSR_NAV_ITEMS]
  const habitItems = HABIT_NAV_ITEMS.filter((item) => showPracticeJourney || !item.href.startsWith('/labs/sharp-brain/journey'))
  return [...SHARED_LEADING_NAV_ITEMS, ...habitItems]
}

type NavLinksProps = {
  onSelect?: (() => void) | undefined
  appDomain: AppDomain
  showPracticeJourney: boolean
}

export function NavLinks({ onSelect, appDomain, showPracticeJourney }: NavLinksProps): React.JSX.Element {
  const pathname = usePathname()
  const t = useAppT()
  const navItems = navItemsFor(appDomain, showPracticeJourney)

  return (
    <nav className="flex flex-col gap-0.5 px-2" aria-label={t('nav.mainNavigation')}>
      {navItems.map(({ href, labelKey, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            {...(onSelect !== undefined ? { onClick: onSelect } : {})}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isActive
                ? 'bg-foreground/[0.07] text-foreground'
                : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
            )}
          >
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors duration-150',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
              aria-hidden="true"
            />
            {labelKey !== null ? t(labelKey) : label}
          </Link>
        )
      })}
    </nav>
  )
}
