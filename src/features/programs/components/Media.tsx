"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { COMMON, say } from "../common";
import { defaultThumb, reviewThumb } from "../programs";
import { REVIEW_LINE, reviewVideo, topicTag, type ReviewVideo } from "../reviewVideos";
import type { ProgramLang } from "../types";

// Review videos (owner's reviews brief, Nov 2026): long videos open from a
// 16:9 card, Shorts from a 9:16 card; both play in a lightbox and load only
// when tapped. Under every video: its caption, then a small topic tag.

function PlayDisc({ size }: { size: number }): React.JSX.Element {
  return (
    <span aria-hidden="true" className="flex items-center justify-center rounded-full bg-[#F2A93B] shadow-[0_6px_18px_rgba(14,27,44,0.35)]" style={{ width: size, height: size }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#0E1B2C">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

/** Full-screen player; closes on ×, Esc or a tap outside the video. */
function Lightbox({ id, vertical, title, closeLabel, onClose }: { id: string; vertical: boolean; title: string; closeLabel: string; onClose: () => void }): React.JSX.Element {
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0E1B2C]/90 p-4" onClick={onClose} data-lightbox>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[28px] leading-none text-white hover:bg-white/20">
        ×
      </button>
      <div className={vertical ? "relative aspect-[9/16] h-[82vh] max-w-full" : "relative aspect-video w-full max-w-[960px]"} onClick={(event) => event.stopPropagation()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full rounded-[12px]"
        />
      </div>
    </div>
  );
}

const CLOSE: { en: string; hi: string } = { en: "Close video", hi: "वीडियो बंद करें" };

/** A review thumbnail that falls back to YouTube's default thumbnail if its first image fails. */
function Thumb({ video, sizes, priority = false, className }: { video: ReviewVideo; sizes: string; priority?: boolean; className: string }): React.JSX.Element {
  const first = reviewThumb(video.id, video.type);
  const [src, setSrc] = useState(first);
  return <Image src={src} alt="" fill priority={priority} sizes={sizes} className={className} onError={() => setSrc((current) => (current === defaultThumb(video.id) ? current : defaultThumb(video.id)))} />;
}

/** Hero media box (16:10): the page's first review video (lightbox), or the photo when there is none. */
export function HeroMedia({ videoId, photoSrc, photoAlt, lang, caption }: { videoId: string | null; photoSrc: string; photoAlt: string; lang: ProgramLang; caption?: string | undefined }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const video = videoId === null ? null : reviewVideo(videoId);
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-[#2C3D57] bg-[#16263D]" data-hero-media={video === null ? "photo" : "video"}>
      {video === null ? (
        <Image src={photoSrc} alt={photoAlt} fill priority sizes="(min-width: 1024px) 460px, 92vw" className="object-cover object-top" />
      ) : (
        <Thumb video={video} priority sizes="(min-width: 1024px) 460px, 92vw" className="object-cover object-top" />
      )}
      {video !== null ? (
        <>
          <span className="absolute inset-0 bg-[#0E1B2C]/35" aria-hidden="true" />
          <button type="button" onClick={() => setOpen(true)} aria-label={`${say(COMMON.playVideo, lang)}: ${say(video.caption, lang)}`} className="absolute inset-0 flex items-center justify-center">
            <PlayDisc size={80} />
          </button>
          {open && <Lightbox id={video.id} vertical={video.type === "S"} title={say(video.caption, lang)} closeLabel={say(CLOSE, lang)} onClose={() => setOpen(false)} />}
        </>
      ) : (
        caption !== undefined && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E1B2C]/90 to-transparent px-5 pb-4 pt-10 text-center text-[17px] font-semibold text-white">{caption}</span>
        )
      )}
    </div>
  );
}

/** One review: thumbnail (16:9 long, 9:16 Short) + caption + topic tag. */
export function ReviewCard({ video, lang, size = "large" }: { video: ReviewVideo; lang: ProgramLang; size?: "large" | "row" | "tile" }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const vertical = video.type === "S";
  const caption = say(video.caption, lang);
  const width = size === "row" ? (vertical ? "w-[170px] sm:w-[190px]" : "w-[280px] sm:w-[320px]") : size === "tile" ? "w-full" : vertical ? "mx-auto w-full max-w-[290px]" : "w-full";
  const small = size !== "large";
  return (
    <figure className={`flex flex-none flex-col overflow-hidden rounded-[16px] border border-[#E3E6EC] bg-white ${width}`} data-review-card={video.id} data-review-type={video.type}>
      <button type="button" onClick={() => setOpen(true)} aria-label={`${say(COMMON.playVideo, lang)}: ${caption}`} className={`group relative w-full bg-[#16263D] ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        <Thumb video={video} sizes={vertical ? "290px" : "(min-width: 1024px) 380px, 92vw"} className="object-cover" />
        <span className="absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-105">
          <PlayDisc size={small ? 48 : 60} />
        </span>
      </button>
      <figcaption className="flex flex-1 flex-col gap-2 px-4 py-3.5">
        <p className={`font-semibold leading-snug text-[#0E1B2C] ${small ? "text-[15px]" : "text-[17px]"}`}>“{caption}”</p>
        <span className="mt-auto self-start rounded-full bg-[#EEF2FB] px-2.5 py-0.5 text-[12px] font-extrabold text-[#1F3A8A]" data-topic-tag>
          {say(topicTag(video), lang)}
        </span>
      </figcaption>
      {open && <Lightbox id={video.id} vertical={vertical} title={caption} closeLabel={say(CLOSE, lang)} onClose={() => setOpen(false)} />}
    </figure>
  );
}

/** A page's reviews: first 3 as large cards, the rest in a sideways row, then the owner's line. */
export function ReviewStrip({ ids, lang }: { ids: readonly string[]; lang: ProgramLang }): React.JSX.Element {
  const videos = ids.map(reviewVideo);
  const large = videos.slice(0, 3);
  const row = videos.slice(3);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3" data-review-large>
        {large.map((video) => (
          <ReviewCard key={video.id} video={video} lang={lang} />
        ))}
      </div>
      {row.length > 0 && (
        <div className="-mx-4 flex snap-x snap-mandatory items-start gap-3.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 *:snap-start" data-review-row>
          {row.map((video) => (
            <ReviewCard key={video.id} video={video} lang={lang} size="row" />
          ))}
        </div>
      )}
      <p className="text-[14px] text-[#4A5568]" data-review-line>
        {say(REVIEW_LINE, lang)}
      </p>
    </div>
  );
}
