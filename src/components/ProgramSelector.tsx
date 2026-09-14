"use client";

import { BookOpen, Gauge, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";
import { HABIT_BUILDER_APP_URL } from "@/config/habitBuilderSignupLink";

const PATH_ICONS: Record<string, LucideIcon> = {
  habit: Gauge,
  retreats: Sparkles,
  mentoring: UserRound,
};

const PATH_HREFS: Record<string, string> = {
  habit: HABIT_BUILDER_APP_URL,
  retreats: "/retreats/online-11-day",
  mentoring: "/mentoring/personal-class",
};

const QSR_HREF = "/programs/quantum-speed-reading";

// Choice Architecture™ — positioning fix (see the "Fix Homepage & QSR
// Page Positioning" task). This used to render 4 visually identical
// cards (Habit Builder got quiet gold styling, the other 3 — including
// QSR itself — got none), reading as "pick any door" rather than naming
// a flagship. Now QSR gets its own dominant, gold-accented block first
// (reusing the QSR page's own hero headline/price for consistency, not
// new copy), and the remaining three real paths (Habit Builder, Retreats,
// 1-on-1 Mentoring) render smaller and muted underneath, grouped under
// an explicit "Or explore other paths" label — still all present, just
// unambiguously secondary.
export default function ProgramSelector(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.programSelector;

  return (
    <section id="begin" className="border-b border-line bg-panel px-6 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
          <p className="mt-3 text-[15px] text-ink-dim">{section.subtitle}</p>
        </div>

        <a
          href={QSR_HREF}
          className="group flex flex-col overflow-hidden rounded-sm border border-gold/50 bg-gold-soft/20 p-8 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_rgba(184,134,46,0.2)] sm:p-10 lg:p-12"
        >
          <Eyebrow color="text-gold">{section.flagship.eyebrowLabel}</Eyebrow>
          <h3 className="mt-4 max-w-2xl font-display text-[28px] font-bold leading-tight text-ink sm:text-[36px]">
            {section.flagship.title}
          </h3>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-dim">{section.flagship.desc}</p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 group-hover:-translate-y-0.5">
              {section.flagship.cta}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
            <span className="font-mono text-[12.5px] uppercase tracking-[0.06em] text-gold-dim">
              {section.flagship.priceLine}
            </span>
          </div>
        </a>

        <p className="mb-6 mt-14 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
          {section.otherPathsLabel}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {section.paths.map((path) => {
            const Icon = PATH_ICONS[path.key] ?? BookOpen;
            return (
              <a
                key={path.key}
                href={PATH_HREFS[path.key] ?? "#"}
                className="group flex flex-col rounded-sm border border-line bg-panel2 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-dim"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal/40 bg-teal-soft">
                  <Icon className="h-4 w-4 text-teal" aria-hidden="true" />
                </div>
                <Eyebrow color="text-ink-faint">{path.eyebrowLabel}</Eyebrow>
                <h3 className="mt-3 text-[16px] font-bold leading-snug text-ink">{path.title}</h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-dim">{path.desc}</p>
                {path.priceLine !== undefined && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-faint">
                    {path.priceLine}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
                  {path.cta}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
