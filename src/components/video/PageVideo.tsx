"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PageVideoEntry } from "@/config/site.config";
import { trackCustom } from "@/lib/fbq";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Page video (owner, Nov 2026): a vertical 9:16 lite embed. Nothing loads
// from YouTube until the tap. ONE tap plays (owner's fix): the tap creates
// the player with the YouTube IFrame Player API (youtube-nocookie.com host)
// and plays it at once. If the browser blocks playback with sound (iPhone
// Safari can), the video starts muted and a "Tap for sound" button unmutes
// it. A tap also sends "VideoPlay" (video name) to Meta Pixel and GA4.
//
// Thumbnail: YouTube's vertical frame (oardefault.jpg) when it exists; when
// it is missing or comes back landscape, hqdefault.jpg cropped to 9:16.

export type PageVideoLang = "en" | "hi";

const vertical = (id: string): string => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
const fallback = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const PLAYING = 1;
const BUFFERING = 3;
/** If nothing is playing this long after the player is ready, playback with sound was blocked. */
const BLOCKED_AFTER_MS = 2500;
export const TAP_FOR_SOUND = "🔊 आवाज़ चालू करें / Tap for sound";

type YTPlayer = {
  playVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
};
type YTEvent = { target: YTPlayer; data?: number };
type YTNamespace = { Player: new (element: HTMLElement, options: Record<string, unknown>) => YTPlayer };
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads the IFrame Player API once (only after a tap). */
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player !== undefined) return Promise.resolve(window.YT);
  if (apiPromise !== null) return apiPromise;
  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT !== undefined) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube API did not load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export function trackVideoPlay(name: string): void {
  trackCustom("VideoPlay", { video_name: name });
  trackGaEvent("VideoPlay", { video_name: name });
}

export function PageVideo({
  video,
  lang,
  tone = "dark",
  className = "",
  priority = false,
  caption: captionOverride,
}: {
  video: PageVideoEntry;
  lang: PageVideoLang;
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
  /** Replaces the video's caption line on this page (e.g. the homepage). */
  caption?: string;
}): React.JSX.Element {
  const [active, setActive] = useState(false); // tapped: the player is being created
  const [started, setStarted] = useState(false); // video is playing
  const [needsSound, setNeedsSound] = useState(false); // started muted
  const [plainIframe, setPlainIframe] = useState(false); // API failed to load: plain embed
  const [src, setSrc] = useState(vertical(video.id));
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const timerRef = useRef<number | null>(null);
  const caption = captionOverride ?? video.caption[lang];
  const alt = lang === "hi" ? `वीडियो: ${caption}` : `Video: ${caption}`;
  const playLabel = lang === "hi" ? `वीडियो चलाएँ: ${caption}` : `Play video: ${caption}`;
  const switchToFallback = (): void => setSrc((current) => (current === fallback(video.id) ? current : fallback(video.id)));

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      playerRef.current?.destroy();
    },
    [],
  );

  function startMuted(player: YTPlayer): void {
    player.mute();
    player.playVideo();
    setNeedsSound(true);
    setStarted(true);
  }

  function createPlayer(YT: YTNamespace): void {
    const host = mountRef.current;
    if (host === null || playerRef.current !== null) return;
    const target = document.createElement("div");
    host.appendChild(target);
    playerRef.current = new YT.Player(target, {
      host: "https://www.youtube-nocookie.com",
      videoId: video.id,
      width: "100%",
      height: "100%",
      playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: (event: YTEvent) => {
          event.target.playVideo();
          timerRef.current = window.setTimeout(() => {
            const state = event.target.getPlayerState();
            if (state !== PLAYING && state !== BUFFERING) startMuted(event.target);
          }, BLOCKED_AFTER_MS);
        },
        onStateChange: (event: YTEvent) => {
          if (event.data === PLAYING) setStarted(true);
        },
        onAutoplayBlocked: (event: YTEvent) => startMuted(event.target),
      },
    });
  }

  function onTap(): void {
    trackVideoPlay(video.name);
    setActive(true);
    // Already loaded (another video on the page was played): create and play inside this tap.
    if (window.YT?.Player !== undefined) {
      createPlayer(window.YT);
      return;
    }
    loadYouTubeApi().then(createPlayer, () => setPlainIframe(true));
  }

  function onTapForSound(): void {
    const player = playerRef.current;
    if (player === null) return;
    player.unMute();
    player.setVolume(100);
    player.playVideo();
    setNeedsSound(false);
  }

  return (
    <figure className={`mx-auto flex w-full max-w-[280px] flex-col gap-2.5 lg:max-w-[360px] ${className}`} data-page-video={video.name}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-[#16263D] shadow-[0_16px_40px_-18px_rgba(14,27,44,0.55)]">
        {plainIframe ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
            title={caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <div ref={mountRef} className="absolute inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full" data-page-video-player />
        )}
        {!started && !plainIframe && (
          <button
            type="button"
            onClick={onTap}
            disabled={active}
            aria-label={playLabel}
            className="group absolute inset-0 h-full w-full disabled:cursor-wait"
            data-page-video-play
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="360px"
              className="object-cover"
              onError={switchToFallback}
              onLoad={(event) => {
                const img = event.currentTarget;
                // oardefault is vertical; a landscape image here means the fallback (cropped) looks better.
                if (src === vertical(video.id) && img.naturalWidth >= img.naturalHeight) switchToFallback();
              }}
              data-thumb={src === vertical(video.id) ? "vertical" : "cropped"}
            />
            <span className="absolute inset-0 bg-[#0E1B2C]/15 transition-colors group-hover:bg-[#0E1B2C]/30" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F2A93B] shadow-[0_6px_18px_rgba(14,27,44,0.4)] transition-transform group-hover:scale-105 ${active ? "animate-pulse" : ""}`}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#0E1B2C">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
        {needsSound && (
          <button
            type="button"
            onClick={onTapForSound}
            className="absolute inset-x-3 top-3 z-10 min-h-12 rounded-full bg-[#F2A93B] px-4 py-2.5 text-[15px] font-extrabold text-[#0E1B2C] shadow-[0_6px_18px_rgba(14,27,44,0.45)]"
            data-page-video-sound
          >
            {TAP_FOR_SOUND}
          </button>
        )}
      </div>
      <figcaption className={`text-center text-[15px] font-semibold leading-snug ${tone === "dark" ? "text-[#D6DCE8]" : "text-[#4A5568]"}`} data-page-video-caption>
        {caption}
      </figcaption>
    </figure>
  );
}
