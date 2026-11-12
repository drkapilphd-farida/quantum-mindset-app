import { BedDouble, BookOpenCheck, CalendarCheck, Check, FileText, Heart, HeartPulse, LineChart, MessageCircle, MoonStar, Repeat, Video, Zap } from "lucide-react";
import Link from "next/link";
import { calmMindBatch, PAGE_VIDEOS } from "@/config/site.config";
import { waLink } from "@/data/links";
import { LanguageOverride } from "@/context/LanguageContext";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import SiteTodo from "@/components/site/SiteTodo";
import VideoReviewGrid from "@/components/VideoReviewGrid";
import { PageVideo } from "@/components/video/PageVideo";
import { HomeMeetKapil, HomeTrustStrip } from "@/components/home/HomeTrustMeet";
import { SHARP_BRAIN_REVIEW_GRID_CLASS } from "@/config/sharpBrainVideoReviews";
import { calmReviewVideos } from "../reviews";
import { reviewFrameSrc } from "@/lib/video/reviewFrames";
import { WhatsAppGlyph } from "@/features/programs/components/WhatsAppGlyph";
import { formatBatchDate, formatClassDate, type BatchState, type Lang } from "../batch";
import { CALM_COPY } from "../copy";
import { CalmReserveButton, CalmStickyBar, CalmViewContent } from "./CalmReserve";

// /calm-mind-batch — 21-Day Calm Mind live online batch (owner's brief,
// Nov 2026), in the site's cream/gold style. Sections in the brief's order.

const say = (text: { en: string; hi: string }, lang: Lang): string => text[lang];
const SECTION = "border-b border-line px-4 py-14 sm:px-8 sm:py-20";
const WRAP = "mx-auto max-w-content";
const H2 = "text-[26px] font-extrabold leading-tight sm:text-[34px]";

const FAMILIAR_ICONS = [MoonStar, HeartPulse, Repeat, BedDouble];
const GET_ICONS = [Video, CalendarCheck, MessageCircle, FileText, LineChart, BookOpenCheck];

function Disclaimer({ lang, className = "" }: { lang: Lang; className?: string }): React.JSX.Element {
  return (
    <p className={`text-[12.5px] leading-relaxed text-ink-dim ${className}`} data-calm-disclaimer>
      {say(CALM_COPY.disclaimer, lang)}
    </p>
  );
}

function AskLink({ lang, className = "" }: { lang: Lang; className?: string }): React.JSX.Element {
  return (
    <a href={waLink(CALM_COPY.askMessage)} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-2 text-[15.5px] font-semibold underline decoration-gold/60 underline-offset-4 ${className}`} data-calm-ask>
      <WhatsAppGlyph />
      {say(CALM_COPY.hero.ask, lang)}
    </a>
  );
}

export function CalmBatchPage({ lang, state, checkout }: { lang: Lang; state: BatchState; checkout: boolean }): React.JSX.Element {
  const b = calmMindBatch.nextBatch;
  const start = formatBatchDate(b.startDate, lang);
  const batchLine = say(CALM_COPY.hero.batchLine(start, say(b.days, lang), say(b.time, lang)), lang);
  const ended = state.status === "ended";
  const seatsLine = state.showSeats && state.seatsLeft !== null ? say(CALM_COPY.hero.seatsLeft(state.seatsLeft), lang) : null;
  const reviews = calmReviewVideos().map((video) => ({ videoId: video.id, thumbnailSrc: reviewFrameSrc(video.id, video.thumbFrame), frameShape: video.type, title: `“${say(video.caption, lang)}”`, alt: say(video.caption, lang) }));
  const c = CALM_COPY;
  const faqs = [
    c.faq.missed,
    c.faq.camera,
    c.faq.language,
    c.faq.medication,
    c.faq.time,
    c.faq.links,
    { q: c.faq.after.q, a: { en: c.faq.after.a.en + (calmMindBatch.upgradeAdjust ? c.faq.after.adjust.en : ""), hi: c.faq.after.a.hi + (calmMindBatch.upgradeAdjust ? c.faq.after.adjust.hi : "") } },
  ];
  const languageLink = lang === "hi" ? { label: "English", href: "/calm-mind-batch" } : { label: "हिंदी", href: "/calm-mind-batch?lang=hi" };

  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        <CalmViewContent />
        <SiteNav languageLink={languageLink} cta={{ label: say(c.hero.reserve, lang), href: "#calm-price", external: false }} />
        <main>
          {/* 2.1 HERO — one video, placed by the grid: under the headline on phones, beside the text on desktop. */}
          <section id="calm-hero" className="border-b border-line px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
            <div className={`${WRAP} grid grid-cols-1 gap-y-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-14 lg:gap-y-0`}>
              <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
                <span className="inline-flex rounded-full bg-[#0F766E] px-3 py-1 text-[12.5px] font-bold tracking-[0.04em] text-white" data-calm-pill>
                  {say(c.hero.pill, lang)}
                </span>
                <h1 className="mt-4 text-balance text-[32px] font-extrabold leading-[1.12] tracking-tight sm:text-[44px] lg:text-[50px]">{say(c.hero.h1, lang)}</h1>
              </div>
              <PageVideo video={PAGE_VIDEOS.stress} lang={lang} tone="light" priority className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />
              <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
                <p className="max-w-xl text-[16.5px] leading-relaxed text-ink-dim sm:text-[18px] lg:mt-5">{say(c.hero.sub, lang)}</p>
                <p className="mt-4 text-[15.5px] font-semibold text-ink" data-calm-batch-line>
                  {ended ? say(c.ended, lang) : batchLine}
                </p>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <CalmReserveButton state={state} checkout={checkout} lang={lang} />
                  {seatsLine !== null && <p className="text-[14px] font-semibold text-[#B45309]" data-calm-seats>{seatsLine}</p>}
                  <AskLink lang={lang} />
                </div>
              </div>
            </div>
          </section>
          <HomeTrustStrip />

          {/* 2.2 DOES THIS FEEL FAMILIAR? */}
          <section className={SECTION} data-calm-familiar>
            <div className={WRAP}>
              <h2 className={H2}>{say(c.familiar.heading, lang)}</h2>
              <ul className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {c.familiar.cards.map((card, i) => {
                  const Icon = FAMILIAR_ICONS[i] ?? Heart;
                  return (
                    <li key={card.en} className="flex items-start gap-3.5 rounded-sm border border-line-strong bg-panel px-5 py-4 text-[16.5px] leading-relaxed">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#DDF3EF] text-[#0F766E]" aria-hidden="true">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      {say(card, lang)}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-7 max-w-3xl text-[17.5px] font-bold leading-relaxed sm:text-[19px]">{say(c.familiar.closing, lang)}</p>
            </div>
          </section>

          {/* 2.3 WHAT YOU GET */}
          <section className={`${SECTION} bg-panel`} data-calm-get>
            <div className={WRAP}>
              <h2 className={H2}>{say(c.get.heading, lang)}</h2>
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {c.get.cards.map((card, i) => {
                  const Icon = GET_ICONS[i] ?? Zap;
                  return (
                    <li key={card.title.en} className="flex flex-col gap-2.5 rounded-sm border border-line-strong bg-void p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft text-gold" aria-hidden="true">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <p className="text-[17px] font-extrabold leading-snug">{say(card.title, lang)}</p>
                      <p className="text-[15px] leading-relaxed text-ink-dim">{say(card.line, lang)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* 2.4 YOUR 21-DAY JOURNEY */}
          <section className={SECTION} data-calm-journey>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(c.journey.heading, lang)}</h2>
              <ol className="relative mt-8 space-y-6 border-l-2 border-line-strong pl-7">
                {c.journey.steps.map((step, i) => (
                  <li key={step.title.en} className="relative">
                    <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-gold text-[14px] font-extrabold text-[#1B1508]">{i + 1}</span>
                    <p className="font-mono text-[12.5px] uppercase tracking-[0.06em] text-gold">{b.classDates[i] !== undefined ? formatClassDate(b.classDates[i], lang) : ""}</p>
                    <p className="mt-1 text-[18px] font-extrabold">{say(step.title, lang)}</p>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-ink-dim">{say(step.line, lang)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 2.5 BY DAY 21 */}
          <section className={`${SECTION} bg-panel`} data-calm-outcomes>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(c.outcomes.heading, lang)}</h2>
              <ul className="mt-7 space-y-3">
                {c.outcomes.items.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 text-[17px] leading-relaxed">
                    <Check className="mt-1 h-5 w-5 flex-none text-gold" strokeWidth={3} aria-hidden="true" />
                    {say(item, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 2.6 HOW EVERY LIVE CLASS RUNS */}
          <section className={SECTION} data-calm-class>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(c.classRuns.heading, lang)}</h2>
              <div className="mt-7 flex overflow-hidden rounded-sm border border-line-strong">
                {c.classRuns.segments.map((seg, i) => (
                  <div key={seg.label.en} className={`flex flex-col justify-center px-3 py-4 text-center ${i === 0 ? "bg-gold-soft" : i === 1 ? "bg-[#DDF3EF]" : "bg-panel2"}`} style={{ flexGrow: seg.minutes, flexBasis: 0 }}>
                    <span className="text-[20px] font-extrabold sm:text-[24px]">
                      {seg.minutes} {say(c.classRuns.min, lang)}
                    </span>
                    <span className="text-[13.5px] font-semibold text-ink-dim sm:text-[15px]">{say(seg.label, lang)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[15.5px] text-ink-dim">{say(c.classRuns.line, lang)}</p>
            </div>
          </section>

          {/* 2.7 MEET DR. KAPIL (homepage component) */}
          <HomeMeetKapil />

          {/* 2.8 REVIEWS */}
          <section className={`${SECTION} bg-panel`} data-calm-reviews>
            <div className={WRAP}>
              <h2 className={H2}>{say(c.reviews.heading, lang)}</h2>
              <p className="mt-2 text-[16px] text-ink-dim">{say(c.reviews.sub, lang)}</p>
              <VideoReviewGrid videos={reviews} aspectRatioClassName="aspect-[9/16]" gridClassName={`${SHARP_BRAIN_REVIEW_GRID_CLASS} lg:grid-cols-6`} className="mt-8" />
            </div>
          </section>

          {/* 2.9 PRICE CARD */}
          <section id="calm-price" className={`scroll-mt-20 ${SECTION}`} data-calm-price>
            <div className="mx-auto max-w-lg rounded-sm border-[3px] border-gold bg-panel p-6 text-center shadow-[0_18px_40px_-18px_rgba(20,32,56,0.35)] sm:p-8">
              <h2 className="text-[22px] font-extrabold leading-snug sm:text-[26px]">{say(c.price.title, lang)}</h2>
              <p className="mt-4 text-[52px] font-extrabold leading-none tracking-tight">₹2,999</p>
              <p className="mt-1.5 text-[14px] text-ink-dim">{say(c.price.sub, lang)}</p>
              <p className="mt-4 text-[15px] font-semibold">{ended ? say(c.ended, lang) : batchLine}</p>
              <p className="mt-1 text-[14px] text-ink-dim">
                {say(c.price.seats, lang)}
                {state.showSeats && state.seatsLeft !== null && <span className="font-semibold text-[#B45309]"> · {say(c.price.seatsLeftShort(state.seatsLeft), lang)}</span>}
              </p>
              <ul className="mx-auto mt-5 flex max-w-sm flex-wrap justify-center gap-2 text-[14px]" data-calm-included>
                {c.price.included.map((item) => (
                  <li key={item.en} className="rounded-full border border-gold/50 bg-gold-soft px-3 py-1">
                    {say(item, lang)}
                  </li>
                ))}
              </ul>
              <CalmReserveButton state={state} checkout={checkout} lang={lang} className="mt-6" full />
              {calmMindBatch.upgradeAdjust && <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{say(c.price.upgrade, lang)}</p>}
              <div className="mt-4" data-calm-refund>
                <SiteTodo>Refund line for the batch: the /clarity-session text names the Clarity Session and ₹1,100 — waiting for the owner&apos;s batch wording.</SiteTodo>
              </div>
              <Disclaimer lang={lang} className="mt-4" />
            </div>
          </section>

          {/* 2.10 GROUP BATCH OR 1-ON-1? */}
          <section className={`${SECTION} bg-panel`} data-calm-compare>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(c.compare.heading, lang)}</h2>
              <div className="mt-7 overflow-hidden rounded-sm border border-line-strong bg-void">
                <table className="w-full table-fixed border-collapse text-left text-[14.5px] sm:text-[15.5px]">
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th scope="col" className="w-[26%] px-3 py-3 sm:px-4"><span className="sr-only">—</span></th>
                      <th scope="col" className="bg-gold-soft px-3 py-3 font-extrabold sm:px-4">{say(c.compare.batch, lang)}</th>
                      <th scope="col" className="px-3 py-3 font-extrabold sm:px-4">{say(c.compare.oneOnOne, lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.compare.rows.map((row) => (
                      <tr key={row.label.en} className="border-b border-line align-top">
                        <th scope="row" className="px-3 py-3 font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-faint sm:px-4">{say(row.label, lang)}</th>
                        <td className="bg-gold-soft/50 px-3 py-3 sm:px-4">{say(row.batch, lang)}</td>
                        <td className="px-3 py-3 sm:px-4">{say(row.one, lang)}</td>
                      </tr>
                    ))}
                    <tr className="align-top">
                      <td className="px-3 py-4 sm:px-4" />
                      <td className="bg-gold-soft/50 px-3 py-4 sm:px-4">
                        <CalmReserveButton state={state} checkout={checkout} lang={lang} label={say(c.compare.batchButton, lang)} className="!px-3 !text-[14.5px]" full />
                      </td>
                      <td className="px-3 py-4 sm:px-4">
                        <Link href={lang === "hi" ? "/clarity-session?lang=hi" : "/clarity-session"} className="inline-flex min-h-12 w-full items-center justify-center rounded-sm border-2 border-ink px-3 py-3 text-center text-[14.5px] font-semibold text-ink hover:bg-panel2">
                          {say(c.compare.oneButton, lang)}
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 2.11 FAQ */}
          <section className={SECTION} data-calm-faq>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(c.faq.heading, lang)}</h2>
              <div className="mt-7 divide-y divide-line border-y border-line">
                {faqs.map((item) => (
                  <details key={item.q.en} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                      {say(item.q, lang)}
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 pr-8 text-[15.5px] leading-relaxed text-ink-dim">{say(item.a, lang)}</p>
                  </details>
                ))}
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                    {say(c.faq.refund.q, lang)}
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 pr-8">
                    <SiteTodo>Refund answer: waiting for the owner&apos;s batch refund wording (the /clarity-session text names the Clarity Session and ₹1,100).</SiteTodo>
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* 2.12 FINAL CTA (dark, like the homepage) */}
          <section className="bg-[#14161c] px-4 py-16 text-center text-[#f5f1e6] sm:px-8 sm:py-20" data-calm-final>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-[28px] font-extrabold leading-tight sm:text-[38px]">{ended ? say(c.ended, lang) : say(c.finalCta.heading(start), lang)}</h2>
              <CalmReserveButton state={state} checkout={checkout} lang={lang} />
              <AskLink lang={lang} className="text-[#f5f1e6]" />
            </div>
          </section>

          <div className="px-4 py-6 sm:px-8">
            <Disclaimer lang={lang} className="mx-auto max-w-content text-center" />
          </div>
        </main>
        <Footer />
        <WhatsAppWidget bottomClassName="bottom-24 sm:bottom-7" />
        <CalmStickyBar state={state} checkout={checkout} lang={lang} />
      </div>
    </LanguageOverride>
  );
}
