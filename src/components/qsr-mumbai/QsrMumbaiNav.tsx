"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "../brand/LivingBrainLogo";
import LanguageToggle from "../LanguageToggle";
import { WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Distraction-Free Landing Nav™ — same pattern as QsrNav/RetreatNav: no
// cross-page links, one CTA. Links out to WhatsApp (not a Razorpay
// checkout) since this pilot batch has no dedicated payment link yet —
// see whatsappSupportLink.ts's own doc comment on WHATSAPP_MUMBAI_
// WORKSHOP_INQUIRY_LINK for why.
export default function QsrMumbaiNav(): React.JSX.Element {
  const { t } = useLanguage();
  const qsrMumbai = t.qsrMumbaiLanding;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em]">
          <LivingBrainLogo size={24} decorative={false} animated={false} />
          <span className="hidden sm:inline">MIND UR MIND</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageToggle />
          <a
            href={WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("whatsapp_click", { location: "qsr_mumbai_nav" })}
            className="rounded-sm bg-gold px-4 py-2 text-[13px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
          >
            {qsrMumbai.hero.ctaPrimary}
          </a>
        </div>
      </nav>
    </header>
  );
}
