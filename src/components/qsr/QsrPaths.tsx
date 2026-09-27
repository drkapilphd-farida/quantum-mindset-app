"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Who it's for — the three paths the hero links to: #students,
// #professionals and #every-age (parents). Reuses the existing,
// already-translated subject-wise, age-group and screen-time copy.
export default function QsrPaths(): React.JSX.Element {
  const { t } = useLanguage();
  const qsr = t.qsrLanding;
  const paths = qsr.paths;
  const [children, adults] = qsr.ageGroups.pathways;

  const cardClass = "scroll-mt-24 flex flex-col rounded-sm border border-line bg-panel p-6 sm:p-7";

  return (
    <section id="who-its-for" className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{paths.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{paths.title}</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <article id="students" className={cardClass}>
            <h3 className="text-[19px] font-bold text-ink">{paths.students.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{paths.students.desc}</p>
            <ul className="mt-5 space-y-4">
              {qsr.examBenefits.cards.map((card) => (
                <li key={card.title}>
                  <p className="text-[14px] font-semibold text-ink">{card.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-dim">{card.desc}</p>
                </li>
              ))}
            </ul>
          </article>

          <article id="professionals" className={cardClass}>
            <h3 className="text-[19px] font-bold text-ink">{paths.professionals.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{paths.professionals.desc}</p>
            {adults !== undefined && <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{adults.desc}</p>}
          </article>

          <article id="every-age" className={cardClass}>
            <h3 className="text-[19px] font-bold text-ink">{paths.parents.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{paths.parents.desc}</p>
            {children !== undefined && <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{children.desc}</p>}
            <ul className="mt-4 space-y-2">
              {qsr.audience.items.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-dim">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-teal" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-teal">{paths.parents.tipsLabel}</p>
            <ul className="mt-2 space-y-2">
              {qsr.focusInDistractedWorld.tips.map((tip) => (
                <li key={tip.title} className="text-[13.5px] leading-relaxed text-ink-dim">
                  <span className="font-semibold text-ink">{tip.title}:</span> {tip.desc}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
