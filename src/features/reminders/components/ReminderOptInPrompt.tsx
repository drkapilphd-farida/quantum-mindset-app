'use client'

import { useEffect, useState } from 'react'
import { getReminderSettings, type ReminderSettings } from '../actions'
import { ReminderOptIn } from './ReminderOptIn'

/** The Day 1 offer: shown once after Day 1, unless reminders are already on. */
export function ReminderOptInPrompt({ onDone }: { onDone: () => void }): React.JSX.Element | null {
  const [settings, setSettings] = useState<ReminderSettings | null>(null)
  useEffect(() => {
    void getReminderSettings().then(setSettings)
  }, [])
  if (settings === null || (settings.pushEnabled && settings.devices > 0) || settings.adminDisabled) return null
  return (
    <div className="mx-auto mt-6 flex w-full max-w-3xl justify-center px-4" data-reminder-prompt="day1">
      <ReminderOptIn variant="celebration" initial={settings} onDone={onDone} />
    </div>
  )
}
