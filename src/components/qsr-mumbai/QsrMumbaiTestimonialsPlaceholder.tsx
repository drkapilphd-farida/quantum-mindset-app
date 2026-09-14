"use client";

import { Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Structured, ready to receive real video testimonials once the pilot
// batch runs — a clearly marked empty state, not populated with any
// fabricated content. Swap this for a VideoReviewGrid (see
// QsrVideoTestimonials.tsx for the pattern) once real videos exist.
export default function QsrMumbaiTestimonialsPlaceholder(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.testimonialsPlaceholder;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mb-8 max-w-xl">
          <Eyebrow color="text-ink-faint">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[24px] font-extrabold leading-tight sm:text-[28px]">{section.title}</h2>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-sm border border-dashed border-line-strong bg-panel2 px-7 py-12 text-center">
          <Video className="h-8 w-8 text-ink-faint" aria-hidden="true" />
          <p className="max-w-md text-[14.5px] leading-relaxed text-ink-dim">{section.desc}</p>
        </div>
      </div>
    </section>
  );
}
