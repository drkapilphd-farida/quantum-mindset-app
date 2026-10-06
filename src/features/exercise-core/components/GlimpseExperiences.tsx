'use client'

import { useAppI18n } from '@/lib/app-i18n/client'
import { practiceContentLang } from '@/lib/app-i18n/practiceContent'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { flashMs, ROUNDS_PER_SESSION, SYMBOLS, type GlimpseMode } from '../glimpseTraining'
import type { PassageLang } from '../readingPassages'
import { AdaptiveExerciseShell, type SessionSummary } from './AdaptiveExerciseShell'
import { GlimpseRound } from './GlimpseRound'

type Props = { onComplete?: (accuracyPercent: number, session: SessionSummary) => void; onExit?: () => void }

const EXERCISE_IDS: Record<GlimpseMode, string> = {
  span: 'rapid-visual-span-expander',
  peripheral: 'peripheral-flash-expander',
  phrase: 'quantum-tachistoscope-multi-word-blast',
  blink: 'blink-trigger-micro-recall',
}

function DemoStage({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <div className="relative flex size-36 items-center justify-center rounded-2xl border border-border/60 bg-card">{children}</div>
}

function Glimpse({ mode, onComplete, onExit }: Props & { mode: GlimpseMode }): React.JSX.Element {
  const { t, lang } = useAppI18n()
  const usesWords = mode === 'phrase' || mode === 'blink'
  const contentLang = practiceContentLang(lang, 'chunkPassages') as PassageLang
  const k = (key: string): MessageKey => `training.glimpse.${mode}.${key}` as MessageKey
  const sample = SYMBOLS.slice(0, 4)
  return (
    <AdaptiveExerciseShell
      exerciseId={EXERCISE_IDS[mode]}
      title={t(k('title'))}
      skill={t('training.skills.focus')}
      purpose={t(k('purpose'))}
      minutes={2}
      demo={[
        {
          caption: t('training.glimpse.demo1'),
          visual: (
            <DemoStage>
              <span className="size-2.5 rounded-full bg-primary" />
            </DemoStage>
          ),
        },
        {
          caption: t(k('demo2')),
          visual: (
            <DemoStage>
              <span className="size-2.5 rounded-full bg-primary" />
              {usesWords ? (
                <span className="absolute font-semibold text-foreground" lang={contentLang}>
                  {contentLang === 'hi' ? 'मधुमक्खी' : 'honeybee'}
                </span>
              ) : (
                <span className="absolute top-3 left-4 text-3xl" style={{ color: sample[0]!.color }}>
                  {sample[0]!.char}
                </span>
              )}
            </DemoStage>
          ),
        },
        {
          caption: t('training.glimpse.demo3'),
          visual: (
            <div className="grid grid-cols-4 gap-1.5">
              {sample.map((s, i) => (
                <span key={s.id} className={`flex size-11 items-center justify-center rounded-xl border-2 text-2xl ${i === 0 ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'}`} style={{ color: s.color }}>
                  {s.char}
                </span>
              ))}
            </div>
          ),
        },
      ]}
      roundsPerSession={ROUNDS_PER_SESSION}
      scoreLabel={t('training.shell.points')}
      {...(usesWords ? { contentLang, introNote: <PracticeTextNote kind="chunkPassages" /> } : {})}
      describeLevel={(level) => t('training.glimpse.levelHint', { ms: flashMs(mode, level) })}
      renderRound={({ level, isPractice, onDone }) => <GlimpseRound mode={mode} level={level} isPractice={isPractice} lang={contentLang} onDone={onDone} />}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}

// The four focus warm-ups that used to be watch-only, now with an answer step,
// 10 levels and a saved score. Same exercise ids, so history stays continuous.
export function RapidVisualSpanGlimpse(props: Props): React.JSX.Element {
  return <Glimpse mode="span" {...props} />
}
export function PeripheralFlashGlimpse(props: Props): React.JSX.Element {
  return <Glimpse mode="peripheral" {...props} />
}
export function MultiWordFlashGlimpse(props: Props): React.JSX.Element {
  return <Glimpse mode="phrase" {...props} />
}
export function BlinkRecallGlimpse(props: Props): React.JSX.Element {
  return <Glimpse mode="blink" {...props} />
}
