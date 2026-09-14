"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Bright, distinct card for the Mumbai in-person QSR workshop (see the
// "Build the Mumbai Offline Workshop Feature + Fix EEG Copy" task, Part
// 2) — deliberately more eye-catching than the site's other Tier-2/3
// secondary cards (Habit Builder, Retreats, 1-on-1), teal-accented with
// a solid badge and elevated shadow, since this is a genuinely new pilot
// offering worth standing out. Still sits below and stays smaller than
// the QSR flagship block in ProgramSelector above it — attractive and
// distinct, never dominant.
export default function HomeMumbaiWorkshopFeature(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.homeMumbaiWorkshop;

  return (
    <section className="border-b border-line px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <a
          href="/programs/quantum-speed-reading-mumbai"
          className="group mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-sm border border-teal/50 bg-teal-soft/40 px-7 py-9 text-center shadow-[0_16px_36px_rgba(23,138,122,0.16)] transition-all duration-200 hover:-translate-y-1 hover:border-teal hover:shadow-[0_20px_44px_rgba(23,138,122,0.22)] sm:px-10 sm:py-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-teal px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-white">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {section.badge}
          </span>

          <div>
            <h2 className="text-[22px] font-extrabold leading-tight text-ink sm:text-[26px]">{section.title}</h2>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-dim">{section.desc}</p>
          </div>

          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.05em] text-teal">
            {section.meta}
          </p>

          <span className="mt-1 inline-flex items-center gap-2.5 rounded-sm bg-teal px-7 py-[13px] text-[14px] font-semibold text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:bg-teal-light">
            {section.cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
