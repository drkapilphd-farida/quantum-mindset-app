import AppI18nRoot from '@/lib/app-i18n/AppI18nRoot'

// Every exercise screen renders in the learner's chosen app language.
export default function LabsLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AppI18nRoot>{children}</AppI18nRoot>
}
