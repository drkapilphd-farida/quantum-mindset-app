"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// SECTION 2 — Relatable Problem™. Deliberately plain, short bullet list —
// per the master prompt: "Avoid shame, fear-based marketing, and
// exaggerated pain points."
export default function MindResetProblem(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.problem;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {section.items.map((item) => (
            <div key={item} className="rounded-sm border border-line-strong bg-panel2 px-5 py-4 text-[14.5px] leading-relaxed text-ink-dim">
              {item}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[15.5px] font-semibold leading-relaxed text-ink">
          {section.closingLine}
        </p>
      </div>
    </section>
  );
}
