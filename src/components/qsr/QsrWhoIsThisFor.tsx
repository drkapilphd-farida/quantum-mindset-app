"use client";

import { GraduationCap, School, Briefcase, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ICONS: LucideIcon[] = [GraduationCap, School, Briefcase];

// "Who is this for?" audience-confirmation strip (see the "Homepage &
// QSR Conversion Rewrite" task) — directly under the hero's pain point,
// before any feature/metric content. No per-audience subsections exist
// yet to scroll to, so these are visual confirmation only for now (the
// task's own stated fallback), not scroll-linked.
export default function QsrWhoIsThisFor(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.whoIsThisFor;

  return (
    <section className="border-b border-line px-6 py-14 sm:px-8">
      <div className="mx-auto max-w-content">
        <h2 className="mb-8 text-center font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-faint">
          {section.title}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {section.cards.map((card, index) => {
            const Icon = ICONS[index] ?? GraduationCap;
            return (
              <div
                key={card.title}
                className="flex items-start gap-3.5 rounded-sm border border-line bg-panel2 p-5"
              >
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-teal/40 bg-teal-soft">
                  <Icon className="h-4 w-4 text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[14.5px] font-bold text-ink">{card.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-dim">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
