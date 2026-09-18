"use client";

import { Brain, GraduationCap, Users, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PATH_ICONS: Record<string, LucideIcon> = {
  self: GraduationCap,
  child: Users,
  deeper: Brain,
};

// Two of the three cards point at QSR (self vs. parent framing); the
// `for=parent` param is a hook for QSR page copy to key off later, not
// wired to anything there yet. "Deeper mind training" has no single
// product page yet, so it lands on Personal Class — the closest existing
// "whatever deeper work you need" page — rather than a dedicated
// /programs overview that doesn't exist in this codebase.
const PATH_HREFS: Record<string, string> = {
  self: "/programs/quantum-speed-reading",
  child: "/programs/quantum-speed-reading?for=parent",
  deeper: "/mentoring/personal-class",
};

// Audience-first path cards (see the "Homepage & QSR Conversion Rewrite"
// task) — replaces the earlier "QSR flagship block + 3 secondary
// programs" layout. That version sorted by product (QSR vs. Habit
// Builder vs. Retreats vs. Mentoring); this one sorts by who the visitor
// is shopping for, matching the new hero's own audience-first framing.
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {section.paths.map((path) => {
            const Icon = PATH_ICONS[path.key] ?? GraduationCap;
            return (
              <a
                key={path.key}
                href={PATH_HREFS[path.key] ?? "/programs/quantum-speed-reading"}
                className="group flex flex-col rounded-sm border border-gold/40 bg-panel2 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_rgba(184,134,46,0.14)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold-soft/20">
                  <Icon className="h-4.5 w-4.5 text-gold" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[18px] font-bold leading-snug text-ink">{path.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-dim">{path.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink">
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
