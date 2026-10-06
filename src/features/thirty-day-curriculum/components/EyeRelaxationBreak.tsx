'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Eye, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'

const LOOK_FAR_S = 20
const TOTAL_S = 30

// Optional 30-second eye relaxation break, offered before reading exercises:
// the 20-20-20 habit (look about 6 metres away for 20 seconds), then 10
// seconds of palming. Always skippable, no score, no claims — just comfort.
export function EyeRelaxationBreak({ onDone }: { onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running) return undefined
    const startedAt = Date.now()
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000)
      setElapsed(s)
      if (s >= TOTAL_S) {
        clearInterval(id)
        onDone()
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, onDone])

  const lookFar = elapsed < LOOK_FAR_S
  const left = running ? (lookFar ? LOOK_FAR_S - elapsed : TOTAL_S - elapsed) : TOTAL_S

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-sm flex-col items-center justify-center gap-4 px-6 py-10 text-center" data-eye-break={running ? 'running' : 'offer'}>
      <div className="flex size-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300">
        <Eye className="size-6" aria-hidden="true" />
      </div>
      {!running ? (
        <>
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t('training.eyeBreak.optional')}</p>
            <h3 className="mt-1 font-heading text-xl font-bold tracking-tight text-foreground">{t('training.eyeBreak.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('training.eyeBreak.intro')}</p>
          </div>
          <Button size="lg" className="w-full rounded-full" onClick={() => setRunning(true)} data-eye-break-start="true">
            {t('training.eyeBreak.start')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <button type="button" onClick={onDone} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground" data-eye-break-skip="true">
            {t('training.eyeBreak.skip')}
            <SkipForward className="size-3.5" aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <p className="font-heading text-xl font-bold text-foreground" aria-live="polite">
            {lookFar ? t('training.eyeBreak.lookFar') : t('training.eyeBreak.palming')}
          </p>
          <p className="text-sm text-muted-foreground">{lookFar ? t('training.eyeBreak.lookFarHint') : t('training.eyeBreak.palmingHint')}</p>
          <p className="font-heading text-4xl font-bold tabular-nums text-foreground">{Math.max(0, left)}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
            <div className="h-full rounded-full bg-sky-500/70 transition-[width] duration-300 ease-linear" style={{ width: `${Math.min(100, (elapsed / TOTAL_S) * 100)}%` }} />
          </div>
          <button type="button" onClick={onDone} className="text-xs font-medium text-muted-foreground hover:text-foreground">
            {t('training.eyeBreak.skip')}
          </button>
        </>
      )}
    </div>
  )
}
