'use client'

// Sound and vibration for answer feedback (play design). Both on by default;
// the learner can switch either off. Kept in this browser only.
const SOUND_KEY = 'play-sound'
const VIBRATE_KEY = 'play-vibrate'

function read(key: string): boolean {
  try {
    return localStorage.getItem(key) !== 'off'
  } catch {
    return true
  }
}
function write(key: string, on: boolean): void {
  try {
    localStorage.setItem(key, on ? 'on' : 'off')
  } catch {
    // storage blocked — the setting just isn't remembered
  }
}

export const playPrefs = {
  sound: (): boolean => read(SOUND_KEY),
  vibrate: (): boolean => read(VIBRATE_KEY),
  setSound: (on: boolean): void => write(SOUND_KEY, on),
  setVibrate: (on: boolean): void => write(VIBRATE_KEY, on),
}

let audio: AudioContext | null = null

/** A soft two-note chime (correct) or one low, gentle note (wrong). Never harsh, never loud. */
export function playFeedbackSound(kind: 'good' | 'warn'): void {
  if (typeof window === 'undefined' || !playPrefs.sound()) return
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    audio ??= new Ctx()
    const ctx = audio
    const notes = kind === 'good' ? [659.25, 987.77] : [392]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.09
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(kind === 'good' ? 0.08 : 0.05, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  } catch {
    // no audio — silent feedback
  }
}

/** A light tap of vibration on phones that support it. */
export function playFeedbackVibration(kind: 'good' | 'warn'): void {
  if (typeof navigator === 'undefined' || !playPrefs.vibrate() || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(kind === 'good' ? 18 : [12, 60, 12])
  } catch {
    // not allowed — ignore
  }
}
