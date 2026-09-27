"use client";

import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";

// 9. FAQ — six questions a first-time visitor actually asks.
export default function HomeFaq(): React.JSX.Element {
  const c = useHomeCopy().faq;

  return (
    <section id="faq" className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {c.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-[15.5px] leading-relaxed text-ink-dim">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
