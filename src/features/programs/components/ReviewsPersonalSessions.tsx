"use client";

import { useLanguage } from "@/context/LanguageContext";
import { COMMON, GROUPS, say } from "../common";
import { HUB } from "../hubCopy";
import { PROGRAMS, programHref } from "../programs";
import type { Program } from "../types";
import { ShortsRow, VideoCard } from "./Media";

// /reviews (owner, Nov 2026): Sharp Brain and Personal Sessions reviews are
// kept apart. "See all reviews" on the hub and program pages links to
// /reviews#personal-sessions. One block per program that has review videos;
// a program's videos appear once, even when another page reuses them.

export const PERSONAL_SESSIONS_REVIEWS_HREF = "/reviews#personal-sessions";

/**
 * Each video shows once, under the program it belongs to: the program named
 * in its title (e.g. "Cosmic Fusion — workshop review"), otherwise the first
 * program that lists it.
 */
function programsWithOwnVideos(): { program: Program; videos: Program["videos"] }[] {
  const owner = new Map<string, string>();
  for (const p of PROGRAMS) {
    for (const v of p.videos) {
      if (v.title.en.toLowerCase().includes(p.name.en.toLowerCase())) owner.set(v.id, p.slug);
      else if (!owner.has(v.id) && !PROGRAMS.some((q) => q.videos.some((w) => w.id === v.id) && v.title.en.toLowerCase().includes(q.name.en.toLowerCase()))) owner.set(v.id, p.slug);
    }
  }
  return PROGRAMS.map((program) => ({ program, videos: program.videos.filter((v) => owner.get(v.id) === program.slug) })).filter((b) => b.videos.length > 0);
}

export function ReviewsTabs(): React.JSX.Element {
  const { lang } = useLanguage();
  const tab = "inline-flex min-h-11 items-center rounded-full border-2 px-5 text-[15px] font-semibold";
  return (
    <nav aria-label={lang === "hi" ? "रिव्यू" : "Reviews"} className="border-b border-line px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-content flex-wrap gap-2.5">
        <a href="#top" className={`${tab} border-line-strong text-ink hover:bg-panel2`}>
          Sharp Brain
        </a>
        <a href="#personal-sessions" className={`${tab} border-line-strong text-ink hover:bg-panel2`}>
          {say(COMMON.breadcrumbHub, lang)}
        </a>
      </div>
    </nav>
  );
}

export function ReviewsPersonalSessions(): React.JSX.Element {
  const { lang } = useLanguage();
  const blocks = programsWithOwnVideos();
  const hubHref = lang === "hi" ? "/personal-sessions?lang=hi" : "/personal-sessions";
  return (
    <section id="personal-sessions" className="scroll-mt-20 border-b border-line bg-[#FBFAF7] px-4 py-16 text-[#0E1B2C] sm:px-8 sm:py-20" data-reviews-personal-sessions>
      <div className="mx-auto flex max-w-content flex-col gap-12">
        <div>
          <a href={hubHref} className="text-[15px] font-semibold tracking-[0.06em] text-[#1F3A8A] hover:underline">
            {say(COMMON.breadcrumbHub, lang)}
          </a>
          <h2 className="mt-1 text-[28px] font-extrabold leading-[1.2] md:text-[40px]">{say(COMMON.reviewsHeading, lang)}</h2>
          <p className="mt-1.5 text-[18px] text-[#4A5568]">{say(HUB.proof.sub, lang)}</p>
        </div>
        {blocks.map(({ program: p, videos }) => {
          const g = GROUPS[p.group];
          return (
            <div key={p.slug} className="flex flex-col gap-5" data-reviews-program={p.slug}>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[24px] font-extrabold">{say(p.name, lang)}</h3>
                <span className="rounded-full px-2.5 py-0.5 text-[12px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
                  {say(g.label, lang)}
                </span>
                <a href={programHref(p.slug, lang)} className="text-[15px] font-extrabold text-[#1F3A8A] hover:underline">
                  {say(COMMON.learnMore, lang)}
                </a>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                {videos.map((v) => (
                  <VideoCard key={v.id} id={v.id} title={say(v.title, lang)} playLabel={say(COMMON.playVideo, lang)} />
                ))}
              </div>
              <ShortsRow ids={p.shorts} playLabel={say(COMMON.playVideo, lang)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
