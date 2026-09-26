"use client";

import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "../TrainerBio";
import { WHATSAPP_MENTORING_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

export default function MentoringHero(): React.JSX.Element {
  const { t } = useLanguage();
  const mentoring = t.mentoringLanding;

  return (
    <section className="border-b border-line px-6 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            {mentoring.hero.eyebrowBadges.map((badge) => (
              <span
                key={badge}
                className="font-mono text-[11px] uppercase tracking-[0.09em] text-rose"
              >
                {badge}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-[32px] font-extrabold leading-[1.15] tracking-tight sm:text-[42px] lg:text-[48px]">
            {mentoring.hero.headline}
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-dim sm:text-[17px]">
            {mentoring.hero.sub}
          </p>

          <a
            href={WHATSAPP_MENTORING_INQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("whatsapp_click", { location: "mentoring_hero" })}
            className="group mt-8 inline-flex items-center gap-2.5 rounded-sm bg-rose px-7 py-[15px] text-[14.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
          >
            {mentoring.hero.ctaPrimary}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <TrainerBio variant="short" accent="rose" eyebrow={mentoring.hero.guideLabel} />
      </div>
    </section>
  );
}
