import Image from "next/image";
import { COMMON, say } from "../common";
import { HUB } from "../hubCopy";
import { bookingHref } from "../programs";
import type { ProgramLang, ProgramSlug } from "../types";
import { Faq } from "./Faq";
import { HubBookingForm, HubBookingProvider, HubChoosePlan, HubPrograms, HubQuiz } from "./HubInteractive";
import { PLAN_COPY, PLAN_IDS, type SessionPlanId } from "../plans";
import { PlanCards, chooseButtonClass } from "./Plans";
import { HeroMedia, ReviewStrip } from "./Media";
import { HUB_REVIEWS } from "../reviewVideos";
import { StickyBookBar } from "./StickyBookBar";
import { ClarityCardContent, TrustSection, WhatYouGetSection } from "./SharedBlocks";
import { PERSONAL_SESSIONS_REVIEWS_HREF } from "./ReviewsPersonalSessions";

// /personal-sessions — design from design-personal-sessions-hub.html; section
// order from the owner's plans brief (Nov 2026): Hero → Three doors → Quiz →
// How it works → What you get → Choose your plan → Reviews → Trusted by
// thousands → About → Booking → FAQ.

const PHOTO = "/dr-kapil-real.jpg";
const wrap = "mx-auto w-full max-w-[1160px]";
const sectionPad = "px-4 py-14 sm:px-6 md:py-20";
const h2 = "text-[28px] font-extrabold leading-[1.2] md:text-[40px]";

export function HubPage({ lang, initialProgram, initialPlan }: { lang: ProgramLang; initialProgram: ProgramSlug | null; initialPlan: SessionPlanId | null }): React.JSX.Element {
  const h = HUB.hero;
  return (
    <HubBookingProvider initialProgram={initialProgram} initialPlan={initialPlan}>
      {/* HERO */}
      <section className="bg-[#0E1B2C] px-4 pb-16 pt-14 text-white sm:px-6 md:pt-[72px]">
        <div className={`${wrap} flex flex-wrap items-center gap-12`}>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
            <p className="text-[15px] font-semibold tracking-[0.06em] text-[#F2A93B]">{say(h.eyebrow, lang)}</p>
            <h1 className="text-[34px] font-extrabold leading-[1.15] md:text-[52px]">
              {say(h.h1a, lang)}
              <br />
              {say(h.h1b, lang)}
            </h1>
            <p className="text-[18px] text-[#D6DCE8] md:text-[20px]">{say(h.sub, lang)}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#book" className="inline-flex min-h-12 items-center rounded-[10px] bg-[#F2A93B] px-7 py-3.5 text-[18px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A]">
                {say(h.book, lang)}
              </a>
              <a href="#quiz" className="inline-flex min-h-12 items-center rounded-[10px] border-[1.5px] border-[#5B6B85] px-6 py-3.5 text-[18px] font-semibold text-white">
                {say(h.quiz, lang)}
              </a>
            </div>
            <a href={lang === "hi" ? "/stress-anxiety-support?lang=hi" : "/stress-anxiety-support"} className="self-start text-[17px] font-semibold text-[#F2A93B] underline decoration-[#F2A93B]/50 underline-offset-4 hover:decoration-[#F2A93B]" data-stress-link>
              {say(h.stressLink, lang)}
            </a>
          </div>
          <div className="min-w-0 flex-[1_1_400px]">
            {/* Owner: the intro video is not ready — the box shows the photo as its poster. */}
            <HeroMedia videoId={null} photoSrc={PHOTO} photoAlt={say(COMMON.photoAlt, lang)} lang={lang} caption={say(h.videoTitle, lang)} />
          </div>
        </div>
        <div className={`${wrap} mt-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4`}>
          {h.stats.map((stat) => (
            <div key={stat.value.en} className="rounded-[12px] border border-[#2C3D57] px-5 py-4">
              <p className="text-[30px] font-extrabold text-[#F2A93B]">{say(stat.value, lang)}</p>
              <p className="text-[#D6DCE8]">{say(stat.label, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THREE DOORS: WHAT ARE YOU HERE FOR? */}
      <section id="programs" className={sectionPad}>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(HUB.programs.title, lang)}</h2>
          <HubPrograms lang={lang} />
        </div>
      </section>

      {/* QUIZ */}
      <section id="quiz" className={`scroll-mt-20 bg-[#EEF2FB] ${sectionPad}`}>
        <div className="mx-auto flex max-w-[860px] flex-col gap-6">
          <div>
            <p className="text-[15px] font-semibold tracking-[0.06em] text-[#1F3A8A]">{say(HUB.quiz.eyebrow, lang)}</p>
            <h2 className={`${h2} mt-1`}>{say(HUB.quiz.title, lang)}</h2>
          </div>
          <HubQuiz lang={lang} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={sectionPad}>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(HUB.how.title, lang)}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {HUB.how.steps.map((step, index) => (
              <div key={step.title.en} className="flex flex-col gap-2.5 rounded-[16px] border border-[#E3E6EC] bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0E1B2C] text-[22px] font-extrabold text-[#F2A93B]">{index + 1}</span>
                <p className="text-[21px] font-extrabold">{say(step.title, lang)}</p>
                <p className="text-[#4A5568]">{say(step.text, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET (shared block, new in the Nov 8 copy) */}
      <WhatYouGetSection lang={lang} />

      {/* CHOOSE YOUR PLAN */}
      <section id="plans" className={`scroll-mt-20 bg-[#EEF2FB] ${sectionPad}`} data-hub-plans>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className={h2}>{say(PLAN_COPY.hubTitle, lang)}</h2>
          <PlanCards plans={PLAN_IDS} lang={lang} choose={(plan) => <HubChoosePlan plan={plan.id} lang={lang} className={chooseButtonClass(plan.mostChosen)} />} />
          <ul className="flex flex-col gap-2 text-[17px] text-[#33415C]" data-plan-rules>
            {PLAN_COPY.rules.map((rule) => (
              <li key={rule.en} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 flex-none rounded-full bg-[#1F3A8A]" />
                {say(rule, lang)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROOF */}
      <section className={sectionPad}>
        <div className={`${wrap} flex flex-col gap-7`}>
          <div>
            <h2 className={h2}>{say(HUB.proof.title, lang)}</h2>
            <p className="mt-1.5 text-[19px] text-[#4A5568]">{say(HUB.proof.sub, lang)}</p>
          </div>
          <ReviewStrip ids={HUB_REVIEWS} lang={lang} />
          <a href={PERSONAL_SESSIONS_REVIEWS_HREF} className="text-[17px] font-extrabold text-[#1F3A8A] hover:text-[#152a66]" data-see-all-reviews>
            {say(HUB.proof.all, lang)}
          </a>
        </div>
      </section>

      {/* TRUSTED BY THOUSANDS */}
      <TrustSection lang={lang} />

      {/* ABOUT */}
      <section className={`border-y border-[#E3E6EC] bg-white ${sectionPad}`}>
        <div className={`${wrap} flex flex-wrap items-center gap-10`}>
          <div className="relative aspect-[4/5] w-full max-w-[360px] flex-[1_1_280px] overflow-hidden rounded-[18px] bg-[#E3E6EC]">
            <Image src={PHOTO} alt={say(COMMON.photoAlt, lang)} fill sizes="(min-width: 768px) 360px, 92vw" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-3">
            <p className="text-[15px] font-semibold tracking-[0.06em] text-[#1F3A8A]">{say(HUB.about.eyebrow, lang)}</p>
            <h2 className={h2}>{say(HUB.about.name, lang)}</h2>
            <p className="text-[18px] text-[#33415C]">{say(HUB.about.text, lang)}</p>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" className="scroll-mt-16 bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-20">
        <div className={`${wrap} flex flex-wrap gap-10`}>
          {/* Left: the shared Clarity Session card text (owner: card text left, form right). */}
          <div className="min-w-0 flex-[1_1_340px]">
            <ClarityCardContent lang={lang} tone="dark" />
          </div>
          <div className="min-w-0 flex-[999_1_460px]">
            <HubBookingForm lang={lang} source={initialProgram ?? "hub"} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={sectionPad}>
        <div className="mx-auto flex max-w-[860px] flex-col gap-3.5">
          <h2 className={`${h2} mb-2`}>{say(HUB.faq.title, lang)}</h2>
          <Faq items={HUB.faq.items.map((f) => ({ q: say(f.q, lang), a: say(f.a, lang) }))} firstOpen size="lg" />
          <p className="mt-4 text-[14px] text-[#4A5568]" data-disclaimer>
            {say(HUB.faq.disclaimer, lang)}
          </p>
        </div>
      </section>

      <StickyBookBar href={bookingHref(null, lang)} label={say(COMMON.sticky, lang)} />
    </HubBookingProvider>
  );
}
