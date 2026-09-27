"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs, type ProgramId } from "@/config/site.config";

type Copy = { title: string; desc: string };

// One "next step" suggestion at the end of a program page — the program
// that naturally follows, by registry id (name and URL from site.config).
export default function ProgramNextStep({
  program,
  en,
  hi,
}: {
  program: ProgramId;
  en: Copy;
  hi: Copy;
}): React.JSX.Element {
  const { lang } = useLanguage();
  const copy = lang === "hi" ? hi : en;
  const target = programs[program];

  return (
    <section className="border-b border-line px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl rounded-sm border border-line-strong bg-panel p-6 text-center sm:p-8">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{lang === "hi" ? "अगला कदम" : "Next step"}</p>
        <h2 className="mt-2 text-[21px] font-extrabold leading-tight sm:text-[25px]">{copy.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{copy.desc}</p>
        <Link href={target.url} className="mt-5 inline-flex text-[15px] font-semibold text-gold hover:underline">
          {lang === "hi" ? target.nameHi : target.name} →
        </Link>
      </div>
    </section>
  );
}
