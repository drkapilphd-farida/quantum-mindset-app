"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// What changes — outcomes in plain terms, tied to the learner's own
// Day 1 baseline (no multipliers or percentages).
export default function QsrOutcomes(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.outcomes;

  return (
    <section id="outcomes" className="border-b border-line bg-panel px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{section.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {section.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-sm border border-line bg-void p-5 text-[15.5px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] text-ink-faint">{section.note}</p>
      </div>
    </section>
  );
}
