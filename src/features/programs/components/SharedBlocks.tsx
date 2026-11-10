import Image from "next/image";
import { CLARITY_CARD, COMMON, JOURNEY, NOT_READY, OVERTHINKING_TEST_HREF, QUOTE, REFUND_LINE, STATS, TRUST, WHAT_YOU_GET, say } from "../common";
import { GALLERY_PHOTOS } from "@/config/galleryPhotos";
import { meRecordingImage } from "../images";
import type { ProgramLang } from "../types";

// Shared blocks from the approved copy (Nov 8, 2026), used on all 15
// program pages and on the hub: What you get, Your journey, Quote band and
// the Clarity Session card.

const wrap = "mx-auto w-full max-w-[1160px]";
const h2 = "text-[28px] font-extrabold leading-[1.2] md:text-[40px]";
const RECORDING_ALT = { en: "Dr. Kapil Dev Sharma recording a meditation", hi: "मेडिटेशन रिकॉर्ड करते हुए डॉ. कपिल देव शर्मा" };

/** Six workshop photos from the existing gallery (src/config/galleryPhotos.ts). */
const WORKSHOP_PHOTOS = GALLERY_PHOTOS.filter((photo): photo is typeof photo & { src: string } => photo.src !== undefined && photo.category === "workshops").slice(0, 6);

export function Tick({ color }: { color: string }): React.JSX.Element {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] flex-none">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

/** Section 5 — What you get (navy), with the amber-bordered highlight box. */
export function WhatYouGetSection({ lang }: { lang: ProgramLang }): React.JSX.Element {
  // Owner's photo recording a meditation — shown once me-recording.jpg is in the image folder.
  const photo = meRecordingImage();
  return (
    <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-20" data-what-you-get>
      <div className={`${wrap} flex flex-col gap-7`}>
        <h2 className={h2}>{say(WHAT_YOU_GET.heading, lang)}</h2>
        <ul className="grid grid-cols-1 gap-x-10 gap-y-3.5 md:grid-cols-2">
          {WHAT_YOU_GET.items.map((item) => (
            <li key={item.lead.en} className="flex gap-2.5 text-[18px] text-[#D6DCE8]">
              <Tick color="#F2A93B" />
              <span>
                <strong className="font-extrabold text-white">{say(item.lead, lang)}</strong>
                {item.rest !== undefined && <> — {say(item.rest, lang)}</>}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-stretch gap-6">
          {photo !== null && (
            <div className="relative aspect-[4/3] min-h-[220px] w-full flex-[1_1_300px] overflow-hidden rounded-[16px] bg-[#16263D]" data-me-recording>
              <Image src={photo} alt={say(RECORDING_ALT, lang)} fill sizes="(min-width: 1024px) 420px, 92vw" className="object-cover" />
            </div>
          )}
          <p className="flex-[999_1_420px] self-center rounded-[16px] border-2 border-[#F2A93B] bg-[#16263D] p-6 text-[18px] leading-relaxed text-white md:p-7" data-meditation-highlight>
            {say(WHAT_YOU_GET.highlight, lang)}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Section 6 — Your journey: horizontal timeline on desktop, vertical on phone. */
export function JourneySection({ lang }: { lang: ProgramLang }): React.JSX.Element {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-20" data-journey>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{say(JOURNEY.heading, lang)}</h2>
        <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-5">
          {/* connecting line: vertical on phone, horizontal on desktop */}
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-0.5 bg-[#E3E6EC] md:bottom-auto md:left-[10%] md:right-[10%] md:top-6 md:h-0.5 md:w-auto" />
          {JOURNEY.steps.map((step, index) => (
            <li key={step.lead.en} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#0E1B2C] text-[20px] font-extrabold text-[#F2A93B]">{index + 1}</span>
              <p className="pt-2 text-[17px] md:pt-0">
                <strong className="block text-[19px] font-extrabold">{say(step.lead, lang)}</strong>
                {step.rest !== undefined && <span className="text-[#4A5568]">{say(step.rest, lang)}</span>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Section 7 — Quote band (navy). */
export function QuoteSection({ lang }: { lang: ProgramLang }): React.JSX.Element {
  return (
    <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-[72px]">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3.5 text-center">
        <p className="text-[24px] font-extrabold leading-[1.35] md:text-[32px]">{say(QUOTE, lang)}</p>
        <p className="text-[18px] text-[#AEB8CA]">{say(COMMON.quoteBy, lang)}</p>
      </div>
    </section>
  );
}

/** The Clarity Session card's text (eyebrow, title, price, ticks, note) — on the hub it sits beside the form. */
export function ClarityCardContent({ lang, tone }: { lang: ProgramLang; tone: "light" | "dark" }): React.JSX.Element {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-4" data-clarity-card>
      <p className={`text-[15px] font-semibold tracking-[0.06em] ${dark ? "text-[#F2A93B]" : "text-[#1F3A8A]"}`}>{say(CLARITY_CARD.eyebrow, lang)}</p>
      <h2 className={h2}>{say(CLARITY_CARD.title, lang)}</h2>
      <p className={`text-[34px] font-extrabold leading-[1.1] md:text-[44px] ${dark ? "text-[#F2A93B]" : "text-[#0E1B2C]"}`}>{say(CLARITY_CARD.price, lang)}</p>
      <div className="flex flex-col gap-2.5">
        {CLARITY_CARD.ticks.map((tick) => (
          <p key={tick.en} className="flex gap-2.5 text-[18px]">
            <Tick color={dark ? "#F2A93B" : "#1F3A8A"} />
            {say(tick, lang)}
          </p>
        ))}
      </div>
      <p className="text-[17px] font-extrabold" data-clarity-note>
        {say(CLARITY_CARD.note, lang)}
      </p>
      <p className={`rounded-[12px] border px-4 py-3 text-[16px] ${dark ? "border-[#2C3D57] text-[#D6DCE8]" : "border-[#E3E6EC] bg-[#FBFAF7] text-[#33415C]"}`} data-refund-line>
        {say(REFUND_LINE, lang)}
      </p>
    </div>
  );
}

/** Section 9 — Clarity Session card on the program pages: amber section, white card, button to the hub form. */
export function ClarityCardSection({ lang, bookHref }: { lang: ProgramLang; bookHref: string }): React.JSX.Element {
  return (
    <section className="bg-[#F2A93B] px-4 py-14 sm:px-6 md:py-16" data-clarity-section>
      <div className="mx-auto max-w-[760px] rounded-[18px] bg-white p-7 shadow-[0_18px_40px_-20px_rgba(14,27,44,0.45)] md:p-10">
        <ClarityCardContent lang={lang} tone="light" />
        <a href={bookHref} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-[#0E1B2C] px-7 py-4 text-[18px] font-extrabold text-white sm:w-auto" data-band-book>
          {say(CLARITY_CARD.button, lang)}
        </a>
      </div>
    </section>
  );
}

/** "Trusted by thousands" band (hub and every program page, just before the FAQ): 4 numbers, 6 workshop photos, the podcast feature. */
export function TrustSection({ lang }: { lang: ProgramLang }): React.JSX.Element {
  return (
    <section className="border-y border-[#E3E6EC] bg-white px-4 py-14 sm:px-6 md:py-20" data-trust>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{say(TRUST.heading, lang)}</h2>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4" data-trust-stats>
          {STATS.map((stat) => (
            <div key={stat.value.en} className="rounded-[14px] border border-[#E3E6EC] bg-[#FBFAF7] px-5 py-4">
              <p className="text-[28px] font-extrabold text-[#1F3A8A] md:text-[32px]">{say(stat.value, lang)}</p>
              <p className="text-[16px] text-[#4A5568]">{say(stat.label, lang)}</p>
            </div>
          ))}
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6 *:snap-start" data-trust-photos>
          {WORKSHOP_PHOTOS.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] w-[220px] flex-none overflow-hidden rounded-[12px] bg-[#E3E6EC] sm:w-auto">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 190px, (min-width: 640px) 33vw, 220px" className="object-cover" />
            </div>
          ))}
        </div>
        <a
          href={TRUST.podcastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-wrap items-center gap-5 rounded-[16px] border border-[#E3E6EC] bg-[#0E1B2C] p-4 text-white no-underline sm:p-5"
          data-trust-podcast
        >
          <span className="relative aspect-video w-full flex-[1_1_260px] overflow-hidden rounded-[10px] sm:max-w-[320px]">
            <Image src={TRUST.podcastThumb} alt="" fill sizes="320px" className="object-cover" />
          </span>
          <span className="flex min-w-0 flex-[999_1_280px] flex-col gap-1.5">
            <span className="text-[14px] font-semibold tracking-[0.06em] text-[#F2A93B]">{say(TRUST.podcastEyebrow, lang)}</span>
            <span className="text-[22px] font-extrabold leading-[1.25]">{say(TRUST.podcastTitle, lang)}</span>
            <span className="font-extrabold text-[#F2A93B] group-hover:underline">{say(TRUST.podcastLink, lang)}</span>
          </span>
        </a>
      </div>
    </section>
  );
}

/** "Not ready to book yet?" band (after the FAQ on the hub and the Stress page) → the free Overthinking Test. */
export function NotReadyBand({ lang }: { lang: ProgramLang }): React.JSX.Element {
  return (
    <section className="px-4 pb-14 sm:px-6 md:pb-20" data-not-ready>
      <a
        href={OVERTHINKING_TEST_HREF}
        className="mx-auto flex max-w-[860px] items-center justify-between gap-4 rounded-[16px] border-2 border-[#0F766E] bg-[#DDF3EF] px-6 py-5 text-[18px] font-extrabold leading-snug text-[#0B5E57] no-underline hover:bg-[#cdeee8] md:text-[20px]"
      >
        <span>{say(NOT_READY, lang)}</span>
        <span aria-hidden="true" className="text-[26px]">→</span>
      </a>
    </section>
  );
}
