import Link from 'next/link'
import Image from 'next/image'
import { NavLinks } from '@/components/NavLinks'
import { UserMenu } from '@/components/UserMenu'
import { LivingBrainLogo } from '@/components/brand/LivingBrainLogo'
import type { AppDomain } from '@/lib/domains/appDomain'
import { getDomainTagline } from '@/lib/domains/domainTagline'
import { brand } from '@/config/site.config'

type AppSidebarProps = {
  // School Dashboard white-labeling — set only for a student who belongs
  // to a school/franchise partner that has uploaded a logo; falls back
  // to the default Quantum Mind mark otherwise (the vast majority of
  // users, who aren't part of any tenant).
  brandName?: string | null
  brandLogoUrl?: string | null
  // Domain Split™ — resolved once in (dashboard)/layout.tsx from the
  // request's own Host header, threaded straight through to NavLinks.
  appDomain: AppDomain
  // Global Account Dropdown™ — already fetched in (dashboard)/layout.tsx
  // for Topbar; reused here so the sidebar-bottom account row never needs
  // its own extra query.
  fullName: string | null
  avatarUrl: string | null
  email: string
}

export function AppSidebar({ brandName = null, brandLogoUrl = null, appDomain, fullName, avatarUrl, email }: AppSidebarProps): React.JSX.Element {
  return (
    <aside className="flex h-full w-60 flex-col border-r bg-card/80">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border/60 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          {brandLogoUrl !== null ? (
            <Image src={brandLogoUrl} alt="" width={24} height={24} className="size-6 shrink-0 rounded object-contain" unoptimized />
          ) : (
            // Always the plain brand mark, unconditionally — a prior
            // "Duolingo-style" attempt made this shift color (toward red)
            // when a daily streak was missed; that was deliberately
            // removed (see commit c2a1179, "Remove streak-driven logo
            // warmth feature") per explicit product decision that the
            // logo should never change color based on streak/practice
            // status. Do not reintroduce that coupling here.
            <LivingBrainLogo size={24} decorative={false} animated={false} />
          )}
          <span className="brand-gradient-text">{brandName ?? brand.appName}</span>
        </Link>
      </div>
      {/* Consistent Branding™ — the one place a habit-domain visitor sees
          "Quantum Mindset & Habit Builder" spelled out near the wordmark,
          never anything about document upload or speed reading. Own row
          below the h-14 header rather than crammed inline next to the
          wordmark — the full tagline is too long to fit that single row
          in a 240px-wide sidebar. */}
      <p className="border-b border-border/60 px-4 py-2 text-[11px] font-medium text-muted-foreground">{getDomainTagline(appDomain)}</p>
      <div className="flex-1 overflow-y-auto py-3">
        <NavLinks appDomain={appDomain} />
      </div>
      {/* Global Account Dropdown™ (Phase 4) — Profile/Settings/Subscription/
          Support/Sign out, moved out of the top-level pillar list and into
          this sidebar-bottom row so the 3 pillars stay visually dominant.
          Desktop-only: Topbar keeps the compact trigger for mobile, which
          has no persistent sidebar to anchor this row to. */}
      <div className="shrink-0 border-t border-border/60 p-2">
        <UserMenu fullName={fullName} avatarUrl={avatarUrl} email={email} variant="row" />
      </div>
    </aside>
  )
}
