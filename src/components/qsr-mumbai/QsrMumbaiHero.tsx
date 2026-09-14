"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow, Pill } from "../ui";
import { WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Same confident, sharp hero tone as QsrHero.tsx (headline/headlineEm
// split, mono eyebrow, gold CTA), but city- and format-specific — this
// is a 2-day live event, not the 30-day online program, so the CTA links
// to a WhatsApp inquiry (no dedicated checkout for this pilot batch yet)
// rather than the Razorpay Masterclass link.
export default function QsrMumbaiHero(): React.JSX.Element {
  const { t } = useLanguage();
  const qsrMumbai = t.qsrMumbaiLanding;

  return (
    <section id="top" className="border-b border-line px-6 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Eyebrow color="text-gold">{qsrMumbai.hero.eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-5 font-display text-[36px] font-extrabold leading-tight sm:text-[48px]">
          {qsrMumbai.hero.headline}{" "}
          <span className="italic text-gold">{qsrMumbai.hero.headlineEm}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-dim">{qsrMumbai.hero.sub}</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("whatsapp_click", { location: "qsr_mumbai_hero" })}
            className="group inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold tracking-tight text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
          >
            {qsrMumbai.hero.ctaPrimary}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#schedule"
            className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-7 py-[15px] text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2"
          >
            {qsrMumbai.hero.ctaSecondary}
          </a>
        </div>
        <p className="mt-3 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-faint">
          {qsrMumbai.hero.ctaPrimaryMeta}
        </p>

        <div className="mt-6 flex justify-center">
          <Pill>{qsrMumbai.hero.badge}</Pill>
        </div>
      </div>
    </section>
  );
}
