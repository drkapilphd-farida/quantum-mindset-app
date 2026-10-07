'use client'

import { RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useAppT } from '@/lib/app-i18n/client'
import type { NarrationLine } from '../useGuidedNarration'

type NarrationBarProps = {
  line: NarrationLine | null
  muted: boolean
  volume: number
  onMutedChange: (muted: boolean) => void
  onVolumeChange: (volume: number) => void
  onReplay: () => void
}

// The caption of the line being spoken, plus mute, volume and "replay this
// line". Large tap targets for phones; "..." pauses show as gentle ellipses.
export function NarrationBar({ line, muted, volume, onMutedChange, onVolumeChange, onReplay }: NarrationBarProps): React.JSX.Element {
  const t = useAppT()
  const caption = line?.text.replace(/\s*\.\.\.\s*/g, ' … ').trim() ?? ''
  return (
    <div className="flex w-full flex-col gap-3" data-narration-bar="true">
      <p className="min-h-[4.5rem] text-center text-lg leading-relaxed font-medium text-foreground" aria-live="polite" aria-label={t('training.palace.captionLabel')} data-caption-line={line?.id ?? ''}>
        {caption}
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onReplay}
          disabled={line === null}
          className="flex min-h-12 items-center gap-2 rounded-full border border-border/60 px-4 text-sm font-medium text-foreground disabled:opacity-40"
          data-replay-line="true"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t('training.palace.replay')}
        </button>
        <button
          type="button"
          onClick={() => onMutedChange(!muted)}
          aria-pressed={muted}
          aria-label={muted ? t('training.palace.unmute') : t('training.palace.mute')}
          className="flex size-12 items-center justify-center rounded-full border border-border/60 text-foreground"
          data-mute="true"
        >
          {muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label={t('training.palace.volume')}
          className="h-12 w-24 accent-primary"
          disabled={muted}
        />
      </div>
    </div>
  )
}
