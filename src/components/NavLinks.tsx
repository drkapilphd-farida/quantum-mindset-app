'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { AppDomain } from '@/lib/domains/appDomain'
import { navItemsFor } from './navItems'

type NavLinksProps = {
  onSelect?: (() => void) | undefined
  appDomain: AppDomain
  showPracticeJourney: boolean
}

// Play design: each menu item's icon sits on its skill colour.
function skillColour(href: string): string {
  if (href.startsWith('/memory-studio')) return '#7c3aed'
  if (href.startsWith('/labs/sharp-brain/thirty-day-curriculum')) return '#4f46e5'
  if (href.startsWith('/masterclasses')) return '#0d9488'
  if (href.startsWith('/labs/sharp-brain/smart-reader')) return '#c2410c'
  if (href.startsWith('/labs/sharp-brain/journey')) return '#d97706'
  if (href.startsWith('/settings')) return '#64748b'
  return '#7c3aed'
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
              'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isActive ? 'bg-primary/12 text-foreground' : 'text-muted-foreground hover:bg-primary/6 hover:text-foreground',
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: skillColour(href) }} aria-hidden="true">
              <Icon className="size-4" />
            </span>
            {labelKey !== null ? t(labelKey) : label}
          </Link>
        )
      })}
    </nav>
  )
}
