"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAboutTestimonials } from "@/hooks/useTestimonials";
import { Eyebrow } from "./ui";

// About page only: a mixed set of verified testimonials across programs,
// each with its program label visible. Hidden until at least one
// testimonial is verified in site.config.
export default function AboutTestimonials(): React.JSX.Element | null {
  const { lang } = useLanguage();
  const items = useAboutTestimonials();
  if (items.length === 0) return null;

  return (
    <section className="border-b border-line px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-14 max-w-xl">
          <Eyebrow>{lang === "hi" ? "सीखने वालों के अनुभव" : "What learners say"}</Eyebrow>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col rounded-sm border border-line bg-panel p-6">
              <p className="mb-5 flex-1 text-[16px] italic leading-relaxed text-ink">&ldquo;{item.quote}&rdquo;</p>
              <div className="text-[13.5px] font-semibold text-ink">{item.name}</div>
              {item.context !== "" && <div className="mt-0.5 text-[12px] text-ink-faint">{item.context}</div>}
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-gold">{item.programLabel}</div>
              {item.videoUrl !== null && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold hover:underline"
                >
                  ▶ {lang === "hi" ? "वीडियो देखें" : "Watch video"}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
