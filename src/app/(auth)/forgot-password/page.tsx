import type { Metadata } from 'next'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage(): React.JSX.Element {
  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
    >
      <ForgotPasswordForm />
    </AuthCard>
  )
}
