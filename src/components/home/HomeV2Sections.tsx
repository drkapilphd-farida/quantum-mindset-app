"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";
import { SHARP_BRAIN_REVIEW_CARDS, SHARP_BRAIN_REVIEW_GRID_CLASS } from "@/config/sharpBrainVideoReviews";
import { HOME_SESSION_REVIEW_IDS, homeV2, say, sharpBrainHref } from "@/lib/homeV2Copy";
import { GROUPS } from "@/features/programs/common";
import { reviewVideo } from "@/features/programs/reviewVideos";
import Image from "next/image";
import { CalendarClock, Headphones, Route } from "lucide-react";
import { trainer } from "@/config/site.config";
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
            <Link href={lang === "hi" ? "/stress-anxiety-support?lang=hi" : "/stress-anxiety-support"} className="mt-4 inline-flex min-h-11 items-center self-start rounded-sm border-2 border-[#0F766E] bg-[#DDF3EF] px-4 py-2 text-[16px] font-extrabold text-[#0B5E57]" data-home-stress>
              {say(ps.first, lang)}
            </Link>
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

// 3. Video reviews: Sharp Brain (the same 7 Shorts as the Sharp Brain page), then Personal Sessions.
export function HomeSharpBrainReviews(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.reviews;
  const sessionCards = HOME_SESSION_REVIEW_IDS.map((id) => {
    const video = reviewVideo(id);
    return { videoId: id, thumbnailSrc: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, title: `“${say(video.caption, lang)}”`, alt: say(video.caption, lang) };
  });
  return (
    <section id="proof" className={`${SECTION} bg-panel`} aria-labelledby="home-reviews">
      <div className="mx-auto max-w-content">
        <h2 id="home-reviews" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
          {say(c.heading, lang)}
        </h2>
        <VideoReviewGrid videos={SHARP_BRAIN_REVIEW_CARDS} aspectRatioClassName="aspect-[9/16]" gridClassName={SHARP_BRAIN_REVIEW_GRID_CLASS} className="mt-8" />
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

// Trust strip under the hero (owner, homepage upgrade): one line of 4 facts.
export function HomeTrustStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <section className="border-b border-line bg-panel px-4 py-5 sm:px-8" aria-label={lang === "hi" ? "भरोसा" : "Trust"} data-home-trust>
      <ul className="mx-auto grid max-w-content grid-cols-2 gap-x-4 gap-y-2.5 text-center text-[14px] font-semibold text-ink sm:text-[15px] lg:flex lg:items-center lg:justify-between lg:gap-0">
        {homeV2.trust.map((item, index) => (
          <li key={item.en} className="flex items-center justify-center gap-4">
            {index > 0 && <span className="hidden text-line-strong lg:inline" aria-hidden="true">|</span>}
            {say(item, lang)}
          </li>
        ))}
      </ul>
    </section>
  );
}

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
      </div>
    </section>
  );
}

// Meet Dr. Kapil (owner, homepage upgrade): the photo that was in the hero, 3 lines, "My story".
export function HomeMeetKapil(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.meet;
  return (
    <section className={SECTION} aria-labelledby="home-meet" data-home-meet>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
        <div className="relative mx-auto aspect-[1374/1145] w-full max-w-[520px] overflow-hidden rounded-sm border border-line-strong bg-panel2">
          <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="(min-width: 768px) 480px, 92vw" className="object-cover object-top" />
        </div>
        <div>
          <h2 id="home-meet" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
            {say(c.heading, lang)}
          </h2>
          <ul className="mt-6 space-y-3 text-[17px] leading-relaxed">
            {c.lines.map((line) => (
              <li key={line.en} className="flex items-start gap-2.5">
                <span className="font-bold text-gold" aria-hidden="true">✓</span>
                {say(line, lang)}
              </li>
            ))}
          </ul>
          <Link href="/about" className="mt-6 inline-flex min-h-11 items-center text-[15.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {say(c.story, lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// Free tools band (owner, homepage upgrade): 2 cards.
export function HomeFreeTools(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.freeTools;
  const card = "flex min-h-[88px] items-center justify-between gap-4 rounded-sm border border-line-strong bg-panel px-6 py-5 text-[17px] font-extrabold text-ink transition-colors hover:border-gold";
  return (
    <section className={`${SECTION} bg-panel2`} data-home-free-tools>
      <div className="mx-auto grid max-w-content grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Link href={FREE_TEST_LINKS.overthinkingTest} className={card}>
          {say(c.overthinking, lang)} <span aria-hidden="true" className="text-gold">→</span>
        </Link>
        <Link href={FREE_TEST_LINKS.speedTest} className={card}>
          {say(c.reading, lang)} <span aria-hidden="true" className="text-gold">→</span>
        </Link>
      </div>
    </section>
  );
}

// Final call to action before the partner band (owner, homepage upgrade): dark band, 2 buttons.
export function HomeFinalCta(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.finalCta;
  return (
    <section className="bg-[#14161c] px-4 py-16 text-center text-[#f5f1e6] sm:px-8 sm:py-20" data-home-final-cta>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
        <h2 className="text-[30px] font-extrabold leading-tight sm:text-[40px]">{say(c.heading, lang)}</h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href={clarityHref(lang)} className={GOLD}>
            {say(c.clarity, lang)}
          </Link>
          <Link href={sharpBrainHref(lang)} className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/30 px-6 py-3 text-[15px] font-semibold text-[#f5f1e6] transition-colors hover:bg-white/10">
            {say(c.sharpBrain, lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}
