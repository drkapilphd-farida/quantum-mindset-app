"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";

// Deliberately small and low-visual-weight — a single-line banner, not a
// full section with its own hero treatment like the sections around it.
// The homepage's primary audience is students/parents; this is only a
// teaser pointing interested trainers/edupreneurs to
// /franchise-individual for the full pitch, not the pitch itself.
//
// Breakpoint fix (see the "Home & QSR Testimonial/Video Reorder" task)
// — this used to sit flush against the footer with no visual framing,
// reading as a leftover fragment rather than a deliberate closing
// section. A small eyebrow label + more vertical breathing room (py-14
// vs. the original py-10, and a bg-panel2 wash matching this page's
// other compact banners) give it enough presence to read as its own
// intentional section instead of an afterthought — without reordering
// it ahead of HomeFinalCta/HomePrefrontalPowerFeature/
// HomeHabitBuilderFeature, which are deliberately sequenced this late
// for their own documented reasons (see page.tsx's own doc comment).
export default function HomeFranchiseTeaser(): React.JSX.Element {
  const { t } = useLanguage();
  const teaser = t.homeFranchiseTeaser;

  return (
    <section className="border-b border-line bg-panel2 px-6 py-14 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-center gap-5 rounded-sm border border-line-strong bg-panel px-6 py-7 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
        <div>
          <Eyebrow color="text-teal">{teaser.eyebrow}</Eyebrow>
          <h2 className="mt-2 text-[16px] font-bold leading-snug text-ink sm:text-[17px]">{teaser.headline}</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{teaser.line}</p>
        </div>
        <a
          href="/franchise-individual"
          className="inline-flex flex-none items-center gap-2 rounded-sm border border-teal/60 px-5 py-2.5 text-[13px] font-semibold text-teal transition-colors hover:bg-teal-soft"
        >
          {teaser.cta}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
