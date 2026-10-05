'use client'

import { useEffect, useState } from 'react'
import type { Translator } from '@/lib/app-i18n/translate'
import { useAppT } from '@/lib/app-i18n/client'

type GreetingHeadingProps = {
  studentName: string
}

function getTimeOfDayGreeting(hour: number, t: Translator): string {
  if (hour < 12) return t('dashboard.greeting.morning')
  if (hour < 18) return t('dashboard.greeting.afternoon')
  return t('dashboard.greeting.evening')
}

// Time-of-day greeting depends on the student's local clock, which the
// server can't know — rendering it client-side after mount (with a neutral
// server-safe fallback) avoids guessing the wrong time of day from server
// time, at the cost of a one-frame upgrade after hydration.
export function GreetingHeading({ studentName }: GreetingHeadingProps): React.JSX.Element {
  const t = useAppT()
  const [greeting, setGreeting] = useState<string | null>(null)

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting(new Date().getHours(), t))
  }, [t])

  return (
    <h1 className="text-2xl font-semibold tracking-tight">
      {t('dashboard.greeting.line', { greeting: greeting ?? t('dashboard.greeting.welcomeBack'), name: studentName })}
    </h1>
  )
}
