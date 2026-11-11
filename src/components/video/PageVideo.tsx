"use client";

import { useState } from "react";
import Image from "next/image";
import type { PageVideoEntry } from "@/config/site.config";
import { trackCustom } from "@/lib/fbq";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Page video (owner, Nov 2026): a vertical 9:16 lite embed. Shows a
// thumbnail with a play button and loads the youtube-nocookie.com player
// only after a tap — nothing from YouTube loads with the page, and it never
// autoplays on its own. A tap also sends "VideoPlay" (with the video's name)
// to Meta Pixel and GA4, browser only.
//
// Thumbnail: YouTube's vertical frame (oardefault.jpg) when it exists; when
// it is missing or comes back landscape, hqdefault.jpg cropped to 9:16 with
// object-fit: cover, so no black bars show.

export type PageVideoLang = "en" | "hi";

const vertical = (id: string): string => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
const fallback = (id: string): string => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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
}: {
  video: PageVideoEntry;
  lang: PageVideoLang;
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
}): React.JSX.Element {
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(vertical(video.id));
  const caption = video.caption[lang];
  const alt = lang === "hi" ? `वीडियो: ${caption}` : `Video: ${caption}`;
  const playLabel = lang === "hi" ? `वीडियो चलाएँ: ${caption}` : `Play video: ${caption}`;
  const switchToFallback = (): void => setSrc((current) => (current === fallback(video.id) ? current : fallback(video.id)));

  return (
    <figure className={`mx-auto flex w-full max-w-[280px] flex-col gap-2.5 lg:max-w-[360px] ${className}`} data-page-video={video.name}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-[#16263D] shadow-[0_16px_40px_-18px_rgba(14,27,44,0.55)]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
            title={caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              trackVideoPlay(video.name);
              setPlaying(true);
            }}
            aria-label={playLabel}
            className="group absolute inset-0 h-full w-full"
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
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F2A93B] shadow-[0_6px_18px_rgba(14,27,44,0.4)] transition-transform group-hover:scale-105">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#0E1B2C">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className={`text-center text-[15px] font-semibold leading-snug ${tone === "dark" ? "text-[#D6DCE8]" : "text-[#4A5568]"}`} data-page-video-caption>
        {caption}
      </figcaption>
    </figure>
  );
}
