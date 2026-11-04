"use client";

import { useEffect, useRef } from "react";

// A YouTube video (privacy-enhanced youtube-nocookie host) that reports the
// first play and how much was watched — 25 / 50 / 75 / 100 %, each once —
// through the YouTube IFrame Player API. Skipping ahead counts as watched
// up to where the viewer is, as YouTube reports it.

type YTPlayer = { getCurrentTime: () => number; getDuration: () => number; destroy: () => void };
type YTStateEvent = { data: number };
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      width: string;
      height: string;
      playerVars: Record<string, number | string>;
      events: { onStateChange: (event: YTStateEvent) => void };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const ENDED = 0;
const MARKS = [25, 50, 75, 100] as const;

let apiReady: Promise<YTNamespace> | null = null;

function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiReady ??= new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return apiReady;
}

export function TrackedYouTube({
  videoId,
  title,
  onPlay,
  onProgress,
}: {
  videoId: string;
  title: string;
  onPlay: () => void;
  onProgress: (percent: (typeof MARKS)[number]) => void;
}): React.JSX.Element {
  const host = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onPlay, onProgress });
  callbacks.current = { onPlay, onProgress };

  useEffect(() => {
    let player: YTPlayer | null = null;
    let timer: number | null = null;
    let played = false;
    const sent = new Set<number>();
    let cancelled = false;

    const report = (percent: number): void => {
      for (const mark of MARKS) {
        if (percent >= mark && !sent.has(mark)) {
          sent.add(mark);
          callbacks.current.onProgress(mark);
        }
      }
    };
    const stopPolling = (): void => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };

    void loadApi().then((YT) => {
      if (cancelled || host.current === null) return;
      const target = document.createElement("div");
      host.current.appendChild(target);
      player = new YT.Player(target, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === PLAYING) {
              if (!played) {
                played = true;
                callbacks.current.onPlay();
              }
              if (timer === null) {
                timer = window.setInterval(() => {
                  const duration = player?.getDuration() ?? 0;
                  // 100 % also comes from the "ended" state, as the last second is often never polled.
                  if (duration > 0) report(((player?.getCurrentTime() ?? 0) / duration) * 100);
                }, 1000);
              }
            } else {
              stopPolling();
              if (event.data === ENDED) report(100);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      stopPolling();
      player?.destroy();
    };
  }, [videoId]);

  return <div ref={host} title={title} className="absolute inset-0 [&>iframe]:size-full" data-demo-video={videoId} />;
}
