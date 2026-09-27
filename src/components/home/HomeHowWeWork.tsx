"use client";

import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";

// 5. How we work — Measure → Train → Practise daily → Re-measure.
export default function HomeHowWeWork(): React.JSX.Element {
  const c = useHomeCopy().how;

  return (
    <section id="how-we-work" className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, index) => (
            <li key={step.title} className="rounded-sm border border-line bg-panel p-6">
              <span className="font-mono text-[12px] font-semibold text-teal">0{index + 1}</span>
              <h3 className="mt-2 text-[18px] font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{step.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[13.5px] leading-relaxed text-ink-faint">{c.eegLine}</p>
      </div>
    </section>
  );
}
