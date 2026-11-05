"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";
import { homeV2, say, telepathyHref } from "@/lib/homeV2Copy";
import { PriceLine } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import { Eyebrow } from "../ui";

// Phase 4.2 homepage sections (copy/home-v2.md), in the homepage's existing
// look (border-b sections, cards, gold buttons). No new CSS.

const SECTION = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";

// 2. "2 दिन बाद क्या बदलता है" — 4 tiles, each one link to the workshop page.
export function HomeBenefits(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.benefits;
  return (
    <section className={`${SECTION} bg-panel`} aria-labelledby="home-benefits">
      <div className="mx-auto max-w-content">
        <h2 id="home-benefits" className="text-[28px] font-extrabold leading-tight sm:text-[36px]">
          {say(c.heading, lang)}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.tiles.map((tile) => (
            <li key={tile.title.en}>
              <Link href={telepathyHref(lang)} className="flex h-full flex-col rounded-sm border border-line-strong bg-void p-6 transition-colors hover:border-gold">
                <span className="text-[19px] font-bold leading-snug text-ink">{say(tile.title, lang)}</span>
                <span className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{say(tile.body, lang)}</span>
                <span className="mt-auto pt-4 text-[14px] font-semibold text-gold">{say(c.more, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// 5. Muse 2 — "मानिए मत। देखिए।" (copy/home-hi.md / home-en.md).
export function HomeMuse(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.muse;
  return (
    <section className={SECTION} aria-labelledby="home-muse">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="home-muse" className="text-[28px] font-extrabold leading-tight sm:text-[36px]">
          {say(c.heading, lang)}
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-dim">{say(c.body, lang)}</p>
        <p className="mt-3 text-[14.5px] text-ink-faint">{say(c.note, lang)}</p>
      </div>
    </section>
  );
}

// 6. The journey ahead — 4 steps, left to right (top to bottom on phones).
export function HomeJourney(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.journey;
  return (
    <section className={`${SECTION} bg-panel`} aria-labelledby="home-journey">
      <div className="mx-auto max-w-content">
        <h2 id="home-journey" className="text-[28px] font-extrabold leading-tight sm:text-[36px]">
          {say(c.heading, lang)}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {c.steps.map((step, i) => (
            <li key={step.href}>
              <Link href={step.href === "telepathy" ? telepathyHref(lang) : step.href} className="flex h-full items-start gap-3 rounded-sm border border-line-strong bg-void p-5 transition-colors hover:border-gold">
                <span className="flex size-8 flex-none items-center justify-center rounded-full bg-gold font-bold text-[#1B1508]">{i + 1}</span>
                <span className="text-[16px] font-semibold leading-snug text-ink">{say(step.label, lang)} →</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// 7. For children — Sharp Brain (its own strip; the early-bird price/timer lives here only).
export function HomeSharpBrainStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.sharpBrain;
  return (
    <section className={SECTION} aria-labelledby="home-sharp-brain">
      <div className="mx-auto max-w-content rounded-sm border border-gold/40 bg-void p-6 sm:p-8">
        <Eyebrow color="text-gold">Sharp Brain</Eyebrow>
        <h2 id="home-sharp-brain" className="mt-3 text-[23px] font-extrabold leading-snug sm:text-[28px]">
          {say(c.title, lang)}
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-dim">{say(c.body, lang)}</p>
        <PriceLine className="mt-4" />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={FREE_TEST_LINKS.speedTest} className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-3 text-[14.5px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]">
            {say(c.test, lang)}
          </Link>
          <Link href={programs.sharpBrain.url} className="text-[14.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {say(c.see, lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}

// 8. Overthinking — one short strip.
export function HomeOverthinkingStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <section className="border-b border-line bg-panel px-4 py-8 sm:px-8">
      <p className="mx-auto max-w-content text-center text-[17px] font-semibold">
        <Link href={programs.overthinkingReset.url} className="text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-gold">
          {say(homeV2.overthinking, lang)} →
        </Link>
      </p>
    </section>
  );
}

// Franchise strip (copy/home-hi.md / home-en.md) → the trainer/franchise page.
export function HomeFranchiseStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.franchise;
  return (
    <section className="border-b border-line px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[16px] leading-relaxed text-ink-dim">
          <strong className="text-ink">{say(c.lead, lang)}</strong> {say(c.body, lang)}
        </p>
        <Link href={programs.franchise.url} className="inline-flex flex-none items-center justify-center rounded-sm border border-line-strong px-5 py-3 text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2">
          {say(c.button, lang)} →
        </Link>
      </div>
    </section>
  );
}
