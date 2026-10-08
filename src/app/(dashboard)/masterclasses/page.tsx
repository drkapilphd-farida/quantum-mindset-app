import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ParentDashboard } from '@/features/parent-dashboard/components/ParentDashboard'
import { getLiveClassesView } from '@/features/live-classes/actions'
import { LiveClassesExperience } from '@/features/live-classes/components/LiveClassesExperience'
import { MentorGuidanceCard } from '@/features/live-masterclass/components/MentorGuidanceCard'
import { TYPOGRAPHY } from '@/lib/designSystem/typography'
import { cn } from '@/lib/utils'
import { getAppT } from '@/lib/app-i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAppT()
  return { title: t('dashboard.liveClasses.title'), robots: { index: false, follow: false } }
}

// Pillar 1 — Live Member Training Hub™. Member-Exclusive Simplification™:
// this used to also carry public enrollment copy (₹9,999 CTA, a WhatsApp
// promo banner, a reviews link) — all of that moves to a future public
// landing page, out of scope here. This tab now assumes the visitor is
// already a member and shows only real, admin-authored data from the
// `masterclasses` table (supabase/migrations/20260823000001_create_
// masterclasses.sql, 20260823162303_add_join_url_to_masterclasses.sql):
// the next live cohort's schedule/join link, the recorded vault, and a
// direct way to reach Dr. Kapil. Both sections render an honest empty
// state when the table has no matching rows — never a fabricated
// placeholder. Parents Dashboard stays a real tab either way.
export default async function MasterclassesPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/masterclasses')

  // Phase 3: the rolling monthly cycle of Classes 1–7 (the old per-session
  // "masterclasses" table is no longer shown here).
  const [view, { t }] = await Promise.all([getLiveClassesView(), getAppT()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className={TYPOGRAPHY.h1}>{t('dashboard.liveClasses.title')}</h1>
        <p className={cn(TYPOGRAPHY.body, 'mt-2 text-muted-foreground')}>{t('dashboard.liveClasses.intro')}</p>
      </div>

      <Tabs defaultValue="masterclass">
        <TabsList>
          <TabsTrigger value="masterclass">{t('dashboard.liveClasses.tabClasses')}</TabsTrigger>
          <TabsTrigger value="parents">{t('dashboard.liveClasses.tabParents')}</TabsTrigger>
        </TabsList>

        <TabsContent value="masterclass" className="space-y-4 pt-4 sm:space-y-6">
          <LiveClassesExperience view={view} now={Date.now()} />
          <MentorGuidanceCard />
        </TabsContent>

        <TabsContent value="parents" className="pt-4">
          <ParentDashboard userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
