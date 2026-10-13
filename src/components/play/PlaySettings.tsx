'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Smartphone, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useAppT } from '@/lib/app-i18n/client'
import { playPrefs } from './playPrefs'

// Settings: Light / Dark / Auto (Auto follows the phone) and the light
// vibration on answers. Sound is the app-wide sound switch next to it.
export function PlaySettings(): React.JSX.Element {
  const t = useAppT()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [vibrate, setVibrate] = useState(true)
  useEffect(() => {
    setMounted(true)
    setVibrate(playPrefs.vibrate())
  }, [])
  const options = [
    { key: 'light', label: t('training.play.themeLight'), Icon: Sun },
    { key: 'dark', label: t('training.play.themeDark'), Icon: Moon },
    { key: 'system', label: t('training.play.themeAuto'), Icon: Monitor },
  ] as const
  const current = mounted ? (theme ?? 'system') : null
  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label={t('training.play.theme')} className="grid grid-cols-3 gap-2">
        {options.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={current === key}
            onClick={() => setTheme(key)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-center text-xs font-semibold ${current === key ? 'border-primary bg-primary/10 text-foreground' : 'border-border/60 text-muted-foreground'}`}
            data-theme-choice={key}
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <Smartphone className="size-4 shrink-0 text-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">{t('training.play.vibration')}</p>
        </div>
        <Switch
          checked={vibrate}
          onCheckedChange={(on) => {
            setVibrate(on)
            playPrefs.setVibrate(on)
          }}
          aria-label={t('training.play.vibration')}
        />
      </div>
    </div>
  )
}
