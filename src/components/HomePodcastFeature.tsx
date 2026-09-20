"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";

// Founder Podcast Feature™ — Dr. Kapil Dev Sharma's appearance on Solomon
// Daniel's podcast ("What if Your BRAIN is Hiding 99% of its POWER?"),
// youtu.be/rVCdV4xGlYc. Broad brand/founder-authority content, not tied
// to any one program — placed between ProgramSelector and Testimonials
// on the homepage so a visitor hears from the founder himself before
// seeing student/parent results, rather than mixed into the QSR-only
// student testimonial carousel below.
//
// Click-to-play facade (thumbnail + Play button; the real
// youtube-nocookie.com iframe only mounts after a click), the same
// underlying technique VideoReviewGrid.tsx already uses elsewhere on
// this site — the homepage never pays YouTube's iframe weight/requests
// for a visitor who doesn't watch. Swaps inline in place rather than a
// lightbox/modal, matching HomeOverviewVideo.tsx's own always-inline
// section directly below this one on the page. autoplay=1 only ever
// applies to the iframe minted after a real click, so playback (with
// sound) only ever starts as the direct result of that click — never on
// page load.
const PODCAST_VIDEO_ID = "rVCdV4xGlYc";
const PODCAST_THUMBNAIL_SRC = "/podcast-videos/rVCdV4xGlYc-thumb.jpg";

export default function HomePodcastFeature(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.homePodcastFeature;
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
        </div>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        <p className="mt-3 text-[15px] text-ink-dim">{section.caption}</p>

        {/* Same framed-panel treatment as HomeOverviewVideo's video below
            it on the page, for visual consistency between the two video
            sections. */}
        <div className="mx-auto mt-9 rounded-sm border border-line-strong bg-panel2 p-2 shadow-[0_16px_40px_rgba(34,31,29,0.12)] sm:p-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-sm">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${PODCAST_VIDEO_ID}?autoplay=1&rel=0`}
                title={section.videoTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={section.playAriaLabel}
                className="group absolute inset-0 h-full w-full"
              >
                <Image
                  src={PODCAST_THUMBNAIL_SRC}
                  alt={section.videoTitle}
                  fill
                  sizes="(min-width: 640px) 672px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-void/25 transition-colors duration-200 group-hover:bg-void/40" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-void/50 text-gold backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7" aria-hidden="true" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{section.channelCredit}</p>
      </div>
    </section>
  );
}
