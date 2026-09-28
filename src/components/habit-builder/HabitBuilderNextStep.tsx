"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";

// One "next step" suggestion: the paid 30-day program this free starter leads into.
export default function HabitBuilderNextStep(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.habitBuilderLanding.nextStep;

  return (
    <section className="border-b border-line px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl rounded-sm border border-gold/40 bg-panel p-6 text-center sm:p-8">
        <h2 className="text-[22px] font-extrabold leading-tight sm:text-[26px]">{section.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{section.desc}</p>
        <Link
          href={programs.sharpBrain.url}
          className="mt-5 inline-flex rounded-sm bg-gold px-6 py-3 text-[14.5px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          {section.cta} →
        </Link>
      </div>
    </section>
  );
}
