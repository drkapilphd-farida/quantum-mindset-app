"use client";

import { useLanguage } from "@/context/LanguageContext";
import { RAZORPAY_MASTERCLASS_PAYMENT_LINK } from "@/config/masterclassPaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function QsrNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.qsrLanding.hero.ctaPrimary,
        href: RAZORPAY_MASTERCLASS_PAYMENT_LINK,
        external: true,
        onClick: () => trackGaEvent("razorpay_checkout_click", { location: "qsr_nav" }),
      }}
    />
  );
}
