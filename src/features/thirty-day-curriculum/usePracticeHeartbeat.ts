'use client'

import { useEffect, useRef, useState } from 'react'
import { recordPracticeBeat } from './actions/paceActions'
import { AUDIO_IDLE_PAUSE_MS, BEAT_INTERVAL_MS, IDLE_PAUSE_MS } from './paceControl'

/**
 * Pace control: while a day's step is open, on screen and in use, the app
 * tells the server every 30 s; the server adds the real time since the last
 * beat (capped), so practice time can never grow faster than the clock.
 * Pauses when the screen is hidden, or after 2 minutes without a touch or
 * key (12 minutes on audio-guided steps). Returns the day's total seconds,
 * ticking locally between beats so a visible timer stays smooth.
 */
export function usePracticeHeartbeat(day: number, enabled: boolean, audioGuided = false, initialSeconds = 0): number {
  // Shown time = the server's total + active seconds since the last beat.
  const [serverSeconds, setServerSeconds] = useState(initialSeconds)
  const [sinceSync, setSinceSync] = useState(0)
  const lastInput = useRef(Date.now())
  const audioRef = useRef(audioGuided)
  audioRef.current = audioGuided

  useEffect(() => {
    setServerSeconds((s) => Math.max(s, initialSeconds))
  }, [initialSeconds])

  useEffect(() => {
    if (!enabled) return
    const mark = (): void => {
      lastInput.current = Date.now()
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const
    for (const e of events) window.addEventListener(e, mark, { passive: true, capture: true })
    const active = (): boolean => document.visibilityState === 'visible' && Date.now() - lastInput.current < (audioRef.current ? AUDIO_IDLE_PAUSE_MS : IDLE_PAUSE_MS)
    const beat = (): void => {
      if (!active()) return
      void recordPracticeBeat({ day })
        .then((res) => {
          setServerSeconds(res.activeSeconds)
          setSinceSync(0)
        })
        .catch(() => undefined)
    }
    beat() // starts the count (the first beat credits nothing)
    const beatTimer = window.setInterval(beat, BEAT_INTERVAL_MS)
    const tick = window.setInterval(() => {
      if (active()) setSinceSync((s) => Math.min(s + 1, 45))
    }, 1000)
    const onVisible = (): void => {
      if (document.visibilityState === 'visible') {
        mark()
        beat()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      for (const e of events) window.removeEventListener(e, mark, { capture: true })
      window.clearInterval(beatTimer)
      window.clearInterval(tick)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [day, enabled])

  return serverSeconds + sinceSync
}
