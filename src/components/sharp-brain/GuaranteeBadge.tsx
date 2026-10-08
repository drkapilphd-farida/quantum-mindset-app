"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { qsrGuarantee } from "@/config/site.config";

// Sharp Brain Results Guarantee — the exact terms from the Refund &
// Cancellation Policy (single source in site.config.ts): all five conditions
// and the re-test note.
export default function GuaranteeBadge({ className = "", id }: { className?: string; id?: string }): React.JSX.Element {
  const { lang } = useLanguage();
  const g = qsrGuarantee[lang];

  return (
    <div id={id} className={`flex scroll-mt-24 items-start gap-3 rounded-sm border border-gold/40 bg-gold-soft px-5 py-4 ${className}`} data-guarantee-terms>
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
      <div className="min-w-0">
        <div className="text-[14px] font-bold text-ink">{g.label}</div>
        <p className="mt-1 text-[13px] leading-relaxed text-ink">{g.intro}</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-ink-dim">
          {g.conditions.map((condition) => (
            <li key={condition}>{condition}</li>
          ))}
        </ol>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
          {g.retest}{" "}
          <Link href="/refund-policy" className="underline decoration-ink-faint/50 underline-offset-2 hover:text-ink">
            {lang === "hi" ? "रिफंड और कैंसिलेशन नीति देखें" : "See the Refund & Cancellation Policy"}
          </Link>
        </p>
      </div>
    </div>
  );
}
