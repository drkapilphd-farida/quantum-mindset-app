"use client";

import { useLanguage } from "@/context/LanguageContext";
import { WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Judgment call: deliberately does NOT reuse QsrGuaranteeBadge from the
// main QSR page. That badge's own title text reads "100% Results
// Guaranteed for Online Students" — reusing it verbatim here would tell
// Mumbai pilot-batch participants a guarantee scoped explicitly to
// online students applies to them, which isn't accurate as written.
// Per explicit instruction, this is flagged rather than guessed at: the
// FAQ's refund-policy answer below is left as a bracketed placeholder
// pending real confirmation of what (if anything) applies to this
// in-person format, instead of silently reusing or rewriting the
// existing guarantee copy.
export default function QsrMumbaiPricing(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.pricing;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 text-center sm:px-8 lg:py-16">
      <div className="mx-auto max-w-md">
        <div className="font-display text-[44px] font-extrabold text-gold sm:text-[52px]">{section.title}</div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{section.priceNote}</p>
        <p className="mt-2 text-[12.5px] text-ink-faint">{section.addOnNote}</p>

        <a
          href={WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("whatsapp_click", { location: "qsr_mumbai_pricing" })}
          className="group mt-7 inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold tracking-tight text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          {section.cta}
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}
