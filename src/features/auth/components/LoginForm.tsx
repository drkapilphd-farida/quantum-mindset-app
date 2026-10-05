'use client'

import { useMemo, useTransition } from 'react'
import { z } from 'zod'
import { useAppT } from '@/lib/app-i18n/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { type SignInInput } from '../types'
import { signIn } from '../actions/signIn'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GoogleSignInButton } from './GoogleSignInButton'
import { AuthDivider } from './AuthDivider'

type LoginFormProps = {
  next?: string | undefined
  // Mirrors SignUpForm's onSwitchToLogin — provided only by the Gateway
  // Auth Modal, so "Sign up" switches mode in place instead of navigating
  // to /signup.
  onSwitchToSignup?: (() => void) | undefined
}

export function LoginForm({ next, onSwitchToSignup }: LoginFormProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const t = useAppT()
  const schema = useMemo(
    () => z.object({ email: z.string().email(t('auth.validation.email')), password: z.string().min(1, t('auth.validation.passwordRequired')) }),
    [t],
  )

  const form = useForm<SignInInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  function handleSubmit(values: SignInInput): void {
    startTransition(async () => {
      const result = await signIn(values, next)
      toast.error(result.error)
    })
  }

  return (
    <div className="space-y-4">
      <GoogleSignInButton next={next} />
      <AuthDivider label={t('auth.orEmail')} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('auth.signingIn') : t('auth.signIn')}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            {t('auth.noAccount')}{' '}
            {onSwitchToSignup ? (
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-foreground font-medium hover:underline"
              >
                {t('auth.signUp')}
              </button>
            ) : (
              <Link
                href="/signup"
                className="text-foreground font-medium hover:underline"
              >
                {t('auth.signUp')}
              </Link>
            )}
          </p>
        </form>
      </Form>
    </div>
  )
}
