import AppI18nRoot from '@/lib/app-i18n/AppI18nRoot'

// The daily Practice Journey session renders in the learner's app language.
export default function UnifiedSessionLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <AppI18nRoot>{children}</AppI18nRoot>
}
