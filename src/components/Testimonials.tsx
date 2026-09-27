"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";
import VideoReviewGrid from "./VideoReviewGrid";
import { QSR_ADULT_VIDEO_REVIEWS, QSR_YOUNG_LEARNER_VIDEO_REVIEWS } from "@/config/qsrVideoReviews";
import { SUCCESS_STORIES_PLAYLIST_WATCH_URL } from "@/config/reviewsPlaylist";

export default function Testimonials(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.testimonials;
  // Homepage: anonymous Quantum Speed Reading video reviews only. Named
  // text testimonials appear only on their own program's page (see
  // src/config/testimonials.ts), so none are shown here.
  return (
    <section id="proof" className="border-b border-line px-6 py-24 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-content">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">
              {section.title}
            </h2>
            <p className="mt-3 text-[15.5px] text-ink-dim">{section.desc}</p>
          </div>
          {/* /stories never existed as a real route (confirmed 404 — see
              the "Home & QSR Testimonial/Video Reorder" task) — points
              at the real public YouTube playlist of student videos
              instead. */}
          <a
            href={SUCCESS_STORIES_PLAYLIST_WATCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-none items-center gap-2 font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-dim transition-colors hover:text-ink"
          >
            {section.viewAll}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Real video testimonials — honestly labeled by their actual
            program (Quantum Speed Reading), not implied to represent
            every program on this page. The quote cards below have no
            real videoUrls yet (all still placeholders), so this is an
            addition, not an "upgrade" of those cards.

            Young Learners first, Adults second (see the "Home Page
            Video Testimonial Reorder" task) — this section previously
            only ever imported QSR_ADULT_VIDEO_REVIEWS, so there was no
            young-learner block here at all to reorder; it now mirrors
            the same two-block, young-learners-first structure already
            fixed on the QSR page (QsrVideoTestimonials.tsx), pulling
            from the exact same shared qsrVideoReviews.ts arrays. */}
        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
            {section.videoLabel}
          </p>
          <div className="mb-8">
            <p className="mb-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">
              {section.videoYoungLearnersLabel}
            </p>
            <VideoReviewGrid
              videos={QSR_YOUNG_LEARNER_VIDEO_REVIEWS}
              aspectRatioClassName="aspect-[9/16]"
              className="mx-auto max-w-3xl"
            />
          </div>
          <div>
            <p className="mb-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">
              {section.videoAdultsLabel}
            </p>
            <VideoReviewGrid
              videos={QSR_ADULT_VIDEO_REVIEWS}
              aspectRatioClassName="aspect-[9/16]"
              className="mx-auto max-w-3xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
