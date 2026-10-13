import AppI18nRoot from '@/lib/app-i18n/AppI18nRoot'
import { PlayScope } from '@/components/PlayScope'

// Every exercise screen renders in the learner's chosen app language.
export default function LabsLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AppI18nRoot>
      <PlayScope className="min-h-dvh">{children}</PlayScope>
    </AppI18nRoot>
  )
}
