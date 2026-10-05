import type { Metadata } from 'next'
import { getAppT } from '@/lib/app-i18n/server'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { brand } from '@/config/site.config'

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
}

type LoginPageProps = {
  searchParams: Promise<{ next?: string; message?: string; error?: string }>
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const { t } = await getAppT()

  return (
    <div className="space-y-4">
      {params.message === 'check-email' && (
        <p className="bg-muted rounded-md px-4 py-3 text-center text-sm">
          {t('auth.pages.confirmEmail')}
        </p>
      )}
      {params.message === 'device-logout' && (
        <p className="bg-muted rounded-md px-4 py-3 text-center text-sm">
          {t('auth.pages.deviceLogout')}
        </p>
      )}
      {params.error === 'invalid-link' && (
        <p className="bg-destructive/10 text-destructive rounded-md px-4 py-3 text-center text-sm">
          {t('auth.pages.linkExpired')}{' '}
          <a href="/forgot-password" className="underline underline-offset-2">
            {t('auth.pages.requestNew')}
          </a>
        </p>
      )}
      <AuthCard
        title={t('auth.pages.loginTitle')}
        description={t('auth.pages.loginDesc', { app: brand.appName })}
      >
        <LoginForm next={params.next} />
      </AuthCard>
    </div>
  )
}
