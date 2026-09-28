"use client";

import { useState } from "react";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";
import VideoReviewGrid from "../VideoReviewGrid";
import { QSR_ADULT_VIDEO_REVIEWS, QSR_YOUNG_LEARNER_VIDEO_REVIEWS } from "@/config/qsrVideoReviews";
import { RETREAT_VIDEO_REVIEWS, RETREAT_VIDEO_REVIEWS_PLAYLIST_WATCH_URL } from "@/config/retreatVideoReviews";
import { SUCCESS_STORIES_PLAYLIST_WATCH_URL } from "@/config/reviewsPlaylist";

type Tab = "learning" | "meditation";

// 4. Proof — anonymous YouTube video reviews only (named text testimonials
// stay hidden until verified in site.config), in tabs by problem.
export default function HomeProof(): React.JSX.Element {
  const c = useHomeCopy().proof;
  const [tab, setTab] = useState<Tab>("learning");
  const tabs: { id: Tab; label: string }[] = [
    { id: "learning", label: c.tabs.learning },
    { id: "meditation", label: c.tabs.meditation },
  ];

  return (
    <section id="proof" className="border-b border-line bg-panel px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <p className="mt-3 text-[15.5px] text-ink-dim">{c.desc}</p>

        <div role="tablist" aria-label={c.title} className="mt-8 inline-flex rounded-sm border border-line-strong p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`proof-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`proof-panel-${item.id}`}
              onClick={() => setTab(item.id)}
              className={`rounded-sm px-5 py-2 text-[14px] font-semibold transition-colors ${
                tab === item.id ? "bg-gold text-[#1B1508]" : "text-ink-dim hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id={`proof-panel-${tab}`} role="tabpanel" aria-labelledby={`proof-tab-${tab}`} className="mt-8">
          {tab === "learning" && (
            <p className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{c.learningNote}</p>
          )}
          {tab === "learning" ? (
            <VideoReviewGrid
              videos={[...QSR_YOUNG_LEARNER_VIDEO_REVIEWS, ...QSR_ADULT_VIDEO_REVIEWS]}
              aspectRatioClassName="aspect-[9/16]"
              gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            />
          ) : (
            <VideoReviewGrid videos={RETREAT_VIDEO_REVIEWS} />
          )}
          <div className="mt-8 flex justify-center">
            <a
              href={tab === "learning" ? SUCCESS_STORIES_PLAYLIST_WATCH_URL : RETREAT_VIDEO_REVIEWS_PLAYLIST_WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-gold hover:underline"
            >
              {c.playlistCta} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
