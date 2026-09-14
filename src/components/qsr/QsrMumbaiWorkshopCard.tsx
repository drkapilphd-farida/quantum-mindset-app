"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Bright, distinct card promoting the Mumbai in-person workshop (see the
// "Build the Mumbai Offline Workshop Feature + Fix EEG Copy" task, Part
// 3) — replaces the earlier plain text-link banner (QsrMumbaiBanner).
// Deliberately teal-accented, not gold: the page's one primary
// conversion action (the ₹9,999 online enrollment CTA, in the hero and
// sticky bar) owns gold everywhere on this page, so this card uses a
// different, still-vivid accent to read as "an exciting complementary
// option" rather than a second competing primary offer. Placed right
// after the hero, before the science sections, so a visitor evaluating
// the online program notices the in-person option early without it
// interrupting the hero's own CTA flow.
export default function QsrMumbaiWorkshopCard(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.mumbaiWorkshopCard;

  return (
    <section className="border-b border-line bg-panel px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-content">
        <Link
          href="/programs/quantum-speed-reading-mumbai"
          className="group flex flex-col gap-5 rounded-sm border border-teal/50 bg-teal-soft/40 p-6 shadow-[0_12px_30px_rgba(23,138,122,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_16px_36px_rgba(23,138,122,0.2)] sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-teal/50 bg-teal text-white">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <span className="inline-flex items-center rounded-full bg-teal px-3 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.06em] text-white">
                {section.badge}
              </span>
              <h3 className="mt-2.5 text-[19px] font-bold leading-snug text-ink">{section.title}</h3>
              <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-ink-dim">{section.desc}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.05em] text-teal">{section.meta}</p>
            </div>
          </div>
          <span className="inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-sm bg-teal px-6 py-3 text-[13.5px] font-semibold text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:bg-teal-light">
            {section.cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
