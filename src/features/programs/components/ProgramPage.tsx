import Image from "next/image";
import { CheckCircle2, Headphones } from "lucide-react";
import { CHANGE_ICONS } from "../changeIcons";
import { ASK_WHATSAPP, CAPACITY_LINE, COMMON, DISCLAIMERS, SHARED_PROGRAM_FAQS, GROUPS, say } from "../common";
import { programHeroImage } from "../images";
import { PLAN_COPY, PROGRAM_PLANS } from "../plans";
import { PlanCards, chooseButtonClass } from "./Plans";
import { ChoosePlanLink, ProgramViewContent } from "./Tracking";
import { SESSION_PLAN_PRICES } from "@/config/site.config";
import { bookingHref, clarityHref, getProgram, programHref } from "../programs";
import type { Program, ProgramLang } from "../types";
import { Faq } from "./Faq";
import { HeroMedia, ReviewCard, ReviewStrip } from "./Media";
import { ClarityCardSection, JourneySection, NotReadyBand, QuoteSection, TrustSection, WhatYouGetSection } from "./SharedBlocks";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import { waLink } from "@/data/links";
import { reviewVideo } from "../reviewVideos";
import { StickyBookBar } from "./StickyBookBar";
import { PERSONAL_SESSIONS_REVIEWS_HREF } from "./ReviewsPersonalSessions";
import { HUB } from "../hubCopy";

// Program page — sections in the owner's order (strict copy brief, Nov 8
// 2026, plus the plans brief), design tokens from the earlier design brief:
//  1 Hero · 2 Does this sound like you? · 3 Why this happens ·
//  4 What changes for you · 5 What you get · Plans for this program ·
//  6 Your journey · 7 Quote · 8 What participants experienced (only with
//  videos) · 9 Clarity Session card · Trusted by thousands ·
//  10 FAQ (+ the full-recordings FAQ as FAQ 5) + Often taken together + disclaimer.

const PHOTO = "/dr-kapil-real.jpg";
const wrap = "mx-auto w-full max-w-[1160px]";
const sectionPad = "px-4 py-14 sm:px-6 md:py-20";
const h2 = "text-[28px] font-extrabold leading-[1.2] md:text-[40px]";

export function ProgramPage({ program: p, lang }: { program: Program; lang: ProgramLang }): React.JSX.Element {
  const g = GROUPS[p.group];
  const hasVideos = p.reviews.length > 0;
  const book = clarityHref(p.slug, lang);
  const hubHref = lang === "hi" ? "/personal-sessions?lang=hi" : "/personal-sessions";
  const afterFoundation = p.disclaimers.includes("foundation");
  const faqs = [...p.faqs.filter((f) => f.hidden !== true), ...SHARED_PROGRAM_FAQS];
  const plans = PROGRAM_PLANS[p.slug];
  const deepPlans = plans.every((id) => id === "mastery" || id === "mentorship");
  const allPlansHref = lang === "hi" ? "/personal-sessions?lang=hi#plans" : "/personal-sessions#plans";
  // Owner's hero image (16:9) once it is in the image folder; until then the current video/photo.
  const heroImage = programHeroImage(p.slug);
  // Proof above the plans (conversion brief): the telepathy review on the spiritual pages ("Grow spiritually"), the stress review elsewhere.
  const spiritual = HUB.programs.doors.find((d) => d.id === "grow")?.programs.includes(p.slug) === true;
  const proofVideo = spiritual ? "h6KiUZKXqKM" : "1FO8UVfxJ9I";

  return (
    <>
      <ProgramViewContent name={p.name.en} />
      {/* 1 HERO */}
      <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-16">
        <div className={`${wrap} flex flex-wrap items-center gap-12`}>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-[18px]">
            <nav aria-label="Breadcrumb" className="text-[14px]">
              <a href={hubHref} className="text-[#AEB8CA] hover:text-white">
                {say(COMMON.breadcrumbHub, lang)}
              </a>{" "}
              <span className="text-[#5B6B85]">/</span> <span className="text-[#D6DCE8]">{say(p.name, lang)}</span>
            </nav>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full px-3 py-[3px] text-[13px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
                {say(g.label, lang)} · {say(COMMON.only1on1, lang)}
              </span>
              {afterFoundation && (
                <span className="rounded-full border border-[#F2A93B] px-3 py-[2px] text-[13px] font-extrabold text-[#F2A93B]" data-foundation-badge>
                  {say(COMMON.afterFoundation, lang)}
                </span>
              )}
            </div>
            <h1 className="text-[34px] font-extrabold leading-[1.15] md:text-[50px]">{say(p.h1, lang)}</h1>
            <p className="text-[18px] text-[#D6DCE8] md:text-[20px]">{say(p.subline, lang)}</p>
            {p.disclaimers.includes("traders") && (
              <p className="text-[14px] text-[#AEB8CA]" data-hero-disclaimer>
                {say(DISCLAIMERS.traders, lang)}
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-1.5">
              <a href={book} className="inline-flex min-h-12 items-center rounded-[10px] bg-[#F2A93B] px-7 py-3.5 text-[18px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A]" data-hero-book>
                {say(COMMON.bookButton, lang)}
              </a>
              <a href={waLink(ASK_WHATSAPP.message(p.name.en))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#5B6B85] px-6 py-3.5 text-[18px] font-semibold text-white hover:border-[#25D366]" data-hero-whatsapp>
                <WhatsAppGlyph />
                {say(ASK_WHATSAPP.label, lang)}
              </a>
            </div>
            {hasVideos && (
              <a href="#reviews" className="self-start text-[17px] font-semibold text-[#F2A93B] underline decoration-[#F2A93B]/50 underline-offset-4 hover:decoration-[#F2A93B]" data-hero-watch>
                {say(COMMON.watchButton, lang)}
              </a>
            )}
            <p className="text-[15px] text-[#AEB8CA]">{say(COMMON.experience, lang)}</p>
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            {heroImage !== null ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-[18px] border border-[#2C3D57] bg-[#16263D]" data-hero-media="image">
                <Image src={heroImage} alt={say(p.name, lang)} fill priority sizes="(min-width: 1024px) 460px, 92vw" className="object-cover" />
              </div>
            ) : (
              <HeroMedia videoId={p.reviews[0] ?? null} photoSrc={PHOTO} photoAlt={say(COMMON.photoAlt, lang)} lang={lang} />
            )}
          </div>
        </div>
      </section>

      {/* 2 DOES THIS SOUND LIKE YOU? */}
      <section className={`bg-white ${sectionPad}`} data-sound-like>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(COMMON.soundLikeHeading, lang)}</h2>
          <ul className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {p.soundLike.map((point) => (
              <li key={point.en} className="flex items-start gap-3 rounded-[14px] border border-[#E3E6EC] bg-[#FBFAF7] px-5 py-4 text-[18px]">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 flex-none" style={{ color: g.border }} strokeWidth={2.25} />
                {say(point, lang)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 WHY THIS HAPPENS */}
      <section className={`bg-[#EEF2FB] ${sectionPad}`} data-why>
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className={h2}>{say(COMMON.whyHeading, lang)}</h2>
          <p className="text-[19px] leading-[1.6] md:text-[22px]">
            {say(p.why.before, lang)}
            {p.why.missing !== undefined && (
              <>
                {" "}
                <strong className="font-extrabold">{say(p.why.missing, lang)}</strong>
              </>
            )}
            {p.why.after !== undefined && <> {say(p.why.after, lang)}</>}
          </p>
        </div>
      </section>

      {/* 4 WHAT CHANGES FOR YOU */}
      <section className={`bg-white ${sectionPad}`} data-changes>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(COMMON.changesHeading, lang)}</h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {p.changes.map((item, index) => {
              const Icon = CHANGE_ICONS[p.slug][index] ?? Headphones;
              return (
              <li key={item.en} className="flex flex-col gap-3 rounded-[16px] border border-[#E3E6EC] bg-white p-6" data-change-icon={Icon.displayName}>
                <Icon aria-hidden="true" className="h-7 w-7" style={{ color: g.border }} strokeWidth={1.75} />
                <p className="text-[18px] font-semibold leading-snug">{say(item, lang)}</p>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 5 WHAT YOU GET (shared) */}
      <WhatYouGetSection lang={lang} />

      {/* PLANS FOR THIS PROGRAM */}
      <section className={`bg-[#EEF2FB] ${sectionPad}`} data-program-plans>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(PLAN_COPY.programTitle, lang)}</h2>
          <div className="max-w-[460px]" data-plans-proof>
            <ReviewCard video={reviewVideo(proofVideo)} lang={lang} />
          </div>
          {deepPlans && (
            <p className="max-w-[820px] text-[18px] text-[#33415C]" data-plans-foundation>
              {say(PLAN_COPY.afterFoundation, lang)}
            </p>
          )}
          <PlanCards
            plans={plans}
            lang={lang}
            choose={(plan) => (
              <ChoosePlanLink href={bookingHref(p.slug, lang, plan.id)} planName={plan.name.en} feeInr={SESSION_PLAN_PRICES[plan.id].feeInr} planId={plan.id} className={chooseButtonClass(plan.mostChosen)}>
                {say(PLAN_COPY.choose, lang)}
              </ChoosePlanLink>
            )}
          />
          <p className="text-[17px] font-semibold text-[#33415C]" data-capacity-line>
            {say(CAPACITY_LINE, lang)}
          </p>
          <a href={allPlansHref} className="self-start text-[17px] font-extrabold text-[#1F3A8A] hover:text-[#152a66]" data-see-all-plans>
            {say(PLAN_COPY.seeAll, lang)}
          </a>
        </div>
      </section>

      {/* 6 YOUR JOURNEY · 7 QUOTE (shared) */}
      <JourneySection lang={lang} />
      <QuoteSection lang={lang} />

      {/* 8 WHAT PARTICIPANTS EXPERIENCED — hidden when the topic has no videos */}
      {hasVideos && (
        <section id="reviews" className={`scroll-mt-20 ${sectionPad}`}>
          <div className={`${wrap} flex flex-col gap-7`}>
            <h2 className={h2}>{say(COMMON.reviewsHeading, lang)}</h2>
            <ReviewStrip ids={p.reviews} lang={lang} />
            <a href={PERSONAL_SESSIONS_REVIEWS_HREF} className="text-[17px] font-extrabold text-[#1F3A8A] hover:text-[#152a66]" data-see-all-reviews>
              {say(HUB.proof.all, lang)}
            </a>
          </div>
        </section>
      )}

      {/* 9 CLARITY SESSION CARD (shared) */}
      <ClarityCardSection lang={lang} bookHref={book} />

      {/* TRUSTED BY THOUSANDS (shared) */}
      <TrustSection lang={lang} />

      {/* 10 FAQ + OFTEN TAKEN TOGETHER + DISCLAIMER */}
      <section className={sectionPad}>
        <div className={`${wrap} flex flex-wrap gap-12`}>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5">
            <h2 className="mb-2 text-[26px] font-extrabold leading-[1.2] md:text-[34px]">{say(COMMON.faqHeading(p.faqTopic), lang)}</h2>
            <Faq items={faqs.map((f) => ({ q: say(f.q, lang), a: say(f.a, lang) }))} />
            {p.disclaimers.map((d) => (
              <p key={d} className="mt-2 text-[14px] text-[#4A5568]" data-disclaimer={d}>
                {say(DISCLAIMERS[d], lang)}
              </p>
            ))}
          </div>
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
            <h2 className="mb-2 text-[26px] font-extrabold">{say(COMMON.relatedHeading, lang)}</h2>
            {p.related.map((slug) => {
              const r = getProgram(slug);
              const rg = GROUPS[r.group];
              return (
                <a
                  key={slug}
                  href={programHref(slug, lang)}
                  className="flex flex-col gap-1 rounded-[14px] border-[1.5px] border-[#E3E6EC] bg-white p-[18px] text-[#0E1B2C] no-underline transition-colors hover:border-[#0E1B2C]"
                  data-related={slug}
                >
                  <span className="self-start rounded-full px-2.5 py-0.5 text-[12px] font-extrabold" style={{ background: rg.tagBg, color: rg.tagFg }}>
                    {say(rg.label, lang)}
                  </span>
                  <span className="text-[19px] font-extrabold">{say(r.name, lang)}</span>
                  <span className="font-extrabold text-[#1F3A8A]">{say(COMMON.learnMore, lang)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {p.slug === "stress-anxiety-support" && <NotReadyBand lang={lang} />}

      <StickyBookBar href={book} label={say(COMMON.sticky, lang)} />
    </>
  );
}
