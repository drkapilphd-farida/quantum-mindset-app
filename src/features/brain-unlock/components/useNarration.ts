"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Plays Brain Unlock voice lines with captions. Each line is a bundled
// Sarvam "shubh" recording (/audio/brain-unlock/<lang>/<id>.mp3); when the
// founder has uploaded his own recording for a whole segment (admin
// settings), that one file plays instead with the captions stepping along.
// Muted, blocked or missing audio never stops the flow: the caption simply
// stays for a reading-length pause. Never uses the phone's robot voice.

export type NarrationLine = { id: string; text: string };

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
    overrideUrl?: string,
    onLine?: (index: number) => void,
  ) => Promise<void>;
  stop: () => void;
} {
  const [caption, setCaption] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const run = useRef(0);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

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

  const playFile = (
    src: string,
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
      const fallback = (): void => void wait(fallbackMs, id).then(done);
      a.onended = done;
      a.onerror = fallback;
      a.src = src;
      a.play().catch(fallback);
      // Safety net: never wait forever on a stalled file.
      window.setTimeout(done, fallbackMs + 8000);
    });

  const play = useCallback(
    async (
      lines: readonly NarrationLine[],
      overrideUrl?: string,
      onLine?: (index: number) => void,
    ): Promise<void> => {
      run.current += 1;
      const id = run.current;
      setPlaying(true);
      if (overrideUrl !== undefined && overrideUrl !== "") {
        // One recording for the whole segment: captions step along by length.
        const total = lines.reduce((n, l) => n + msForText(l.text), 0);
        const file = playFile(overrideUrl, total, id);
        for (let i = 0; i < lines.length && run.current === id; i++) {
          setCaption(lines[i]!.text);
          onLine?.(i);
          await wait(msForText(lines[i]!.text), id);
        }
        await file;
      } else {
        for (let i = 0; i < lines.length && run.current === id; i++) {
          setCaption(lines[i]!.text);
          onLine?.(i);
          await playFile(
            `/audio/brain-unlock/${lang}/${lines[i]!.id}.mp3`,
            msForText(lines[i]!.text),
            id,
          );
        }
      }
      if (run.current === id) setPlaying(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- playFile/wait read refs only
    [lang],
  );

  return { caption, playing, play, stop };
}
