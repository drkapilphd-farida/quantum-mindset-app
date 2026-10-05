import type { Metadata } from 'next'
import { getAppT } from '@/lib/app-i18n/server'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
}

export default async function ForgotPasswordPage(): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <AuthCard
      title={t('auth.pages.resetTitle')}
      description={t('auth.pages.resetDesc')}
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
