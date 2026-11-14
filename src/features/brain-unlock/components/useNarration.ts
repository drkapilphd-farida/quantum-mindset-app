"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { voiceSources, voiceText } from "../voiceLines";

// Plays Brain Unlock voice lines with captions (Sarvam "shubh" voice). Each
// line tries its sources in order (voiceLines.ts): Dr. Kapil's admin
// upload/regenerate → the bundled file. If none
// plays (muted, blocked, missing) the caption simply stays for a reading-length
// pause: the flow never stops. Never uses the phone's robot voice.

export type NarrationLine = { id: string; text: string };

/** Per-line overrides from admin settings (settings.voiceLines[lang]). */
export const VoiceOverrides = createContext<Readonly<Record<string, string>>>(
  {},
);

const msForText = (text: string): number =>
  Math.min(9000, Math.max(1600, text.length * 65));

export function useNarration(
  lang: "en" | "hi",
  muted: boolean,
): {
  caption: string | null;
  playing: boolean;
  play: (
    lines: readonly NarrationLine[],
    onLine?: (index: number) => void,
    /** A calm pause between lines (e.g. memory-story steps). */
    gapMs?: number,
  ) => Promise<void>;
  /** One line, fire-and-forget (round intros, reveals); text from the script. */
  cue: (id: string, delayMs?: number) => void;
  stop: () => void;
} {
  const overrides = useContext(VoiceOverrides);
  const [caption, setCaption] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const run = useRef(0);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;

  useEffect(() => {
    if (muted) audio.current?.pause();
  }, [muted]);

  const stop = useCallback(() => {
    run.current += 1;
    audio.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => stop, [stop]);

  const wait = (ms: number, id: number): Promise<void> =>
    new Promise((resolve) => {
      const started = Date.now();
      const tick = (): void => {
        if (run.current !== id || Date.now() - started >= ms) resolve();
        else window.setTimeout(tick, 100);
      };
      tick();
    });

  /** Tries each source until one plays to the end; otherwise waits the caption time. */
  const playLine = (
    sources: readonly string[],
    fallbackMs: number,
    id: number,
  ): Promise<void> =>
    new Promise((resolve) => {
      if (mutedRef.current) {
        void wait(fallbackMs, id).then(resolve);
        return;
      }
      audio.current ??= new Audio();
      const a = audio.current;
      let settled = false;
      const done = (): void => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const tryFrom = (k: number): void => {
        if (run.current !== id) return done();
        if (k >= sources.length) {
          void wait(fallbackMs, id).then(done);
          return;
        }
        a.onended = done;
        // A file that fails to load (404, decode error) → the next source.
        a.onerror = () => tryFrom(k + 1);
        a.src = sources[k]!;
        a.play().catch((e: unknown) => {
          // Autoplay blocked: no source will play now, keep the caption pause.
          if (e instanceof DOMException && e.name === "NotAllowedError")
            void wait(fallbackMs, id).then(done);
        });
      };
      tryFrom(0);
      // Safety net: never wait forever on a stalled file.
      window.setTimeout(done, fallbackMs + 12000);
    });

  const play = useCallback(
    async (
      lines: readonly NarrationLine[],
      onLine?: (index: number) => void,
      gapMs = 0,
    ): Promise<void> => {
      run.current += 1;
      const id = run.current;
      setPlaying(true);
      for (let i = 0; i < lines.length && run.current === id; i++) {
        setCaption(lines[i]!.text);
        onLine?.(i);
        await playLine(
          voiceSources(lang, lines[i]!.id, overridesRef.current),
          msForText(lines[i]!.text),
          id,
        );
        if (gapMs > 0 && i < lines.length - 1) await wait(gapMs, id);
      }
      if (run.current === id) setPlaying(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- playLine/wait read refs only
    [lang],
  );

  const cue = useCallback(
    (lineId: string, delayMs = 0): void => {
      const start = run.current;
      window.setTimeout(() => {
        if (run.current !== start) return;
        void play([{ id: lineId, text: voiceText(lang, lineId) }]);
      }, delayMs);
    },
    [lang, play],
  );

  return { caption, playing, play, cue, stop };
}

/** Plays one line when it appears on screen; stops when it goes away. */
export function VoiceCue({
  id,
  lang,
  muted,
  delayMs = 400,
}: {
  id: string;
  lang: "en" | "hi";
  muted: boolean;
  delayMs?: number;
}): null {
  const voice = useNarration(lang, muted);
  useEffect(() => {
    voice.cue(id, delayMs);
    // once per appearance (useNarration stops the line on unmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return null;
}
