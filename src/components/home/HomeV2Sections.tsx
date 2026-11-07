"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";
import { SHARP_BRAIN_REVIEW_CARDS, SHARP_BRAIN_REVIEW_GRID_CLASS } from "@/config/sharpBrainVideoReviews";
import { homeV2, say, sharpBrainHref } from "@/lib/homeV2Copy";
import { GROUPS } from "@/features/programs/common";
import type { GroupId } from "@/features/programs/types";

const GROUP_ORDER: GroupId[] = ["mind", "rel", "perf", "spirit", "deep"];
import VideoReviewGrid from "../VideoReviewGrid";
import { Eyebrow } from "../ui";

// Homepage sections (Nov 2026): Sharp Brain + Personal Sessions. The
// homepage's existing look (border-b sections, cards, gold buttons).

const SECTION = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";
const GOLD = "inline-flex min-h-11 items-center justify-center rounded-sm bg-gold px-6 py-3 text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]";

// 2. Two paths: Sharp Brain (two prices) and Personal Sessions (three groups).
export function HomePaths(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.paths;
  const sb = c.sharpBrain;
  const ps = c.sessions;
  return (
    <section id="paths" className={SECTION} aria-labelledby="home-paths">
      <div className="mx-auto max-w-content">
        <h2 id="home-paths" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="flex flex-col rounded-sm border-2 border-gold bg-panel p-6 sm:p-8" data-home-path="sharp-brain">
            <Eyebrow color="text-gold">{say(sb.eyebrow, lang)}</Eyebrow>
            <h3 className="mt-3 text-[24px] font-extrabold leading-snug sm:text-[28px]">{say(sb.title, lang)}</h3>
            <ul className="mt-4 space-y-2 text-[16px] leading-relaxed">
              {sb.points.map((point) => (
                <li key={point.en} className="flex items-start gap-2.5">
                  <span className="font-bold text-teal" aria-hidden="true">✓</span>
                  {say(point, lang)}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {sb.prices.map((item) => (
                <div key={item.price} className="rounded-sm border border-line-strong bg-void px-4 py-3 text-center">
                  <p className="text-[13.5px] text-ink-dim">{say(item.label, lang)}</p>
                  <p className="text-[24px] font-extrabold">{item.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-6">
              <Link href={sharpBrainHref(lang)} className={GOLD}>
                {say(sb.button, lang)}
              </Link>
              <Link href={FREE_TEST_LINKS.speedTest} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
                {say(sb.test, lang)}
              </Link>
            </div>
          </article>
          <article className="flex flex-col rounded-sm border border-line-strong bg-panel p-6 sm:p-8" data-home-path="sessions">
            <Eyebrow color="text-teal">{say(ps.eyebrow, lang)}</Eyebrow>
            <h3 className="mt-3 text-[24px] font-extrabold leading-snug sm:text-[28px]">{say(ps.title, lang)}</h3>
            {/* Owner (Nov 2026): the 5 program groups as coloured tags (same colours as /personal-sessions). */}
            <ul className="mt-4 flex flex-wrap gap-2" data-home-groups>
              {GROUP_ORDER.map((id) => {
                const g = GROUPS[id];
                return (
                  <li key={id} className="rounded-full px-3 py-1 text-[14px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
                    {say(g.label, lang)}
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-[15.5px] font-semibold" data-home-clarity>
              {say(ps.price, lang)}
            </p>
            <div className="mt-5 flex flex-col items-start gap-3 lg:mt-auto lg:pt-6">
              <Link href={lang === "hi" ? `${programs.oneOnOneCoaching.url}?lang=hi` : programs.oneOnOneCoaching.url} className={GOLD} data-home-all-programs>
                {say(ps.button, lang)}
              </Link>
              <p className="text-[13px] text-ink-dim">{say(ps.note, lang)}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// 3. Sharp Brain video reviews — the same 7 Shorts as the Sharp Brain page.
export function HomeSharpBrainReviews(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.reviews;
  return (
    <section id="proof" className={`${SECTION} bg-panel`} aria-labelledby="home-reviews">
      <div className="mx-auto max-w-content">
        <h2 id="home-reviews" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <VideoReviewGrid videos={SHARP_BRAIN_REVIEW_CARDS} aspectRatioClassName="aspect-[9/16]" gridClassName={SHARP_BRAIN_REVIEW_GRID_CLASS} className="mt-8" />
        <Link href="/reviews" className="mt-6 inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
          {say(c.more, lang)}
        </Link>
      </div>
    </section>
  );
}

// Partner strip → /partner.
export function HomeFranchiseStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.franchise;
  return (
    <section className="border-b border-line px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[16px] leading-relaxed text-ink-dim">
          <strong className="text-ink">{say(c.lead, lang)}</strong> {say(c.body, lang)}
        </p>
        <Link href={programs.franchise.url} className="inline-flex min-h-11 flex-none items-center justify-center rounded-sm border border-line-strong px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2">
          {say(c.button, lang)} →
        </Link>
      </div>
    </section>
  );
}
