"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Brainwave Science Infographic™ (see the "Add Brainwave Science
// Infographic to QSR Page" task) — a supplied side-by-side comparison
// graphic (Normal/Saccadic/Beta vs. QSR/Flow/Alpha-Gamma), placed right
// after QsrBrainScience's 4-card "why this works" section and before
// QsrNeuroCognitiveScience's metrics/EEG section, so it reads as the
// visual payoff of the cards above rather than a bolted-on addition.
// Text baked into the image itself is English-only (the source graphic
// was supplied as a single flat PNG, not per-language assets) — the
// heading/description around it are still translated like every other
// section on this page, matching how the founder photo and other real
// screenshots on this site already work (image content doesn't localize,
// surrounding copy does).
export default function QsrBrainwaveScience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.brainwaveScience;

  // Visual Rhythm™ — lg:py-16 trims desktop-only vertical padding (base
  // py-24 unchanged), matching QsrBrainScience/QsrNeuroCognitiveScience
  // on either side of this section.
  return (
    <section className="border-b border-line px-6 py-24 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">{section.title}</h2>
          <p className="mt-3 text-[15.5px] text-ink-dim">{section.desc}</p>
        </div>

        {/* Full-width on mobile, capped at 1200px and centered on
            desktop. aspect-[3/2] matches the source file's real 1536x1024
            dimensions exactly, so the container never crops or letterboxes
            it and there's no layout shift once it loads. */}
        <div className="relative mx-auto aspect-[3/2] w-full max-w-[1200px] overflow-hidden rounded-sm border border-line-strong bg-panel2">
          <Image
            src="/brainwave-science.png"
            alt={section.imageAlt}
            fill
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
