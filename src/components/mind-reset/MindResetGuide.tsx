"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "../TrainerBio";

// Trainer — short bio from site.config, with a link to the full story.
export default function MindResetGuide(): React.JSX.Element {
  const { t, lang } = useLanguage();
  const section = t.mindResetLanding.guide;

  return (
    <section className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <TrainerBio variant="short" accent="rose" eyebrow={section.eyebrow} />
        <Link href="/about" className="mt-4 inline-flex text-[14px] font-semibold text-rose hover:underline">
          {lang === "hi" ? "पूरी कहानी पढ़ें →" : "Read his full story →"}
        </Link>
      </div>
    </section>
  );
}
