import type { Metadata } from 'next'
import { getAppT } from '@/lib/app-i18n/server'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export const metadata: Metadata = {
  title: 'Create Account',
  robots: { index: false, follow: false },
}

type SignUpPageProps = {
  searchParams: Promise<{ next?: string }>
}

// `next` wiring mirrors /login/page.tsx exactly — SignUpForm/signUp.ts
// already fully supported a `next` redirect target (email-confirm
// redirect and the immediate post-signup redirect both honor it), this
// page just wasn't reading it from the URL yet. Needed so a marketing
// page's own "Start Free" CTA (e.g. /programs/habit-builder) can land a
// brand-new user straight into Day 1 of the real journey after signup,
// not the generic dashboard.
export default async function SignUpPage({ searchParams }: SignUpPageProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  const params = await searchParams

  return (
    <AuthCard
      title={t('auth.pages.signupTitle')}
      description={t('auth.pages.signupDesc')}
    >
      <SignUpForm next={params.next} />
    </AuthCard>
  )
}
