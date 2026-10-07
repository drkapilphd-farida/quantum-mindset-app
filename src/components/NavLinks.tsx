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
