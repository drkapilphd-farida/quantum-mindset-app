"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type CheckoutTrustLineProps = {
  className?: string;
};

// Shared across every primary Razorpay CTA on both the QSR and Retreat
// pages (see i18n.ts's top-level checkoutTrust for why this isn't
// duplicated per-page copy). Links to the real, dedicated
// /refund-policy page (see the "Pre-Launch Audit Fix Pass" task, Phase
// 3) — previously pointed at /terms#billing, which had no real refund
// terms, just a one-line "non-refundable" clause.
export default function CheckoutTrustLine({ className = "" }: CheckoutTrustLineProps): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <p className={`text-[11.5px] leading-relaxed text-ink-faint ${className}`}>
      {t.checkoutTrust.line}{" "}
      <Link
        href="/refund-policy"
        className="underline decoration-ink-faint/50 underline-offset-2 transition-colors hover:text-ink-dim"
      >
        {t.checkoutTrust.refundLabel}
      </Link>
    </p>
  );
}
