'use client'

import { useUiLang } from '@/lib/app-i18n/client'
import { LANGUAGES } from '@/lib/app-i18n/languages'

// The "play" design scope (13 Oct 2026): Sunny Playground in light, Night Sky
// in dark. Carries the learner's language so headings use that script's
// Baloo font (the page's own lang attribute stays "en").
export function PlayScope({ children, className = '' }: { children: React.ReactNode; className?: string }): React.JSX.Element {
  const lang = useUiLang()
  return (
    <div className={`play ${className}`} data-lang={lang} lang={LANGUAGES[lang].htmlLang}>
      {children}
    </div>
  )
}
