"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";

// Final CTA + one "next step" suggestion for visitors not ready to enrol.
export default function QsrFinalCta(): React.JSX.Element {
  const { t } = useLanguage();
  const qsr = t.qsrLanding;

  return (
    <section className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{qsr.nextStep.ctaTitle}</h2>
        <a
          href="#pricing"
          className="mt-7 inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          {qsr.finalCta.cta} →
        </a>
        <div className="mt-10 rounded-sm border border-line bg-panel p-6">
          <p className="text-[16px] font-bold text-ink">{qsr.nextStep.title}</p>
          <p className="mt-1 text-[14px] text-ink-dim">{qsr.nextStep.desc}</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <Link href={FREE_TEST_LINKS.speedTest} className="text-[14px] font-semibold text-teal hover:underline">
              {qsr.nextStep.speedTest} →
            </Link>
            <Link href={programs.focusStarter.url} className="text-[14px] font-semibold text-teal hover:underline">
              {qsr.nextStep.starter} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
