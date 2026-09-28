"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { qsrGuarantee } from "@/config/site.config";

// Sharp Brain 30-Day Program results guarantee — the exact sentence from the
// Refund & Cancellation Policy (single source in site.config.ts).
export default function GuaranteeBadge({ className = "" }: { className?: string }): React.JSX.Element {
  const { lang } = useLanguage();
  const g = qsrGuarantee[lang];

  return (
    <div className={`flex items-start gap-3 rounded-sm border border-gold/40 bg-gold-soft px-5 py-4 ${className}`}>
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
      <div>
        <div className="text-[13.5px] font-bold text-ink">{g.title}</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-dim">
          {g.statement} {g.requestWindow}{" "}
          <Link href="/refund-policy" className="underline decoration-ink-faint/50 underline-offset-2 hover:text-ink">
            {lang === "hi" ? "रिफंड और कैंसिलेशन नीति देखें" : "See the Refund & Cancellation Policy"}
          </Link>
        </p>
      </div>
    </div>
  );
}
