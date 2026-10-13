'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { NarrationBar } from '@/features/guided-audio/components/NarrationBar'
import { useGuidedNarration } from '@/features/guided-audio/useGuidedNarration'
import { StudioPicture } from './StudioPicture'

export type LessonLine = { id: string; text: string; pictures?: { id: string; label: string; number?: number }[]; /** A drawing instead of pictures (e.g. a face). */ visual?: React.ReactNode }

// A 60–90-second "Learn" lesson: one caption at a time with its pictures,
// spoken by the recorded voice (EN/HI when uploaded), else the device voice,
// else shown as a timed caption. Skippable; can be watched again.
export function MethodLesson({ narrationId, title, lines, onDone }: { narrationId: string; title: string; lines: readonly LessonLine[]; onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const lang = useUiLang()
  // Recorded voice (Sarvam "shubh", as in the Memory Palace) or silent captions — never the phone's own voice.
  const narration = useGuidedNarration(narrationId, lang, { deviceVoice: false })
  const [index, setIndex] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const run = useRef(0)

  useEffect(() => () => narration.stop(), []) // eslint-disable-line react-hooks/exhaustive-deps

  async function play(): Promise<void> {
    narration.unlock()
    const token = ++run.current
    setFinished(false)
    for (let i = 0; i < lines.length; i++) {
      if (run.current !== token) return
      setIndex(i)
      await narration.speak(lines[i]!, lines[i + 1])
    }
    if (run.current === token) setFinished(true)
  }

  const line = index === null ? null : lines[index]!
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6" data-method-lesson={narrationId} data-lesson-line={index ?? -1}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.studio.learn')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {line === null ? (
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => void play()} data-lesson-start="true">
          {t('training.studio.lessonStart')}
        </Button>
      ) : (
        <>
          <div className="flex min-h-28 flex-wrap items-center justify-center gap-3">
            {line.visual}
            {line.pictures?.map((p) => <StudioPicture key={p.id} id={p.id} label={p.label} size={52} {...(p.number === undefined ? {} : { number: p.number })} />)}
          </div>
          <NarrationBar
            line={line}
            source={narration.source}
            muted={narration.muted}
            volume={narration.volume}
            onMutedChange={narration.setMuted}
            onVolumeChange={narration.setVolume}
            onReplay={narration.replay}
          />
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${Math.round((((index ?? 0) + 1) / lines.length) * 100)}%` }} />
          </div>
        </>
      )}
      <div className="flex flex-col gap-2">
        {finished && (
          <Button size="lg" className="min-h-12 rounded-full" onClick={onDone} data-lesson-done="true">
            {t('training.studio.lessonDone')}
          </Button>
        )}
        {finished && (
          <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => void play()}>
            {t('training.studio.lessonReplay')}
          </Button>
        )}
        {!finished && (
          <Button
            variant="ghost"
            size="lg"
            className="min-h-12 rounded-full"
            onClick={() => {
              run.current++
              narration.stop()
              onDone()
            }}
            data-lesson-skip="true"
          >
            {t('training.studio.lessonSkip')}
          </Button>
        )}
      </div>
    </div>
  )
}
