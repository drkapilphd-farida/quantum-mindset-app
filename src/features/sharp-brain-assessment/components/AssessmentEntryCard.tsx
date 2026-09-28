'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

// Dashboard entry to the Day 1 vs Day 30 assessment (Phase 8, Item 11).
export function AssessmentEntryCard(): React.JSX.Element {
  const { lang } = useLanguage()
  const hi = lang === 'hi'
  return (
    <Link href="/labs/sharp-brain/assessment" className="glass-premium-card flex items-center justify-between gap-4 p-5 transition-colors hover:border-foreground/30 sm:p-6">
      <span>
        <span className="block text-lg font-semibold">{hi ? 'दिन 1 बनाम दिन 30 असेसमेंट' : 'Day 1 vs Day 30 assessment'}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {hi ? 'रीडिंग स्पीड, समझ और ध्यान — अपनी प्रगति खुद देखें।' : 'Reading speed, comprehension and attention — see your own progress.'}
        </span>
      </span>
      <span aria-hidden="true" className="text-xl">
        →
      </span>
    </Link>
  )
}
