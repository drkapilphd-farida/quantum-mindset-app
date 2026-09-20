"use client";

import Image from "next/image";
import { Eyebrow, CtaButton } from "../ui";
import { PREFRONTAL_POWER_REGISTRATION_URL } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// V3 — major hero redesign. Split editorial layout (text left, real
// founder portrait right) replaces V2's centered typographic/FrequencyDial
// treatment, per explicit instruction that the plain version "has no
// founder/experience visual." Portrait is a real, approved Dr. Kapil
// Sharma photo (dr-kapil-about.png), cropped to an elegant bust
// portrait excluding the source's baked-in wall text and signature —
// not a full-screen background, not AI-generated. A different photo
// from dr-kapil-learning.png (used in the Trainer section further
// down this same page) so the two don't repeat.
export default function PrefrontalPowerHero(): React.JSX.Element {
  return (
    <section id="top" className="border-b border-line px-6 pb-14 pt-12 sm:px-8 sm:pt-16 lg:pb-0">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Eyebrow color="text-gold">One-Day Brain Training Workshop</Eyebrow>
          </div>

          <p className="mt-6 text-[15px] font-bold uppercase tracking-[0.04em] text-ink">PREfrontal POWER</p>

          <h1 className="mt-3 text-[34px] font-extrabold uppercase leading-[1.12] tracking-tight sm:text-[46px] lg:text-[52px]">
            Train Your Brain.
            <br />
            Think Better. Live Better.
          </h1>

          <p className="mx-auto mt-6 max-w-md text-[16px] font-semibold leading-snug text-ink lg:mx-0">
            You know what to do. So why is it still so difficult to do it consistently?
          </p>

          <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-ink-dim lg:mx-0">
            A practical, experiential day to understand attention, stress, emotional reactions and
            decision-making — and learn simple mental skills you can continue practising in everyday life.
          </p>

          <p className="mx-auto mt-7 max-w-md font-mono text-[12.5px] uppercase tracking-[0.06em] text-ink-faint lg:mx-0">
            27 September 2026 · Mumbai · 10:00 AM – 6:30 PM
          </p>
          <p className="mt-2 text-[20px] font-extrabold text-ink">
            ₹3,500 <span className="text-[13px] font-semibold uppercase tracking-[0.04em] text-ink-faint">/ person</span>
          </p>
          <p className="mt-1.5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-gold">
            Limited to 40 Participants
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <CtaButton
              href={PREFRONTAL_POWER_REGISTRATION_URL}
              variant="primary"
              accent="gold"
              openInNewTab
              onClick={() => trackGaEvent("whatsapp_click", { location: "prefrontal_power_hero" })}
            >
              Reserve My Seat
            </CtaButton>
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-7 py-[15px] text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              See the Experience
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] lg:mx-0 lg:max-w-none lg:justify-self-end">
          {/* Breathing-Room Frame™ — padding lives on the card div below,
              not on the same element as the aspect-ratio box. A
              Next/Image `fill` child is absolutely positioned with
              inset:0, which CSS resolves against the containing block's
              PADDING edge — so padding on that same positioned element
              would be ignored by the fill child and the photo would
              still touch the border. Splitting it into an outer padded
              card + an inner aspect-ratio box guarantees real visual
              margin around the photo on every side. */}
          <div className="w-full max-w-[340px] overflow-hidden rounded-sm border border-line-strong bg-panel2 shadow-[0_28px_60px_rgba(34,31,29,0.14)] lg:ml-auto">
            <div className="p-4 sm:p-5">
              {/* aspect-[800/1020] matches dr-kapil-prefrontal-hero-portrait
                  .png's exact crop dimensions — the real supplied
                  dr-kapil-about.png, cropped to frame his full head,
                  glasses and gesturing hand. object-contain (not
                  object-cover) means the browser only ever shrinks the
                  photo to fit — it can't crop it — and the p-4/p-5
                  padding above adds further margin on every side beyond
                  that, so no part of him is ever near the card's edge. */}
              <div className="relative aspect-[800/1020] w-full">
                <Image
                  src="/dr-kapil-prefrontal-hero-portrait.png"
                  alt="Dr. Kapil Sharma, trainer of PREfrontal POWER"
                  fill
                  priority
                  sizes="(min-width: 1024px) 310px, (min-width: 640px) 275px, 72vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-sm border border-gold/40 lg:-right-5"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
