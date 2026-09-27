"use client";

import { useLanguage } from "@/context/LanguageContext";
import { programs } from "@/config/site.config";

// Fee + payment instruction under each retreat booking button. The checkout
// page lets the payer type the amount, so the exact fee is stated here.
export function retreatFee(): number | null {
  const fees = programs.onlineRetreat.prices.map((p) => p.amountInr).filter((a) => a > 0);
  return fees.length > 0 ? Math.min(...fees) : null;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function RetreatPaymentNote({ className = "" }: { className?: string }): React.JSX.Element | null {
  const { lang } = useLanguage();
  const fee = retreatFee();
  if (fee === null) return null;
  const amount = formatInr(fee);

  return (
    <p className={`text-[12.5px] leading-relaxed text-ink-dim ${className}`}>
      {lang === "hi"
        ? `अगली स्क्रीन पर ${amount} का भुगतान करें, फिर अपनी सीट पक्की करने के लिए स्क्रीनशॉट WhatsApp पर भेजें।`
        : `Pay ${amount} on the next screen, then send the screenshot on WhatsApp to confirm your seat.`}
    </p>
  );
}
