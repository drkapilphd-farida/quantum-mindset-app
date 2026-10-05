import Link from 'next/link'
import { getAppT } from '@/lib/app-i18n/server'
import { cn } from '@/lib/utils'

type DashboardViewToggleProps = {
  activeView: 'student' | 'parent'
}

// Elevated Parents Dashboard™ — a plain, URL-driven segmented toggle (two
// real links, no client JS/state) so the choice is bookmarkable and
// survives a refresh, matching this app's "URL is the source of truth
// for navigation state" convention. /dashboard is Student View by
// default; /dashboard?view=parent switches to the same real
// ParentDashboard already embedded as a tab on the Masterclasses hub —
// this is just a second, more direct entry point to it, not a copy.
export async function DashboardViewToggle({ activeView }: DashboardViewToggleProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-card/60 p-1 text-xs font-medium">
      <Link
        href="/dashboard"
        className={cn(
          'rounded-full px-3 py-1.5 transition-colors',
          activeView === 'student' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {t('dashboard.viewToggle.student')}
      </Link>
      <Link
        href="/dashboard?view=parent"
        className={cn(
          'rounded-full px-3 py-1.5 transition-colors',
          activeView === 'parent' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {t('dashboard.viewToggle.parent')}
      </Link>
    </div>
  )
}
