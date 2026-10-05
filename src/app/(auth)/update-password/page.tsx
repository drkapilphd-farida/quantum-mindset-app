import type { Metadata } from 'next'
import { getAppT } from '@/lib/app-i18n/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { UpdatePasswordForm } from '@/features/user/components/UpdatePasswordForm'

export const metadata: Metadata = {
  title: 'Set New Password',
  robots: { index: false, follow: false },
}

export default async function UpdatePasswordPage(): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <AuthCard
      title={t('auth.pages.newPasswordTitle')}
      description={t('auth.pages.newPasswordDesc')}
    >
      <UpdatePasswordForm redirectAfterSuccess="/dashboard" />
    </AuthCard>
  )
}
