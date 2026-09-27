"use client";

import Link from "next/link";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";
import type { ProblemCard } from "@/lib/homeCopy";

const ACCENT: Record<ProblemCard["id"], { text: string; border: string; button: string }> = {
  learning: { text: "text-gold", border: "border-gold/40", button: "bg-gold text-[#1B1508] hover:bg-[#cb9a44]" },
  work: { text: "text-teal", border: "border-teal/40", button: "bg-teal text-white hover:bg-teal-light" },
  mind: { text: "text-rose", border: "border-rose/40", button: "bg-rose text-white hover:bg-[#b8757e]" },
  meditation: { text: "text-gold", border: "border-line-strong", button: "bg-ink text-void hover:opacity-90" },
};

// 2. "What would you like to solve?" — one card per problem, in the
// visitor's words, with the program that solves it and its starting price.
export default function HomeProblems(): React.JSX.Element {
  const c = useHomeCopy().problems;

  return (
    <section id="solve" className="scroll-mt-20 border-b border-line bg-panel px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[36px]">{c.title}</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {c.cards.map((card) => {
            const accent = ACCENT[card.id];
            return (
              <article key={card.id} className={`flex flex-col rounded-sm border ${accent.border} bg-void p-6 sm:p-7`}>
                <p className={`font-mono text-[11.5px] font-semibold uppercase tracking-[0.1em] ${accent.text}`}>{card.pillar}</p>
                <h3 className="mt-3 text-[21px] font-bold leading-snug text-ink sm:text-[23px]">{card.pain}</h3>
                <p className="mt-2 text-[14px] text-ink-faint">{card.audience}</p>

                <ul className="mt-5 space-y-3 border-t border-line pt-5">
                  {card.programs.map((program) => (
                    <li key={program.href} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <Link href={program.href} className="text-[15.5px] font-semibold text-ink hover:underline">
                        {program.name}
                      </Link>
                      {program.priceLine !== null && (
                        <span className="font-mono text-[13px] text-ink-dim">{program.priceLine}</span>
                      )}
                    </li>
                  ))}
                </ul>

                {card.note !== null && <p className="mt-4 text-[13.5px] leading-relaxed text-ink-faint">{card.note}</p>}

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                  <Link
                    href={card.cta.href}
                    className={`inline-flex items-center justify-center rounded-sm px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 ${accent.button}`}
                  >
                    {card.cta.label}
                  </Link>
                  {card.extras.map((extra) => (
                    <Link key={extra.href} href={extra.href} className="text-[13.5px] font-semibold text-ink-dim hover:text-ink">
                      {extra.label}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
