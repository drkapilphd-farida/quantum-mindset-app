"use client";

import { useState } from "react";
import Image from "next/image";
import { videoThumb } from "../programs";

// Videos load only when tapped: a thumbnail (or photo) with the amber play
// button first, the youtube-nocookie player after a click (CSP frame-src).

function Player({ id, title, vertical = false }: { id: string; title: string; vertical?: boolean }): React.JSX.Element {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={`absolute inset-0 h-full w-full ${vertical ? "" : ""}`}
    />
  );
}

function PlayDisc({ size }: { size: number }): React.JSX.Element {
  return (
    <span aria-hidden="true" className="flex items-center justify-center rounded-full bg-[#F2A93B]" style={{ width: size, height: size }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#0E1B2C">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

/** Hero media box (16:10): a review video, or the photo when there is none. */
export function HeroMedia({
  videoId,
  photoSrc,
  photoAlt,
  playLabel,
  caption,
}: {
  videoId: string | null;
  photoSrc: string;
  photoAlt: string;
  playLabel: string;
  caption?: string | undefined;
}): React.JSX.Element {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-[#2C3D57] bg-[#16263D]" data-hero-media={videoId === null ? "photo" : "video"}>
      {playing && videoId !== null ? (
        <Player id={videoId} title={playLabel} />
      ) : (
        <>
          <Image src={videoId === null ? photoSrc : videoThumb(videoId)} alt={videoId === null ? photoAlt : ""} fill priority sizes="(min-width: 1024px) 460px, 92vw" className="object-cover object-top" />
          {videoId !== null && (
            <>
              <span className="absolute inset-0 bg-[#0E1B2C]/35" aria-hidden="true" />
              <button type="button" onClick={() => setPlaying(true)} aria-label={playLabel} className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <PlayDisc size={80} />
                {caption !== undefined && <span className="rounded-md bg-[#0E1B2C]/70 px-3 py-1 text-[17px] font-semibold text-white">{caption}</span>}
              </button>
            </>
          )}
          {videoId === null && caption !== undefined && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E1B2C]/90 to-transparent px-5 pb-4 pt-10 text-center text-[17px] font-semibold text-white">{caption}</span>
          )}
        </>
      )}
    </div>
  );
}

/** Review card (16:9) with title. */
export function VideoCard({ id, title, playLabel }: { id: string; title: string; playLabel: string }): React.JSX.Element {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E3E6EC] bg-white" data-video-card={id}>
      <div className="relative aspect-video bg-[#16263D]">
        {playing ? (
          <Player id={id} title={title} />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`} className="group absolute inset-0 flex items-center justify-center">
            <Image src={videoThumb(id)} alt="" fill sizes="(min-width: 1024px) 370px, 92vw" className="object-cover" />
            <span className="relative transition-transform group-hover:scale-105">
              <PlayDisc size={60} />
            </span>
          </button>
        )}
      </div>
      <div className="px-[18px] py-4">
        <p className="text-[18px] font-extrabold leading-snug">{title}</p>
      </div>
    </div>
  );
}

/** Sideways row of YouTube Shorts (9:16). */
export function ShortsRow({ ids, playLabel }: { ids: readonly string[]; playLabel: string }): React.JSX.Element | null {
  const [playing, setPlaying] = useState<string | null>(null);
  if (ids.length === 0) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" data-shorts-row>
      {ids.map((id, index) => (
        <div key={id} className="relative aspect-[9/16] w-[46%] flex-none snap-start overflow-hidden rounded-[14px] bg-[#16263D] sm:w-[200px]">
          {playing === id ? (
            <Player id={id} title={`${playLabel} ${index + 1}`} vertical />
          ) : (
            <button type="button" onClick={() => setPlaying(id)} aria-label={`${playLabel} ${index + 1}`} className="group absolute inset-0 flex items-center justify-center">
              <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="200px" className="object-cover" />
              <span className="relative transition-transform group-hover:scale-105">
                <PlayDisc size={48} />
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
