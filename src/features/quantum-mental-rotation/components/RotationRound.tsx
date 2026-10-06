'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, RotateCcw, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey, Translator } from '@/lib/app-i18n/translate'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { getColorSwatch, type ColorName, type Face, type RotationType } from '../quantumMentalRotationDataset'
import { buildTrial, PRACTICE_TRIALS, rotationLevel, trialPoints, TRIALS_PER_ROUND, type CubeTrial, type FlatTrial, type RotationTrial } from '../rotationTraining'
import { ColourCube, FlatShapeView } from './RotationVisuals'

export function colourName(t: Translator, colour: ColorName): string {
  return t(`training.rotation.colours.${colour}` as MessageKey)
}

export function faceName(t: Translator, face: Face): string {
  return t(`training.rotation.faces.${face}` as MessageKey)
}

function turnInstruction(t: Translator, angle: number): string {
  const a = Math.abs(angle)
  if (a === 180) return t('training.rotation.turnHalf')
  return angle > 0 ? t('training.rotation.turnRight', { deg: a }) : t('training.rotation.turnLeft', { deg: a })
}

export function cubeTurnText(t: Translator, turn: RotationType): string {
  if (turn === 'yaw-right') return t('training.rotation.cubeRight')
  if (turn === 'yaw-left') return t('training.rotation.cubeLeft')
  if (turn === 'yaw-180') return t('training.rotation.cubeHalf')
  return t('training.rotation.cubeFlip')
}

type Answer = { chosen: number | null; ms: number }

const NO_TURNS: readonly RotationType[] = []

export function RotationRound({ level, isPractice, onDone }: { level: number; isPractice: boolean; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const count = isPractice ? PRACTICE_TRIALS : TRIALS_PER_ROUND
  const trials = useMemo(() => Array.from({ length: count }, () => buildTrial(level)), [count, level])
  const timeLimit = rotationLevel(level).timeLimitMs
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [remaining, setRemaining] = useState<number | null>(timeLimit)
  const shownAtRef = useRef(0)

  const trial = trials[index]
  const answer = answers[index]

  useEffect(() => {
    shownAtRef.current = performance.now()
    setRemaining(timeLimit)
    if (timeLimit === null) return undefined
    const id = setInterval(() => {
      const left = timeLimit - (performance.now() - shownAtRef.current)
      setRemaining(Math.max(0, left))
      if (left <= 0) {
        clearInterval(id)
        setAnswers((prev) => (prev[index] === undefined ? [...prev, { chosen: null, ms: timeLimit }] : prev))
      }
    }, 200)
    return () => clearInterval(id)
  }, [index, timeLimit])

  function choose(option: number): void {
    if (answer !== undefined) return
    setAnswers((prev) => (prev[index] === undefined ? [...prev, { chosen: option, ms: performance.now() - shownAtRef.current }] : prev))
  }

  function next(): void {
    if (index + 1 < trials.length) {
      setIndex(index + 1)
      return
    }
    const results = trials.map((tr, i) => {
      const a = answers[i]
      const correct = a !== undefined && a.chosen === tr.correctIndex
      return { correct, points: trialPoints(level, correct, a?.ms ?? 99_999), ms: a?.ms ?? 0 }
    })
    const correctMs = results.filter((r) => r.correct).map((r) => r.ms)
    onDone({
      correct: results.filter((r) => r.correct).length,
      total: results.length,
      score: results.reduce((s, r) => s + r.points, 0),
      ...(correctMs.length > 0 ? { metrics: { answerMs: correctMs.reduce((a, b) => a + b, 0) / correctMs.length } } : {}),
    })
  }

  if (trial === undefined) return <div />
  const isAnswered = answer !== undefined
  const isCorrect = isAnswered && answer.chosen === trial.correctIndex

  return (
    <div className="flex w-full flex-col items-center gap-3" data-rotation-trial={index} data-family={trial.family}>
      <p className="text-xs text-muted-foreground">{t('training.rotation.questionOf', { n: index + 1, total: trials.length })}</p>
      {timeLimit !== null && !isAnswered && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full bg-primary/60 transition-[width] duration-200 ease-linear" style={{ width: `${((remaining ?? 0) / timeLimit) * 100}%` }} />
        </div>
      )}
      {trial.family === 'cube' ? (
        <CubeQuestion trial={trial} answer={answer} onChoose={choose} />
      ) : (
        <FlatQuestion trial={trial} answer={answer} onChoose={choose} />
      )}
      {isAnswered && (
        <div className="flex w-full flex-col items-center gap-2" data-answer={isCorrect ? 'correct' : 'wrong'}>
          <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`} aria-live="polite">
            {isCorrect ? t('training.shell.correct') : answer.chosen === null ? t('training.rotation.timeUp') : t('training.shell.notQuite')}
          </p>
          <Button className="w-full rounded-full" size="lg" onClick={next} data-next-trial="true">
            {t('training.shell.next')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

function optionClass(i: number, answer: Answer | undefined, correctIndex: number): string {
  if (answer === undefined) return 'border-border hover:border-primary/60 active:scale-95'
  if (i === correctIndex) return 'border-emerald-500 bg-emerald-500/10'
  if (i === answer.chosen) return 'border-amber-500 bg-amber-500/10 opacity-80'
  return 'border-border opacity-40'
}

function FlatQuestion({ trial, answer, onChoose }: { trial: FlatTrial; answer: Answer | undefined; onChoose: (i: number) => void }): React.JSX.Element {
  const t = useAppT()
  const correct = trial.options[trial.correctIndex]
  const optionSize = trial.options.length > 3 ? 72 : 88
  return (
    <>
      <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3">
        {answer === undefined || correct === undefined ? (
          <FlatShapeView shape={trial.shape} view={{ angle: 0, mirrored: false }} size={112} />
        ) : trial.family === 'turn' ? (
          // Explanation: the original turns into the right answer.
          <FlatShapeView shape={trial.shape} view={correct} animateFrom={0} size={112} />
        ) : (
          // Explanation: the right answer turns back into the original.
          <FlatShapeView shape={trial.shape} view={{ angle: 0, mirrored: false }} animateFrom={correct.angle} size={112} />
        )}
        {trial.family === 'turn' && (
          <div className="flex max-w-36 flex-col items-center gap-1 text-center">
            {trial.angle > 0 || Math.abs(trial.angle) === 180 ? <RotateCw className="size-7 text-primary" aria-hidden="true" /> : <RotateCcw className="size-7 text-primary" aria-hidden="true" />}
            <p className="text-sm font-semibold text-foreground" data-instruction="true">
              {turnInstruction(t, trial.angle)}
            </p>
          </div>
        )}
      </div>
      <p className="text-center text-sm font-medium text-foreground">
        {answer === undefined
          ? trial.family === 'turn'
            ? t('training.rotation.whichResult')
            : t('training.rotation.whichSame')
          : trial.family === 'turn'
            ? t('training.rotation.explainTurn', { turn: turnInstruction(t, trial.angle) })
            : t('training.rotation.explainMatch')}
      </p>
      <div className="flex w-full flex-wrap justify-center gap-2" role="group" aria-label={t('training.rotation.options')}>
        {trial.options.map((view, i) => (
          <button
            key={`${view.angle}-${view.mirrored}`}
            type="button"
            onClick={() => onChoose(i)}
            disabled={answer !== undefined}
            aria-label={t('training.rotation.optionN', { n: i + 1 })}
            className={`rounded-2xl border-2 bg-card p-1 transition-all ${optionClass(i, answer, trial.correctIndex)}`}
            data-option={i}
            data-correct={i === trial.correctIndex ? 'true' : undefined}
          >
            <FlatShapeView shape={trial.shape} view={view} size={optionSize} />
          </button>
        ))}
      </div>
    </>
  )
}

function CubeQuestion({ trial, answer, onChoose }: { trial: CubeTrial; answer: Answer | undefined; onChoose: (i: number) => void }): React.JSX.Element {
  const t = useAppT()
  const hidden: readonly Face[] = ['back', 'bottom', 'left']
  const turnsText = trial.turns.length === 2 ? t('training.rotation.thenTurn', { first: cubeTurnText(t, trial.turns[0]!), second: cubeTurnText(t, trial.turns[1]!) }) : cubeTurnText(t, trial.turns[0]!)
  const correctColour = trial.options[trial.correctIndex]
  return (
    <>
      <div className="flex w-full flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/60 p-2">
        <ColourCube state={trial.initial} turns={answer === undefined ? NO_TURNS : trial.turns} size={72} />
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span>{t('training.rotation.hiddenSides')}</span>
          {hidden.map((face) => (
            <span key={face} className="flex items-center gap-1">
              <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: getColorSwatch(trial.initial[face]).hex }} aria-hidden="true" />
              {faceName(t, face)}: {colourName(t, trial.initial[face])}
            </span>
          ))}
        </div>
      </div>
      <p className="text-center text-sm font-semibold text-foreground" data-instruction="true">
        {turnsText}
      </p>
      <p className="text-center text-sm text-foreground">
        {answer === undefined || correctColour === undefined
          ? t('training.rotation.whichColour', { face: faceName(t, trial.askFace) })
          : t('training.rotation.explainCube', { face: faceName(t, trial.askFace), colour: colourName(t, correctColour) })}
      </p>
      <div className="grid w-full grid-cols-2 gap-2" role="group" aria-label={t('training.rotation.options')}>
        {trial.options.map((colour, i) => (
          <button
            key={colour}
            type="button"
            onClick={() => onChoose(i)}
            disabled={answer !== undefined}
            className={`flex items-center gap-2 rounded-2xl border-2 bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-all ${optionClass(i, answer, trial.correctIndex)}`}
            data-option={i}
            data-correct={i === trial.correctIndex ? 'true' : undefined}
          >
            <span className="size-5 shrink-0 rounded-md" style={{ backgroundColor: getColorSwatch(colour).hex }} aria-hidden="true" />
            {colourName(t, colour)}
          </button>
        ))}
      </div>
    </>
  )
}

export type { RotationTrial }
