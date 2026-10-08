'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { disablePushReminders, enablePushReminders, setReminderTime, type ReminderSettings } from '../actions'
import { DEFAULT_REMINDER } from '../reminders'

type Support = 'checking' | 'ok' | 'ios-install' | 'unsupported'

function detectSupport(): Support {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  const capable = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  if (ios && !standalone) return 'ios-install'
  return capable ? 'ok' : 'unsupported'
}

function base64UrlToUint8(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(padded)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

const TIMES = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => {
  const minutes = 6 * 60 + i * 15
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
})

function label(time: string): string {
  const [h, m] = time.split(':').map(Number) as [number, number]
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

/**
 * Daily reminders (Phase 3) — turning phone notifications on, with a chosen
 * time. Shown on the Day 1 celebration ("celebration") and in Settings
 * ("settings"). Permission is only ever asked for on a tap.
 */
export function ReminderOptIn({ variant, initial, onDone }: { variant: 'celebration' | 'settings'; initial?: ReminderSettings; onDone?: () => void }): React.JSX.Element | null {
  const t = useAppT()
  const [support, setSupport] = useState<Support>('checking')
  const [time, setTime] = useState(initial?.time ?? DEFAULT_REMINDER)
  const [enabled, setEnabled] = useState(initial?.pushEnabled === true && (initial?.devices ?? 0) > 0)
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => setSupport(detectSupport()), [])

  async function turnOn(): Promise<void> {
    setBusy(true)
    setNote(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return setNote({ text: t('dashboard.reminders.optin.denied'), error: true })
      const registration = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register('/sw.js'))
      await navigator.serviceWorker.ready
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!key) return setNote({ text: t('dashboard.reminders.settings.error'), error: true })
      const subscription = (await registration.pushManager.getSubscription()) ?? (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToUint8(key) }))
      const json = subscription.toJSON()
      const res = await enablePushReminders({ subscription: { endpoint: json.endpoint, keys: json.keys }, time, deviceLabel: navigator.userAgent.slice(0, 120) })
      if (!res.ok) return setNote({ text: t('dashboard.reminders.settings.error'), error: true })
      setEnabled(true)
      setNote({ text: t('dashboard.reminders.optin.on', { time: label(time) }), error: false })
    } catch {
      setNote({ text: t('dashboard.reminders.settings.error'), error: true })
    } finally {
      setBusy(false)
    }
  }

  async function turnOff(): Promise<void> {
    setBusy(true)
    const registration = await navigator.serviceWorker.getRegistration().catch(() => undefined)
    const subscription = await registration?.pushManager.getSubscription().catch(() => null)
    const res = await disablePushReminders(subscription ? { endpoint: subscription.endpoint } : {})
    await subscription?.unsubscribe().catch(() => false)
    setBusy(false)
    if (!res.ok) return setNote({ text: t('dashboard.reminders.settings.error'), error: true })
    setEnabled(false)
    setNote(null)
  }

  async function saveTime(next: string): Promise<void> {
    setTime(next)
    if (!enabled) return
    const res = await setReminderTime({ time: next })
    setNote(res.ok ? { text: t('dashboard.reminders.optin.on', { time: label(next) }), error: false } : { text: t('dashboard.reminders.settings.error'), error: true })
  }

  if (support === 'checking') return null
  if (initial?.adminDisabled) return <p className="text-sm text-muted-foreground">{t('dashboard.reminders.settings.adminOff')}</p>

  const timePicker = (
    <label className="flex flex-col gap-1 text-sm font-medium text-foreground" htmlFor={`reminder-time-${variant}`}>
      {t('dashboard.reminders.optin.time')}
      <select id={`reminder-time-${variant}`} className="min-h-11 rounded-xl border border-border bg-background px-3 text-base" value={time} onChange={(e) => void saveTime(e.target.value)} data-reminder-time>
        {TIMES.map((x) => (
          <option key={x} value={x}>
            {label(x)}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div className={`flex w-full flex-col gap-3 text-left ${variant === 'celebration' ? 'max-w-sm rounded-2xl border border-border/60 bg-background/80 p-4' : ''}`} data-reminder-optin={variant} data-reminder-support={support} data-reminder-enabled={enabled}>
      {variant === 'celebration' && <p className="font-semibold text-foreground">{t('dashboard.reminders.optin.title')}</p>}
      {variant === 'celebration' && <p className="text-sm text-muted-foreground">{t('dashboard.reminders.optin.body')}</p>}
      {support === 'ios-install' ? (
        <div className="rounded-xl bg-muted/60 p-3 text-sm" data-reminder-ios-steps>
          <p className="font-semibold text-foreground">{t('dashboard.reminders.optin.iosTitle')}</p>
          <p className="mt-1 text-muted-foreground">{t('dashboard.reminders.optin.iosSteps')}</p>
        </div>
      ) : support === 'unsupported' ? (
        <p className="text-sm text-muted-foreground">{t('dashboard.reminders.optin.unsupported')}</p>
      ) : (
        <>
          {timePicker}
          {enabled ? (
            <Button variant="outline" size="lg" className="min-h-11 rounded-full" disabled={busy} onClick={() => void turnOff()} data-reminder-off>
              {t('dashboard.reminders.settings.turnOff')}
            </Button>
          ) : (
            <Button size="lg" className="min-h-11 rounded-full" disabled={busy} onClick={() => void turnOn()} data-reminder-on>
              {t('dashboard.reminders.optin.turnOn')}
            </Button>
          )}
          {!enabled && <p className="text-xs text-muted-foreground">{t('dashboard.reminders.optin.androidHow')}</p>}
        </>
      )}
      {variant === 'celebration' && !enabled && onDone && (
        <button type="button" className="self-center text-xs font-medium text-muted-foreground hover:text-foreground" onClick={onDone}>
          {t('dashboard.reminders.optin.notNow')}
        </button>
      )}
      {note !== null && (
        <p className={`text-sm ${note.error ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-400'}`} role={note.error ? 'alert' : 'status'}>
          {note.text}
        </p>
      )}
    </div>
  )
}
