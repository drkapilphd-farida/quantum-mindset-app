'use client'

import { useMemo, useTransition } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { updatePassword } from '../actions/updatePassword'

type FormValues = { password: string; confirmPassword: string }

type UpdatePasswordFormProps = {
  redirectAfterSuccess?: string | undefined
}

export function UpdatePasswordForm({
  redirectAfterSuccess,
}: UpdatePasswordFormProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useAppT()
  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, t('settings.password.tooShort')),
          confirmPassword: z.string().min(1, t('settings.password.confirmRequired')),
        })
        .refine((d) => d.password === d.confirmPassword, {
          message: t('settings.password.mismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  function onSubmit(values: FormValues): void {
    startTransition(async () => {
      const result = await updatePassword(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(t('settings.password.updated'))
      if (redirectAfterSuccess !== undefined) {
        router.push(redirectAfterSuccess)
      } else {
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.password.newPassword')}</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder={t('settings.password.minPlaceholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.password.confirm')}</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder={t('settings.password.repeatPlaceholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('settings.password.updating') : t('settings.password.update')}
        </Button>
      </form>
    </Form>
  )
}
