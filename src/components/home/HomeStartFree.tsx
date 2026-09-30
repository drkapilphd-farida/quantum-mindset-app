"use client";

import Link from "next/link";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";

// 3. Start free — the two free tests in one strip.
export default function HomeStartFree(): React.JSX.Element {
  const c = useHomeCopy().startFree;

  return (
    <section id="start-free" className="border-b border-line px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[24px] font-extrabold leading-tight sm:text-[30px]">{c.title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col rounded-sm border border-teal/30 bg-panel p-5 transition-colors hover:border-teal/70"
            >
              <span className="text-[16.5px] font-bold text-ink">{item.title}</span>
              <span className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{item.desc}</span>
              <span className="mt-4 text-[13.5px] font-semibold text-teal">
                {item.cta} <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
