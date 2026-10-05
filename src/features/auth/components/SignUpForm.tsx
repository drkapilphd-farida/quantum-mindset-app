'use client'

import { useMemo, useTransition } from 'react'
import { z } from 'zod'
import { useAppT } from '@/lib/app-i18n/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { type SignUpInput } from '../types'
import { signUp } from '../actions/signUp'
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

type SignUpFormProps = {
  next?: string | undefined
  // When provided (the Gateway Auth Modal's usage), the "Already have an
  // account? Sign in" line switches mode in place instead of navigating to
  // /login — staying in the modal rather than leaving it. Omitted on the
  // standalone /signup page, where a real navigation is correct.
  onSwitchToLogin?: (() => void) | undefined
}

export function SignUpForm({ next, onSwitchToLogin }: SignUpFormProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const t = useAppT()
  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(2, t('auth.validation.nameShort')),
        email: z.string().email(t('auth.validation.email')),
        password: z.string().min(8, t('auth.validation.passwordShort')),
      }),
    [t],
  )

  const form = useForm<SignUpInput>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  function handleSubmit(values: SignUpInput): void {
    startTransition(async () => {
      const result = await signUp(values, next)
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
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.fullName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.namePlaceholder')}
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('auth.passwordPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>

          <p className="text-muted-foreground text-center text-xs leading-relaxed">
            {t('auth.agreePrefix')}{' '}
            <Link href="/terms" className="text-foreground hover:underline">
              {t('auth.terms')}
            </Link>{' '}
            {t('auth.and')}{' '}
            <Link href="/privacy" className="text-foreground hover:underline">
              {t('auth.privacy')}
            </Link>
            .
          </p>

          <p className="text-muted-foreground text-center text-sm">
            {t('auth.haveAccount')}{' '}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-foreground font-medium hover:underline"
              >
                {t('auth.signIn')}
              </button>
            ) : (
              <Link
                href="/login"
                className="text-foreground font-medium hover:underline"
              >
                {t('auth.signIn')}
              </Link>
            )}
          </p>
        </form>
      </Form>
    </div>
  )
}
