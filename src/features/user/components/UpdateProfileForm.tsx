'use client'

import { useMemo, useTransition } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
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
import { updateProfile } from '../actions/updateProfile'

type FormValues = { fullName: string }

type UpdateProfileFormProps = {
  defaultFullName: string
}

export function UpdateProfileForm({
  defaultFullName,
}: UpdateProfileFormProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const t = useAppT()
  const schema = useMemo(
    () => z.object({ fullName: z.string().min(2, t('settings.profile.nameTooShort')).max(100, t('settings.profile.nameTooLong')) }),
    [t],
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: defaultFullName },
  })

  function onSubmit(values: FormValues): void {
    startTransition(async () => {
      const result = await updateProfile(values)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(t('settings.profile.updated'))
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.profile.fullName')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('settings.profile.placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? t('settings.profile.saving') : t('settings.profile.save')}
        </Button>
      </form>
    </Form>
  )
}
