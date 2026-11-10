"use client";

import { useState } from "react";

// FAQ accordion from the design: one open at a time, first one open by
// default on the hub; real buttons with aria-expanded.
export function Faq({ items, firstOpen = false, size = "md" }: { items: readonly { q: string; a: string }[]; firstOpen?: boolean; size?: "md" | "lg" }): React.JSX.Element {
  const [open, setOpen] = useState<number>(firstOpen ? 0 : -1);
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item, index) => {
        const isOpen = open === index;
        const id = `faq-${index}`;
        return (
          <div key={item.q} className="rounded-[12px] border border-[#E3E6EC] bg-white">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? -1 : index)}
              className={`flex min-h-11 w-full justify-between gap-3 px-5 py-[18px] text-left font-extrabold text-[#0E1B2C] ${size === "lg" ? "text-[19px]" : "text-[18px]"}`}
            >
              <span>{item.q}</span>
              <span aria-hidden="true" className="text-[#1F3A8A]">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p id={id} className="px-5 pb-[18px] text-[17px] text-[#33415C]">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
