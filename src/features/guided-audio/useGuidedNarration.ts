'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppLang } from '@/lib/app-i18n/languages'
import { guidedAudioBaseUrl, loadAudioManifest, type AudioManifest } from './manifest'
import { chooseSource, lineDurationMs, MP3_START_TIMEOUT_MS, speakableText, type NarrationSource } from './narrationSource'
import { NARRATION_LANGUAGE_TAGS, pickVoiceForLanguage } from './voiceSelection'

export type NarrationLine = { id: string; text: string }

type Settings = { muted: boolean; volume: number }
const SETTINGS_KEY = 'mum-guided-audio'
const VOICE_RATE = 0.85
// A silent WAV, played on the learner's first tap so iPhone Safari lets later lines play.
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

function readSettings(): Settings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<Settings>
    return { muted: parsed.muted === true, volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : 1 }
  } catch {
    return { muted: false, volume: 1 }
  }
}

function writeSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Private mode / blocked storage: settings just aren't remembered.
  }
}

/**
 * Line-by-line guided narration: the recorded MP3 for the line, else the
 * device's own voice, else a timed caption. The next line is preloaded while
 * the current one plays. `speak` resolves when the line has finished (or was
 * stopped), so a session can simply `await` each line in order.
 */
export function useGuidedNarration(exercise: string, lang: AppLang): {
  ready: boolean
  current: NarrationLine | null
  source: NarrationSource | null
  muted: boolean
  volume: number
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  unlock: () => void
  speak: (line: NarrationLine, next?: NarrationLine) => Promise<void>
  replay: () => void
  stop: () => void
} {
  const [ready, setReady] = useState(false)
  const [current, setCurrent] = useState<NarrationLine | null>(null)
  const [source, setSource] = useState<NarrationSource | null>(null)
  const [settings, setSettings] = useState<Settings>({ muted: false, volume: 1 })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const preloadRef = useRef<HTMLAudioElement | null>(null)
  const tokenRef = useRef(0)
  const settingsRef = useRef(settings)
  const manifestRef = useRef<AudioManifest | null>(null)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const finishRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const s = readSettings()
    setSettings(s)
    settingsRef.current = s
  }, [])

  const manifestPromiseRef = useRef<Promise<AudioManifest | null> | null>(null)

  useEffect(() => {
    let cancelled = false
    setReady(false)
    const promise = loadAudioManifest(exercise, lang)
    manifestPromiseRef.current = promise
    void promise.then((m) => {
      if (cancelled) return
      manifestRef.current = m
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [exercise, lang])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const load = (): void => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const stopPlayback = useCallback((): void => {
    tokenRef.current += 1
    audioRef.current?.pause()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    finishRef.current?.()
    finishRef.current = null
  }, [])

  useEffect(() => stopPlayback, [stopPlayback])

  const unlock = useCallback((): void => {
    if (typeof window === 'undefined') return
    if (audioRef.current === null) audioRef.current = new Audio()
    const audio = audioRef.current
    audio.src = SILENT_WAV
    void audio.play().catch(() => undefined)
  }, [])

  const urlFor = useCallback((lineId: string): string | null => {
    const entry = manifestRef.current?.lines[lineId]
    return entry ? `${guidedAudioBaseUrl(exercise, lang)}/${entry.file}` : null
  }, [exercise, lang])

  const preload = useCallback((line: NarrationLine | undefined): void => {
    if (!line || typeof window === 'undefined') return
    const url = urlFor(line.id)
    if (url === null) return
    const el = new Audio()
    el.preload = 'auto'
    el.src = url
    el.load()
    preloadRef.current = el
  }, [urlFor])

  const speak = useCallback(
    async (line: NarrationLine, next?: NarrationLine): Promise<void> => {
      stopPlayback()
      const token = tokenRef.current
      setCurrent(line)
      // The first line can be asked for before the manifest has arrived: wait for it (it's cached after that).
      if (manifestRef.current === null && manifestPromiseRef.current !== null) manifestRef.current = await manifestPromiseRef.current
      if (tokenRef.current !== token) return
      const m = manifestRef.current
      const waitMs = lineDurationMs(line.text, m, line.id)
      const hasVoice = typeof window !== 'undefined' && 'speechSynthesis' in window && pickVoiceForLanguage(voicesRef.current, lang) !== null

      return new Promise<void>((resolve) => {
        let done = false
        const finish = (): void => {
          if (done) return
          done = true
          finishRef.current = null
          resolve()
        }
        finishRef.current = finish
        const live = (): boolean => tokenRef.current === token && !done

        const captionOnly = (): void => {
          setSource('caption')
          window.setTimeout(() => live() && finish(), waitMs)
        }

        const viaVoice = (): void => {
          if (!hasVoice) return captionOnly()
          setSource('voice')
          const utterance = new SpeechSynthesisUtterance(speakableText(line.text))
          utterance.lang = NARRATION_LANGUAGE_TAGS[lang]
          utterance.rate = VOICE_RATE
          utterance.volume = settingsRef.current.volume
          const voice = pickVoiceForLanguage(voicesRef.current, lang)
          if (voice) utterance.voice = voice
          utterance.onend = () => live() && finish()
          utterance.onerror = () => live() && finish()
          window.speechSynthesis.speak(utterance)
          // Some engines never fire `end`; never let the session hang.
          window.setTimeout(() => live() && finish(), waitMs * 2 + 3000)
        }

        if (settingsRef.current.muted) {
          captionOnly()
          preload(next)
          return
        }

        const chosen = chooseSource(m, line.id, hasVoice)
        if (chosen !== 'mp3') {
          if (chosen === 'voice') viaVoice()
          else captionOnly()
          return
        }

        setSource('mp3')
        if (audioRef.current === null) audioRef.current = new Audio()
        const audio = audioRef.current
        let started = false
        const fallBack = (): void => {
          if (!live() || started) return
          audio.pause()
          viaVoice()
        }
        audio.onplaying = () => {
          started = true
        }
        audio.onended = () => live() && finish()
        audio.onerror = () => fallBack()
        audio.volume = settingsRef.current.volume
        audio.src = urlFor(line.id) ?? ''
        void audio.play().catch(() => fallBack())
        window.setTimeout(fallBack, MP3_START_TIMEOUT_MS)
        preload(next)
      })
    },
    [lang, preload, stopPlayback, urlFor],
  )

  const replay = useCallback((): void => {
    if (current === null) return
    const line = current
    // Replays the line on its own; the session keeps waiting on the original `speak`.
    const url = settingsRef.current.muted ? null : urlFor(line.id)
    if (url !== null && audioRef.current) {
      audioRef.current.currentTime = 0
      void audioRef.current.play().catch(() => undefined)
    } else if (!settingsRef.current.muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(speakableText(line.text))
      utterance.lang = NARRATION_LANGUAGE_TAGS[lang]
      utterance.rate = VOICE_RATE
      window.speechSynthesis.speak(utterance)
    }
  }, [current, lang, urlFor])

  const setMuted = useCallback((muted: boolean): void => {
    const s = { ...settingsRef.current, muted }
    settingsRef.current = s
    setSettings(s)
    writeSettings(s)
    if (muted) {
      // The line in progress keeps its place: the caption stays up for the rest of it.
      const audio = audioRef.current
      const remainingMs = audio && !audio.paused && Number.isFinite(audio.duration) ? Math.max(0, (audio.duration - audio.currentTime) * 1000) : 1500
      audio?.pause()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
      const finish = finishRef.current
      if (finish) window.setTimeout(finish, remainingMs)
    }
  }, [])

  const setVolume = useCallback((volume: number): void => {
    const s = { ...settingsRef.current, volume: Math.min(1, Math.max(0, volume)) }
    settingsRef.current = s
    setSettings(s)
    writeSettings(s)
    if (audioRef.current) audioRef.current.volume = s.volume
  }, [])

  return { ready, current, source, muted: settings.muted, volume: settings.volume, setMuted, setVolume, unlock, speak, replay, stop: stopPlayback }
}
