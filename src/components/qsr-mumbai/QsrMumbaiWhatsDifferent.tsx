"use client";

import { Radio, UserRound, Gauge, Smartphone, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const ITEM_ICONS: readonly LucideIcon[] = [Radio, UserRound, Gauge, Smartphone];

export default function QsrMumbaiWhatsDifferent(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.whatsDifferent;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {section.items.map((item, index) => {
            const Icon = ITEM_ICONS[index % ITEM_ICONS.length] ?? Radio;
            return (
              <div key={item.title} className="flex gap-4 rounded-sm border border-line-strong bg-panel2 p-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-teal/40 bg-teal-soft">
                  <Icon className="h-5 w-5 text-teal" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold leading-snug text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-dim">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
