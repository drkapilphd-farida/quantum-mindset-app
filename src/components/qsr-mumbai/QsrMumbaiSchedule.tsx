"use client";

import { Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Day 1 / Day 2 breakdown, with the overnight gap made explicit and
// visually literal (a "Moon" divider card between the two day cards,
// not just a paragraph) — per explicit instruction to feature the
// sleep-based-consolidation design choice as a credibility angle, not
// bury it.
export default function QsrMumbaiSchedule(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.schedule;

  return (
    <section id="schedule" className="border-b border-line px-6 py-20 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <div className="rounded-sm border border-line-strong bg-panel2 p-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{section.day1.label}</span>
            <h3 className="mt-2 text-[19px] font-bold leading-snug text-ink">{section.day1.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {section.day1.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-dim">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-row items-center justify-center gap-3 rounded-sm border border-dashed border-line-strong bg-panel px-5 py-6 text-center lg:w-[180px] lg:flex-col">
            <Moon className="h-6 w-6 flex-none text-ink-faint" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-bold leading-snug text-ink">{section.overnightCallout.title}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-dim">{section.overnightCallout.desc}</p>
            </div>
          </div>

          <div className="rounded-sm border border-line-strong bg-panel2 p-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-teal">{section.day2.label}</span>
            <h3 className="mt-2 text-[19px] font-bold leading-snug text-ink">{section.day2.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {section.day2.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-dim">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-teal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
