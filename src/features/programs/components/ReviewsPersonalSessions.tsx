"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { COMMON, say } from "../common";
import { HUB } from "../hubCopy";
import { REVIEW_CHIPS, REVIEW_LINE, REVIEW_VIDEOS, type ReviewTopic } from "../reviewVideos";
import { ReviewCard } from "./Media";

// /reviews#personal-sessions (owner's reviews brief, Nov 2026): every
// Personal Sessions review video with its caption, filter chips at the
// top, long videos first, then Shorts. Kept apart from the Sharp Brain
// reviews; "See all reviews" on the hub and program pages links here.

export const PERSONAL_SESSIONS_REVIEWS_HREF = "/reviews#personal-sessions";

export function ReviewsTabs(): React.JSX.Element {
  const { lang } = useLanguage();
  const tab = "inline-flex min-h-11 items-center rounded-full border-2 border-line-strong px-5 text-[15px] font-semibold text-ink hover:bg-panel2";
  return (
    <nav aria-label={lang === "hi" ? "रिव्यू" : "Reviews"} className="border-b border-line px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-content flex-wrap gap-2.5">
        <a href="#top" className={tab}>
          Sharp Brain
        </a>
        <a href="#personal-sessions" className={tab}>
          {say(COMMON.breadcrumbHub, lang)}
        </a>
      </div>
    </nav>
  );
}

const pill = (on: boolean): string =>
  `min-h-11 rounded-full border-2 px-[18px] py-2 text-[15px] ${on ? "border-[#0E1B2C] bg-[#0E1B2C] font-extrabold text-white" : "border-[#C5CCD8] bg-white font-semibold text-[#0E1B2C]"}`;

export function ReviewsPersonalSessions(): React.JSX.Element {
  const { lang } = useLanguage();
  const [chip, setChip] = useState<ReviewTopic | "all">("all");
  const shown = REVIEW_VIDEOS.filter((v) => chip === "all" || v.topics.includes(chip));
  const long = shown.filter((v) => v.type === "L");
  const shorts = shown.filter((v) => v.type === "S");
  const hubHref = lang === "hi" ? "/personal-sessions?lang=hi" : "/personal-sessions";
  return (
    <section id="personal-sessions" className="scroll-mt-20 border-b border-line bg-[#FBFAF7] px-4 py-16 text-[#0E1B2C] sm:px-8 sm:py-20" data-reviews-personal-sessions>
      <div className="mx-auto flex max-w-content flex-col gap-8">
        <div>
          <a href={hubHref} className="text-[15px] font-semibold tracking-[0.06em] text-[#1F3A8A] hover:underline">
            {say(COMMON.breadcrumbHub, lang)}
          </a>
          <h2 className="mt-1 text-[28px] font-extrabold leading-[1.2] md:text-[40px]">{say(COMMON.reviewsHeading, lang)}</h2>
          <p className="mt-1.5 text-[18px] text-[#4A5568]">{say(HUB.proof.sub, lang)}</p>
        </div>
        <div role="group" aria-label={lang === "hi" ? "रिव्यू फ़िल्टर करें" : "Filter reviews"} className="flex flex-wrap gap-2.5" data-review-chips>
          {REVIEW_CHIPS.map((c) => (
            <button key={c.id} type="button" aria-pressed={chip === c.id} onClick={() => setChip(c.id)} className={pill(chip === c.id)} data-review-chip={c.id}>
              {say(c.label, lang)}
            </button>
          ))}
        </div>
        {long.length > 0 && (
          <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reviews-long>
            {long.map((video) => (
              <ReviewCard key={video.id} video={video} lang={lang} />
            ))}
          </div>
        )}
        {shorts.length > 0 && (
          <div className="grid grid-cols-2 items-start gap-3.5 sm:grid-cols-3 lg:grid-cols-5" data-reviews-shorts>
            {shorts.map((video) => (
              <ReviewCard key={video.id} video={video} lang={lang} size="tile" />
            ))}
          </div>
        )}
        <p className="text-[14px] text-[#4A5568]" data-review-line>
          {say(REVIEW_LINE, lang)}
        </p>
      </div>
    </section>
  );
}
