"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "../brand/LivingBrainLogo";
import LanguageToggle from "../LanguageToggle";
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from "@/config/overthinkingCoursePaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Distraction-Free Landing Nav™ — dark treatment matching this page's
// dark hero (see MindResetHero.tsx), per the master prompt's own
// "follow the existing design system" instruction (same dark-nav-on-
// dark-hero pattern this codebase already used elsewhere).
//
// Incident fix (see the "Fix Incorrect Logo on Mind Reset Page Header"
// task): this used to pass colorMode="dark" to LivingBrainLogo, which
// renders the brain/book silhouette in solid white — but that variant's
// gyri lines, node network, and book-fold accents are hardcoded to
// stroke/fill="white" regardless of colorMode (see LivingBrainLogo.tsx),
// so on a white silhouette they become invisible: the mark rendered as
// a flat, detail-less white blob, not the real logo. Confirmed directly
// (screenshot) that the actual full-color brand gradient reads perfectly
// well against this exact navy background — the "reads poorly against
// navy" reasoning the dark variant was originally built for doesn't
// hold up under an actual visual test. Dropped colorMode entirely here
// (defaults to "full-color"), matching every other page's header
// pixel-for-pixel rather than introducing yet another custom variant.
// colorMode="dark" had exactly one caller (this file) — see
// LivingBrainLogo.tsx's own doc comment for the separate, zero-risk fix
// applied to that variant's definition itself, now that it has none.
export default function MindResetNav(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#12162a]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em] text-[#f5f1e6]">
          <LivingBrainLogo size={24} decorative={false} animated={false} />
          <span className="hidden sm:inline">MIND UR MIND</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageToggle variant="dark" />
          <a
            href={CLASSPLUS_OVERTHINKING_COURSE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("classplus_click", { location: "mind_reset_nav" })}
            className="rounded-sm bg-[#eb8a96] px-4 py-2 text-[13px] font-semibold text-[#12162a] transition-transform hover:-translate-y-0.5 hover:bg-[#f2a1ab]"
          >
            {section.hero.ctaPrimary}
          </a>
        </div>
      </nav>
    </header>
  );
}
