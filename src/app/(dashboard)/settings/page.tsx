import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import { UpdateProfileForm } from '@/features/user/components/UpdateProfileForm'
import { UpdatePasswordForm } from '@/features/user/components/UpdatePasswordForm'
import { SoundPreferenceToggle } from '@/features/user/components/SoundPreferenceToggle'
import { listRetakeableAssessments } from '@/features/quantum-speed-reading-runtime/assessment/actions/listRetakeableAssessments'
import { RetakeAssessmentButton } from '@/features/quantum-speed-reading-runtime/assessment/components/RetakeAssessmentButton'
import { getAppT } from '@/lib/app-i18n/server'
import { LanguagePicker } from '@/lib/app-i18n/LanguagePicker'

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
}

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <div />
  const { t } = await getAppT()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name ?? ''
  const retakeableAssessments = await listRetakeableAssessments(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('settings.subtitle')}
        </p>
      </div>

      <Separator />

      <div className="max-w-md space-y-8">
        <section className="space-y-4" id="language">
          <div>
            <h2 className="text-base font-medium">{t('settings.language.title')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{t('settings.language.desc')}</p>
          </div>
          <LanguagePicker />
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-medium">{t('settings.profile.title')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('settings.profile.desc')}
            </p>
          </div>
          <UpdateProfileForm defaultFullName={fullName} />
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-medium">{t('settings.password.title')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('settings.password.desc')}
            </p>
          </div>
          <UpdatePasswordForm />
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-medium">{t('settings.sound.title')}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('settings.sound.desc')}
            </p>
          </div>
          <SoundPreferenceToggle />
        </section>

        {retakeableAssessments.length > 0 && (
          <>
            <Separator />

            <section className="space-y-4">
              <div>
                <h2 className="text-base font-medium">{t('settings.assessment.title')}</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t('settings.assessment.desc')}
                </p>
              </div>
              <ul className="space-y-3">
                {retakeableAssessments.map((assessment) => (
                  <li key={assessment.documentId} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground">{assessment.projectTitle}</span>
                    <RetakeAssessmentButton documentId={assessment.documentId} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <Separator />

        <section className="space-y-2">
          <h2 className="text-base font-medium">{t('settings.account.title')}</h2>
          <p className="text-muted-foreground text-sm">
            {t('settings.account.email')}{' '}
            <span className="text-foreground font-medium">{user.email}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
