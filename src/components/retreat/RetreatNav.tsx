"use client";

import { useLanguage } from "@/context/LanguageContext";
import { RAZORPAY_RETREAT_PAYMENT_LINK } from "@/config/retreatPaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function RetreatNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.retreatLanding.hero.ctaPrimary,
        href: RAZORPAY_RETREAT_PAYMENT_LINK,
        external: true,
        onClick: () => trackGaEvent("razorpay_checkout_click", { location: "retreat_nav" }),
      }}
    />
  );
}
