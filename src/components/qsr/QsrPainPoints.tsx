"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

type Audience = "self" | "parent";

// Pain Points section (see the "Homepage & QSR Conversion Rewrite" task)
// — placed before QsrBrainScience/QsrNeuroCognitiveScience's metrics
// content. Toggle rather than showing both audiences at once, per the
// task's own "toggle" suggestion — each group's pain points are written
// in their own plain language, not marketing-speak.
export default function QsrPainPoints(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.painPoints;
  const [audience, setAudience] = useState<Audience>("self");
  const group = audience === "self" ? section.self : section.parent;

  return (
    <section className="border-b border-line bg-panel px-6 py-16 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[24px] font-extrabold leading-tight sm:text-[28px]">{section.title}</h2>
        </div>

        <div className="mx-auto mb-8 flex w-fit rounded-sm border border-line-strong bg-panel2 p-1">
          <button
            type="button"
            onClick={() => setAudience("self")}
            className={`rounded-sm px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              audience === "self" ? "bg-ink text-panel" : "text-ink-dim hover:text-ink"
            }`}
          >
            {section.toggleSelf}
          </button>
          <button
            type="button"
            onClick={() => setAudience("parent")}
            className={`rounded-sm px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              audience === "parent" ? "bg-ink text-panel" : "text-ink-dim hover:text-ink"
            }`}
          >
            {section.toggleParent}
          </button>
        </div>

        <div className="mx-auto max-w-2xl rounded-sm border border-line-strong bg-panel2 px-7 py-6">
          <h3 className="text-[16px] font-bold text-ink">{group.title}</h3>
          <div className="mt-4 space-y-3">
            {group.items.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <XCircle className="mt-0.5 h-4 w-4 flex-none text-ink-faint" aria-hidden="true" />
                <p className="text-[15px] leading-relaxed text-ink-dim">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
