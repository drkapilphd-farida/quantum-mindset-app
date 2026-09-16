"use client";

import { Video, GraduationCap, Wind, ListChecks, FileText, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const ITEM_ICONS = [Video, GraduationCap, Wind, ListChecks, FileText] as const;

// SECTION 5 — What You Will Experience™. Pricing correction: the 5 daily-
// experience cards are universal to both plans; "2 Live Sessions" is
// rendered as its own clearly separate, distinctly-styled note below the
// grid (never folded into these 5 cards), explicitly labeled ₹999-only.
export default function MindResetExperience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.experience;

  return (
    <section className="border-b border-line px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
          <p className="mt-3 text-[14.5px] text-ink-dim">{section.desc}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {section.items.map((item, index) => {
            const Icon = ITEM_ICONS[index % ITEM_ICONS.length] ?? Video;
            return (
              <div key={item.title} className="rounded-sm border border-line bg-panel p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose/40 bg-rose-soft">
                  <Icon className="h-5 w-5 text-rose" aria-hidden="true" />
                </div>
                <h3 className="mt-3.5 text-[14.5px] font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-dim">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-sm border-2 border-gold/50 bg-gold-soft/40 px-6 py-5">
          <Sparkles className="mt-0.5 h-5 w-5 flex-none text-gold-dim" aria-hidden="true" />
          <div>
            <p className="text-[14.5px] font-bold text-ink">{section.liveSessionsNote.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{section.liveSessionsNote.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
