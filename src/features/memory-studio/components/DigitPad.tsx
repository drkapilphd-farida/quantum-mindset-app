'use client'

import { useState } from 'react'
import { Delete } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'

// Type a number on big keys (no phone keyboard popping up and covering the screen).
export function DigitPad({ length, onSubmit }: { length: number; onSubmit: (digits: string) => void }): React.JSX.Element {
  const t = useAppT()
  const [value, setValue] = useState('')
  const press = (d: string): void => setValue((v) => (v.length < length ? v + d : v))
  return (
    <div className="flex flex-col gap-3" data-digit-pad={length}>
      <div className="flex flex-wrap justify-center gap-1" aria-live="polite">
        {Array.from({ length }, (_, i) => (
          <span key={i} className={`flex h-11 w-7 items-center justify-center rounded-md border-2 font-heading text-xl font-bold tabular-nums ${i === value.length ? 'border-primary' : 'border-border/60'} ${i % 2 === 1 && i < length - 1 ? 'mr-2' : ''}`}>
            {value[i] ?? ''}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} className="min-h-12 rounded-xl border border-border/60 bg-background text-xl font-semibold text-foreground active:bg-muted" data-digit={d}>
            {d}
          </button>
        ))}
        <button type="button" onClick={() => setValue((v) => v.slice(0, -1))} aria-label={t('training.studio.undo')} className="flex min-h-12 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground active:bg-muted">
          <Delete className="size-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => press('0')} className="min-h-12 rounded-xl border border-border/60 bg-background text-xl font-semibold text-foreground active:bg-muted" data-digit="0">
          0
        </button>
        <span />
      </div>
      <Button size="lg" className="min-h-12 rounded-full" disabled={value.length === 0} onClick={() => onSubmit(value)} data-digit-check="true">
        {t('training.studio.check')}
      </Button>
    </div>
  )
}
