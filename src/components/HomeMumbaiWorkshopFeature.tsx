"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";

// Small, secondary card for the Mumbai in-person QSR workshop (see the
// "Add Mumbai In-Person QSR Workshop" task) — styled calmer than the
// dark QSR flagship card in ProgramCardsGrid above it, matching
// HomePrefrontalPowerFeature.tsx's own quiet-border treatment for the
// same reason: a real, secondary offering, never hero-scale.
export default function HomeMumbaiWorkshopFeature(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.homeMumbaiWorkshop;

  return (
    <section className="border-b border-line px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-sm border border-line-strong bg-panel2 px-7 py-9 text-center sm:px-10 sm:py-10">
          <div>
            <div className="flex justify-center">
              <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
            </div>
            <h2 className="mt-4 text-[20px] font-extrabold leading-tight sm:text-[24px]">{section.title}</h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-dim">{section.desc}</p>
          </div>

          <p className="font-mono text-[11.5px] uppercase tracking-[0.05em] text-ink-faint">{section.meta}</p>

          <a
            href="/programs/quantum-speed-reading-mumbai"
            className="group inline-flex items-center gap-2.5 rounded-sm border border-teal/50 px-7 py-[13px] text-[13.5px] font-semibold text-teal transition-colors hover:bg-teal-soft"
          >
            {section.cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
