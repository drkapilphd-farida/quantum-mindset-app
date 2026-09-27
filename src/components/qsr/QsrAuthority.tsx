"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import TrainerBio from "../TrainerBio";

// Trainer authority section on the QSR page. The credentials that used to
// be hand-written here ("India's First QSR Pioneer", "English Professor
// (15+ Years)", "not a licensed instructor…") were removed in
// site-rebuild Phase 2 — the honest bio, stats and photo now come from
// site.config via TrainerBio.
export default function QsrAuthority(): React.JSX.Element {
  const { t, lang } = useLanguage();
  const section = t.qsrLanding.authority;

  return (
    <div id="authority">
      <section className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[24px] font-extrabold leading-tight sm:text-[30px]">{section.title}</h2>
          <div className="mt-6">
            <TrainerBio variant="short" accent="gold" eyebrow={section.eyebrow} />
          </div>
          <Link href="/about" className="mt-4 inline-flex text-[14px] font-semibold text-gold hover:underline">
            {lang === "hi" ? "पूरी कहानी पढ़ें →" : "Read his full story →"}
          </Link>
        </div>
      </section>
    </div>
  );
}
