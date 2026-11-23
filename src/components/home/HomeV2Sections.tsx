"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";
import { SCHOOLS_HREF } from "@/config/navigation";
import { SHARP_BRAIN_REVIEW_GRID_CLASS, sharpBrainReviewCards } from "@/config/sharpBrainVideoReviews";
import { HOME_SESSION_REVIEW_IDS, homeV2, say, sharpBrainHref } from "@/lib/homeV2Copy";
import { GROUPS } from "@/features/programs/common";
import { reviewVideo } from "@/features/programs/reviewVideos";
import { CALM_COPY } from "@/features/calm-batch/copy";
import { reviewFrameSrc } from "@/lib/video/reviewFrames";
import { BookOpen, Brain, CalendarClock, Headphones, Route } from "lucide-react";
import { FreeTestButton } from "../FreeTestButton";
import type { GroupId } from "@/features/programs/types";

const GROUP_ORDER: GroupId[] = ["mind", "rel", "perf", "spirit", "deep"];
import VideoReviewGrid from "../VideoReviewGrid";
import { Eyebrow } from "../ui";

// Trust strip and Meet Dr. Kapil live in HomeTrustMeet.tsx (small, so other pages can reuse them cheaply).
export { HomeMeetKapil, HomeTrustStrip } from "./HomeTrustMeet";

// Homepage sections (Nov 2026): Sharp Brain + Personal Sessions. The
// homepage's existing look (border-b sections, cards, gold buttons).

const SECTION = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";
const GOLD = "inline-flex min-h-11 items-center justify-center rounded-sm bg-gold px-6 py-3 text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-gold-dim";

// 2. Three programs (owner's offer ladder, 23 Nov 2026): Sharp Brain (4
// prices), 21-Day Online Retreat, Personal Sessions — then the "more ways"
// strip (Telepathy workshop, Rishikesh retreat, organisations).
const CARD = "flex flex-col rounded-sm bg-panel p-6 sm:p-7";
export function HomePaths(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.paths;
  const sb = c.sharpBrain;
  const rt = c.retreat;
  const ps = c.sessions;
  const hiQ = (href: string): string => (lang === "hi" ? `${href}?lang=hi` : href);
  return (
    <section id="paths" className={SECTION} aria-labelledby="home-paths">
      <div className="mx-auto max-w-content">
        <h2 id="home-paths" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <article className={`${CARD} border-2 border-[#2b57e8]/35`} data-home-path="sharp-brain">
            <Eyebrow color="text-[#2b57e8]">{say(sb.eyebrow, lang)}</Eyebrow>
            <h3 className="mt-3 text-[24px] font-extrabold leading-snug">{say(sb.title, lang)}</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-dim">{say(sb.line, lang)}</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5" data-home-sb-prices>
              {sb.prices.map((item) => (
                <div key={item.price} className="rounded-sm border border-line-strong bg-void px-3 py-2.5 text-center">
                  <p className="text-[12.5px] leading-tight text-ink-dim">{say(item.label, lang)}</p>
                  <p className="mt-0.5 text-[20px] font-extrabold">{item.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-start gap-3 lg:mt-auto lg:pt-6">
              <Link href={sharpBrainHref(lang, "#enrol")} className={`${GOLD} min-h-12 w-full`}>
                {say(sb.button, lang)}
              </Link>
              <FreeTestButton test="reading" lang={lang} />
            </div>
          </article>

          <article className={`${CARD} border-2 border-teal/45`} data-home-path="online-retreat">
            <Eyebrow color="text-teal">{say(rt.eyebrow, lang)}</Eyebrow>
            <h3 className="mt-3 text-[24px] font-extrabold leading-snug">{say(rt.title, lang)}</h3>
            <ul className="mt-3 space-y-2 text-[15.5px] leading-relaxed">
              {rt.points.map((point) => (
                <li key={point.en} className="flex items-start gap-2.5">
                  <span className="font-bold text-teal" aria-hidden="true">✓</span>
                  {say(point, lang)}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-sm border border-teal/35 bg-teal-soft px-4 py-3" data-home-retreat-price>
              <p className="flex items-baseline gap-2.5">
                <span className="text-[28px] font-extrabold">{rt.price}</span>
                <span className="text-[16px] font-semibold text-ink-faint line-through">{rt.regular}</span>
              </p>
              <p className="text-[13px] text-ink-dim">{say(rt.priceNote, lang)}</p>
            </div>
            <div className="mt-6 flex flex-col items-start gap-3 lg:mt-auto lg:pt-6">
              <Link href={hiQ(programs.onlineRetreat.url)} className={`${GOLD} min-h-12 w-full`} data-home-retreat>
                {say(rt.button, lang)}
              </Link>
              <FreeTestButton test="overthinking" lang={lang} />
            </div>
          </article>

          <article className={`${CARD} border border-line-strong`} data-home-path="sessions">
            <Eyebrow color="text-gold">{say(ps.eyebrow, lang)}</Eyebrow>
            <h3 className="mt-3 text-[24px] font-extrabold leading-snug">{say(ps.title, lang)}</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-dim">{say(ps.line, lang)}</p>
            <ul className="mt-4 flex flex-wrap gap-2" data-home-groups>
              {GROUP_ORDER.map((id) => {
                const g = GROUPS[id];
                return (
                  <li key={id} className="rounded-full px-3 py-1 text-[13.5px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
                    {say(g.label, lang)}
                  </li>
                );
              })}
            </ul>
            <ol className="mt-5 space-y-1.5 text-[15px]" data-home-clarity>
              {ps.steps.map((step, i) => (
                <li key={step.en} className="flex gap-2.5">
                  <span className="font-mono font-semibold text-gold-dim">{i + 1}.</span>
                  {say(step, lang)}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col items-start gap-3 lg:mt-auto lg:pt-6">
              <Link href={clarityHref(lang)} className={`${GOLD} min-h-12 w-full`} data-home-clarity-book>
                {say(ps.book, lang)}
              </Link>
              <Link href={hiQ(programs.oneOnOneCoaching.url)} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-gold/60 underline-offset-4" data-home-all-programs>
                {say(ps.button, lang)}
              </Link>
              <p className="text-[13px] text-ink-dim">{say(ps.note, lang)}</p>
            </div>
          </article>
        </div>

        <div className="mt-10" data-home-more>
          <p className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{say(homeV2.more.heading, lang)}</p>
          <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {homeV2.more.items.map((item) => (
              <li key={item.id}>
                <Link href={hiQ(item.href)} className="group flex h-full items-center justify-between gap-4 rounded-sm border border-line-strong bg-void px-5 py-4 transition-colors hover:border-teal/50 hover:bg-panel" data-home-more-item={item.id}>
                  <span>
                    <span className="block text-[16.5px] font-extrabold text-ink">{say(item.title, lang)}</span>
                    <span className="mt-0.5 block text-[13.5px] text-ink-dim">{say(item.line, lang)}</span>
                  </span>
                  <span className="flex flex-none items-center gap-2 text-[16px] font-extrabold text-ink">
                    {item.price}
                    <span className="text-teal transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// 3. Video reviews: Sharp Brain (the same 7 Shorts as the Sharp Brain page), then Personal Sessions.
export function HomeSharpBrainReviews(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.reviews;
  const sessionCards = HOME_SESSION_REVIEW_IDS.map((id) => {
    const video = reviewVideo(id);
    return { videoId: id, thumbnailSrc: reviewFrameSrc(id, video.thumbFrame), frameShape: video.type, title: `“${say(video.caption, lang)}”`, alt: say(video.caption, lang) };
  });
  return (
    <section id="proof" className={`${SECTION} bg-panel`} aria-labelledby="home-reviews">
      <div className="mx-auto max-w-content">
        <h2 id="home-reviews" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <VideoReviewGrid videos={sharpBrainReviewCards(lang)} aspectRatioClassName="aspect-[9/16]" gridClassName={SHARP_BRAIN_REVIEW_GRID_CLASS} className="mt-8" />
        {/* Owner (homepage upgrade): a second row — Personal Sessions reviews (telepathy, meditation, mind), never Sharp Brain ones. */}
        <h2 className="mt-14 text-[26px] font-extrabold leading-tight sm:text-[34px]" data-home-sessions-reviews>
          {say(c.sessionsHeading, lang)}
        </h2>
        <VideoReviewGrid videos={sessionCards} aspectRatioClassName="aspect-[9/16]" gridClassName={SHARP_BRAIN_REVIEW_GRID_CLASS} className="mt-8" />
        <Link href="/reviews" className="mt-6 inline-flex min-h-11 items-center text-[15px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
          {say(c.more, lang)}
        </Link>
      </div>
    </section>
  );
}

// Partner strip → /partner.
// Owner (schools page brief, 15 Nov 2026): "For Schools" card → /schools.
export function HomeSchoolsCard(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.schools;
  return (
    <section className="border-b border-line px-4 py-12 sm:px-8 sm:py-14" data-home-schools>
      <div className="mx-auto flex max-w-content flex-col gap-5 rounded-sm border border-teal/30 bg-panel p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow color="text-teal">{say(c.eyebrow, lang)}</Eyebrow>
          <p className="mt-3 text-[20px] font-extrabold leading-snug sm:text-[24px]">{say(c.lead, lang)}</p>
          <p className="mt-2 text-[15.5px] leading-relaxed text-ink-dim">{say(c.body, lang)}</p>
        </div>
        <Link href={lang === "hi" ? `${SCHOOLS_HREF}?lang=hi` : SCHOOLS_HREF} className="inline-flex min-h-11 flex-none items-center justify-center rounded-sm bg-teal px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-teal-light">
          {say(c.button, lang)} →
        </Link>
      </div>
    </section>
  );
}

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

const clarityHref = (lang: "hi" | "en"): string => (lang === "hi" ? "/clarity-session?lang=hi" : "/clarity-session");

// How Personal Sessions work (owner, homepage upgrade): 3 steps + Clarity Session button.
const STEP_ICONS = [CalendarClock, Route, Headphones];
export function HomeHowSessions(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.howSessions;
  return (
    <section className={SECTION} aria-labelledby="home-how-sessions" data-home-how>
      <div className="mx-auto max-w-content">
        <h2 id="home-how-sessions" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {c.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Headphones;
            return (
              <li key={step.lead.en} className="flex flex-col gap-3 rounded-sm border border-line-strong bg-panel p-6">
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold-soft text-gold" aria-hidden="true">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-ink-faint">{index + 1}</span>
                </span>
                <p className="text-[16.5px] leading-relaxed">
                  <strong className="font-extrabold">{say(step.lead, lang)}</strong>
                  {step.rest !== null && <> — <span className="text-ink-dim">{say(step.rest, lang)}</span></>}
                </p>
              </li>
            );
          })}
        </ol>
        <Link href={clarityHref(lang)} className={`${GOLD} mt-8`} data-home-how-book>
          {say(c.button, lang)}
        </Link>
        {/* Owner (Calm Mind brief): one line for the live group batch — no new section. */}
        <p className="mt-4">
          <Link href={lang === "hi" ? "/online-retreat?lang=hi" : "/online-retreat"} className="inline-flex min-h-11 items-center text-[15.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4" data-home-calm-line>
            {say(CALM_COPY.homeLine, lang)}
          </Link>
        </p>
      </div>
    </section>
  );
}

// Free tools band (owner, homepage upgrade): 2 cards.
export function HomeFreeTools(): React.JSX.Element {
  const { lang } = useLanguage();
  // Owner (free-test buttons): each card has a 4px teal top border, a teal icon and the teal FreeTestButton.
  const card = "flex flex-col items-start gap-4 rounded-sm border border-t-4 border-line-strong border-t-[#0F766E] bg-panel px-6 py-6";
  const icon = "flex h-11 w-11 items-center justify-center rounded-full bg-[#DDF3EF] text-[#0F766E]";
  return (
    <section className={`${SECTION} bg-panel2`} data-home-free-tools>
      <div className="mx-auto grid max-w-content grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className={card} data-free-tool="overthinking">
          <span className={icon} aria-hidden="true">
            <Brain className="h-5 w-5" strokeWidth={2} />
          </span>
          <FreeTestButton test="overthinking" lang={lang} />
        </div>
        <div className={card} data-free-tool="reading">
          <span className={icon} aria-hidden="true">
            <BookOpen className="h-5 w-5" strokeWidth={2} />
          </span>
          <FreeTestButton test="reading" lang={lang} />
        </div>
      </div>
    </section>
  );
}

// Final call to action before the partner band (owner, homepage upgrade): dark band, 2 buttons.
export function HomeFinalCta(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.finalCta;
  return (
    <section className="bg-gradient-to-br from-[#0a1630] via-[#0b3a5c] to-[#0b7a74] px-4 py-16 text-center text-white sm:px-8 sm:py-20" data-home-final-cta>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
        <h2 className="text-[30px] font-extrabold leading-tight sm:text-[40px]">{say(c.heading, lang)}</h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href={clarityHref(lang)} className={GOLD}>
            {say(c.clarity, lang)}
          </Link>
          <Link href={sharpBrainHref(lang)} className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
            {say(c.sharpBrain, lang)}
          </Link>
          <Link href={lang === "hi" ? "/online-retreat?lang=hi" : "/online-retreat"} className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/40 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
            {say(c.retreat, lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}
