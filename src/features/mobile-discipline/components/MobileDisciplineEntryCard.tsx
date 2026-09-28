'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// Dashboard entry to Mobile Discipline (Phase 8, Item 12).
export function MobileDisciplineEntryCard(): React.JSX.Element {
  const { lang } = useLanguage()
  const hi = lang === 'hi'
  return (
    <Link href="/labs/sharp-brain/mobile-discipline" className="glass-premium-card flex items-center justify-between gap-4 p-5 transition-colors hover:border-foreground/30 sm:p-6">
      <span>
        <span className="block text-lg font-semibold">{hi ? 'मोबाइल डिसिप्लिन' : 'Mobile Discipline'}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {hi ? 'स्क्रीन-टाइम लक्ष्य, फोकस टाइमर और रोज़ का चेक-इन।' : 'Screen-time goal, focus timer and a daily check-in.'}
        </span>
      </span>
      <span aria-hidden="true" className="text-xl">
        →
      </span>
    </Link>
  )
}
