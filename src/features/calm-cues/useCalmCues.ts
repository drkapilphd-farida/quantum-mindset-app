'use client'

import { useCallback, useEffect } from 'react'
import { useAppI18n } from '@/lib/app-i18n/client'
import { playPrefs } from '@/components/play/playPrefs'

// Voice + chime + vibration cues for the calm screens (eye break, Calm
// Breathing, the "I'm tired" break), so the learner can close their eyes and
// still know what to do. Voice: Sarvam "shubh", recorded per language into
// public/audio/calm-cues/<lang>/<cue>.mp3 (scripts in ./script). Voice and
// chime follow the app sound setting; vibration has its own switch.
export type CalmCue = 'eyeFar' | 'eyePalm' | 'eyeDone' | 'getReady' | 'breatheIn' | 'breathePause' | 'breatheOut' | 'breatheDone' | 'breakStart' | 'breakDone'

const FINAL: ReadonlySet<CalmCue> = new Set(['eyeDone', 'breatheDone', 'breakDone'])
const VOICE_AFTER_CHIME_MS = 350

// One shared audio element: once a tap has "unlocked" it, phones let it play
// later cues that start from a timer, not a tap.
let voice: HTMLAudioElement | null = null
let unlocked = false
let chimeCtx: AudioContext | null = null
let pendingVoice: number | undefined
// A closing cue ("Done") keeps playing after its screen closes.
let lastWasFinal = false

function voiceElement(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null
  voice ??= new Audio()
  return voice
}

function audioContext(): AudioContext | null {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    chimeCtx ??= new Ctx()
    return chimeCtx
  } catch {
    return null
  }
}

function unlock(): void {
  if (unlocked) return
  unlocked = true
  const a = voiceElement()
  if (a !== null) {
    const silent = '/audio/calm-cues/en/breathePause.mp3'
    a.muted = true
    a.src = silent
    a.play()
      .then(() => {
        // A real cue may already have taken over the element — leave it playing.
        if (a.src.endsWith(silent)) a.pause()
        a.muted = false
      })
      .catch(() => {
        a.muted = false
      })
  }
  void audioContext()?.resume().catch(() => undefined)
}

/** A soft bell: one sine note with a long, gentle fade (two notes at the end). */
function chime(final: boolean): void {
  const ctx = audioContext()
  if (ctx === null) return
  try {
    const notes = final ? [528, 792] : [528]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.18
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 1.25)
    })
  } catch {
    // no audio — the screen still shows the phase
  }
}

function buzz(final: boolean): void {
  if (typeof navigator === 'undefined' || !playPrefs.vibrate() || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(final ? [60, 90, 60] : 40)
  } catch {
    // not allowed — ignore
  }
}

/** Returns play(cue). Any tap on the page unlocks audio for later timed cues. */
export function useCalmCues(): (cue: CalmCue) => void {
  const { lang } = useAppI18n()

  useEffect(() => {
    if (unlocked) return undefined
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  // Leaving the screen stops a cue mid-sentence.
  useEffect(
    () => () => {
      if (lastWasFinal) return
      window.clearTimeout(pendingVoice)
      voice?.pause()
    },
    [],
  )

  return useCallback(
    (cue: CalmCue) => {
      const final = FINAL.has(cue)
      lastWasFinal = final
      buzz(final)
      if (!playPrefs.sound()) return
      chime(final)
      const a = voiceElement()
      if (a === null) return
      window.clearTimeout(pendingVoice)
      a.pause()
      pendingVoice = window.setTimeout(() => {
        a.src = `/audio/calm-cues/${lang}/${cue}.mp3`
        a.play().catch(() => undefined)
      }, VOICE_AFTER_CHIME_MS)
    },
    [lang],
  )
}

/** Keeps the screen on while `active` (phones that support it); re-asks after the tab comes back. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return undefined
    let lock: WakeLockSentinel | null = null
    let cancelled = false
    const request = async (): Promise<void> => {
      try {
        const next = await navigator.wakeLock.request('screen')
        if (cancelled) void next.release()
        else lock = next
      } catch {
        // battery saver or not allowed — the screen may dim, cues still play
      }
    }
    void request()
    const onVisible = (): void => {
      if (document.visibilityState === 'visible' && !cancelled) void request()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void lock?.release().catch(() => undefined)
    }
  }, [active])
}
