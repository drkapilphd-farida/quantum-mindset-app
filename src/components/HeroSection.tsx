"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow, CtaButton } from "./ui";
import FrequencyDial from "./FrequencyDial";
import HeroTestimonialBadge from "./HeroTestimonialBadge";
import { HABIT_BUILDER_APP_URL } from "@/config/habitBuilderSignupLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

export default function HeroSection(): React.JSX.Element {
  const { t } = useLanguage();
  // General, cross-program quote (qsrPageOnly: false) — appropriate for
  // the homepage hero, which isn't specific to any one offer.
  const featuredTestimonial = t.testimonials.items.find((item) => item.id === "ananya-r");

  return (
    <section id="top" className="relative overflow-hidden border-b border-line px-6 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28">
      {/* signature visual, positioned behind content */}
      <div
        className="pointer-events-none absolute -right-40 top-1/2 hidden w-[720px] -translate-y-1/2 opacity-90 md:block lg:-right-24 xl:right-0"
        aria-hidden="true"
      >
        <FrequencyDial />
      </div>

      <div className="relative z-10 mx-auto grid max-w-content grid-cols-1 gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        {/* copy column */}
        <div className="max-w-xl">
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>

          {/* Authority Bar™ — credibility established before the pain-point
              headline lands, so the claim that follows reads as backed by
              a real, named expert rather than a random ad. Real facts
              only (no fabricated stats) — kept as short, scannable chips
              rather than woven into prose so it can't be skimmed past. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-ink-faint">
            {t.hero.credentials.map((credential, index) => (
              <span key={credential} className="inline-flex items-center gap-3">
                {index > 0 && <span className="h-1 w-1 rounded-full bg-ink-faint/60" aria-hidden="true" />}
                {credential}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-[38px] font-extrabold leading-[1.08] tracking-tight sm:text-[50px] lg:text-[58px]">
            {t.hero.headline}
            <span className="mt-2 block font-display text-[0.72em] font-normal italic text-gold">
              {t.hero.headlineEm}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-dim sm:text-[18px]">
            {t.hero.sub}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <CtaButton
              href={HABIT_BUILDER_APP_URL}
              variant="primary"
              accent="gold"
              onClick={() => trackGaEvent("signup_cta_click", { location: "home_hero" })}
            >
              {t.hero.ctaPrimary}
            </CtaButton>
            <CtaButton href="#begin" variant="ghost" accent="teal">
              {t.hero.ctaSecondary}
            </CtaButton>
          </div>

          {featuredTestimonial !== undefined && (
            <HeroTestimonialBadge
              className="mt-5"
              quote={featuredTestimonial.quote}
              name={featuredTestimonial.name}
              context={featuredTestimonial.context || featuredTestimonial.program}
            />
          )}

          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-none lg:flex lg:flex-wrap">
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="lg:min-w-[130px]">
                <div className="text-[14px] font-bold text-ink">{stat.value}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* portrait card */}
        <div className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto">
          <div className="relative overflow-hidden rounded-sm border border-line-strong bg-panel2">
            {/* Breathing-Room Frame™ — padding lives on THIS div, not on
                the image's own positioned box. A Next/Image `fill` child
                is absolutely positioned with inset:0, and per the CSS
                spec that's relative to the containing block's PADDING
                edge — so padding placed directly on the same element as
                `relative` would be ignored by the fill child and the
                photo would still touch the border. Padding here, on the
                outer card, guarantees real visual margin around the
                inner sized box on every side, independent of exactly how
                tightly the source photo itself was cropped. */}
            <div className="p-4 sm:p-5">
              <div className="relative aspect-[590/630] w-full">
                {/* Approved Founder Asset™ — dr-kapil-home-hero-portrait.png,
                    the real supplied file (untouched, unchanged, still on
                    disk exactly as delivered), cropped to frame head,
                    glasses, shoulders and upper torso. object-contain (not
                    object-cover) means the browser only ever shrinks the
                    photo to fit this box — it can't crop it — and the
                    p-4/p-5 padding above adds further margin beyond that
                    on every side, so the head/hair are never anywhere
                    near the card's outer border. */}
                <Image
                  src="/dr-kapil-home-hero-portrait.png"
                  alt={t.hero.portraitName}
                  fill
                  sizes="(min-width: 1024px) 330px, 78vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="border-t border-line-strong px-6 py-4 text-center">
              <div className="text-[15px] font-bold text-ink">{t.hero.portraitName}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                {t.hero.portraitTitle}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 h-full w-full -z-10 rounded-sm border border-gold/25" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
