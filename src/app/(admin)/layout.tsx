import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/AdminShell'
import { countDueFollowups } from '@/features/brain-unlock/admin/followupsData'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? []
  if (!adminEmails.includes(user.email ?? '')) redirect('/dashboard')

  // Brain Unlock WhatsApp follow-ups due now (sent by hand) — the menu badge.
  const due = await countDueFollowups()
  return <AdminShell badges={{ '/admin/followups': due }}>{children}</AdminShell>
}
