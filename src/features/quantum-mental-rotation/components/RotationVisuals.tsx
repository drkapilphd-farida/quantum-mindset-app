'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'
import { getColorSwatch, type CubeState, type Face, type RotationType } from '../quantumMentalRotationDataset'
import { cubeTurnCss, type FlatShape, type FlatView } from '../rotationTraining'

const CELL = 20
const GAP = 2

/** A flat shape drawn turned/mirrored. Big enough to hold the shape at any angle. */
export function FlatShapeView({
  shape,
  view,
  size = 96,
  animateFrom,
  durationMs = 1400,
}: {
  shape: FlatShape
  view: FlatView
  size?: number
  /** When set, the shape starts at this angle and turns to view.angle (the explanation). */
  animateFrom?: number
  durationMs?: number
}): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion()
  const [angle, setAngle] = useState(animateFrom ?? view.angle)
  useEffect(() => {
    if (animateFrom === undefined) {
      setAngle(view.angle)
      return undefined
    }
    setAngle(animateFrom)
    const id = setTimeout(() => setAngle(view.angle), 350)
    return () => clearTimeout(id)
  }, [animateFrom, view.angle])

  const xs = shape.cells.map((c) => c[0])
  const ys = shape.cells.map((c) => c[1])
  const w = (Math.max(...xs) + 1) * CELL
  const h = (Math.max(...ys) + 1) * CELL
  const box = Math.ceil(Math.hypot(w, h)) + CELL
  const offX = (box - w) / 2
  const offY = (box - h) / 2
  const mark = shape.cells[shape.markCell]

  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={size} height={size} aria-hidden="true">
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: 'center',
          transform: `rotate(${angle}deg)`,
          transition: reducedMotion || animateFrom === undefined ? 'none' : `transform ${durationMs}ms ease-in-out`,
        }}
      >
        <g transform={view.mirrored ? `translate(${box} 0) scale(-1 1)` : undefined}>
          <g transform={`translate(${offX} ${offY})`}>
            {shape.cells.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x * CELL + GAP / 2} y={y * CELL + GAP / 2} width={CELL - GAP} height={CELL - GAP} rx={3} fill={shape.color} />
            ))}
            {mark !== undefined && <circle cx={mark[0] * CELL + CELL / 2} cy={mark[1] * CELL + CELL / 2} r={4.5} fill="white" />}
          </g>
        </g>
      </g>
    </svg>
  )
}

const FACE_TRANSFORMS: Record<Face, (half: number) => string> = {
  front: (h) => `translateZ(${h}px)`,
  back: (h) => `rotateY(180deg) translateZ(${h}px)`,
  right: (h) => `rotateY(90deg) translateZ(${h}px)`,
  left: (h) => `rotateY(-90deg) translateZ(${h}px)`,
  top: (h) => `rotateX(90deg) translateZ(${h}px)`,
  bottom: (h) => `rotateX(-90deg) translateZ(${h}px)`,
}

/**
 * A colour cube seen from slightly above and to the right (front, top and
 * right faces visible). With `turns` it plays those turns one after another —
 * the animated explanation of the answer.
 */
export function ColourCube({
  state,
  turns = [],
  size = 84,
}: {
  state: CubeState
  turns?: readonly RotationType[]
  size?: number
}): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion()
  const [step, setStep] = useState(0)
  useEffect(() => {
    setStep(0)
    if (turns.length === 0) return undefined
    const timers = turns.map((_, i) => setTimeout(() => setStep(i + 1), 400 + i * 1500))
    return () => timers.forEach(clearTimeout)
  }, [turns])

  // Turn i is applied in the world frame after turn i-1: CSS lists apply right-to-left.
  const slots = [1, 0]
    .filter((i) => i < Math.max(turns.length, 1))
    .map((i) => {
      const turn = turns[i]
      const css = turn !== undefined && step > i ? cubeTurnCss(turn) : { x: 0, y: 0 }
      return `rotateX(${css.x}deg) rotateY(${css.y}deg)`
    })
    .join(' ')
  const half = size / 2
  const showFinal = reducedMotion && turns.length > 0

  return (
    <div className="flex items-center justify-center" style={{ width: size * 2, height: size * 2, perspective: `${size * 8}px` }}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          transform: `rotateX(-22deg) rotateY(-35deg) ${showFinal ? turns.map((t) => cubeTurnCss(t)).reverse().map((c) => `rotateX(${c.x}deg) rotateY(${c.y}deg)`).join(' ') : slots}`,
          transition: reducedMotion ? 'none' : 'transform 1200ms ease-in-out',
        }}
      >
        {(Object.keys(FACE_TRANSFORMS) as Face[]).map((face) => (
          <div
            key={face}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: getColorSwatch(state[face]).hex,
              transform: FACE_TRANSFORMS[face](half),
              borderRadius: 6,
              border: '2px solid rgba(255,255,255,0.55)',
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
      </div>
    </div>
  )
}
