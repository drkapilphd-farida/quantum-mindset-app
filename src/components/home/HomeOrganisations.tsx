"use client";

import Link from "next/link";
import { ORGANISATIONS_HREF, SCHOOLS_HREF } from "@/config/navigation";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";

// 8. For organisations — corporate teams and schools, both on /corporate.
export default function HomeOrganisations(): React.JSX.Element {
  const c = useHomeCopy().organisations;

  return (
    <section id="organisations" className="border-b border-line px-4 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto flex max-w-content flex-col gap-6 rounded-sm border border-teal/30 bg-panel p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[22px] font-extrabold leading-tight sm:text-[28px]">{c.title}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{c.desc}</p>
        </div>
        <div className="flex flex-none flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link
            href={ORGANISATIONS_HREF}
            className="inline-flex items-center justify-center rounded-sm bg-teal px-6 py-3.5 text-[14.5px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-teal-light"
          >
            {c.ctaCorporate} →
          </Link>
          <Link
            href={SCHOOLS_HREF}
            className="inline-flex items-center justify-center rounded-sm border border-teal/50 px-6 py-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2"
          >
            {c.ctaSchools} →
          </Link>
        </div>
      </div>
    </section>
  );
}
