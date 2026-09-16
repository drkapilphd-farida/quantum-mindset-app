"use client";

import { Briefcase, Users, GraduationCap, Home, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const ITEM_ICONS: readonly LucideIcon[] = [Briefcase, Users, GraduationCap, Home, Rocket, Sparkles];

export default function MindResetWhoFor(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.whoFor;

  return (
    <section className="border-b border-line px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item, index) => {
            const Icon = ITEM_ICONS[index % ITEM_ICONS.length] ?? Sparkles;
            return (
              <div key={item.title} className="rounded-sm border border-line bg-panel2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose/40 bg-rose-soft">
                  <Icon className="h-5 w-5 text-rose" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[15.5px] font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-[12.5px] leading-relaxed text-ink-faint">
          {section.disclaimer}
        </p>
      </div>
    </section>
  );
}
