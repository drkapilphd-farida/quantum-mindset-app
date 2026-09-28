"use client";

import { useLanguage } from "@/context/LanguageContext";
import { primaryCheckoutHref } from "@/config/site.config";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header with the 30-Day Program checkout as the header button.
export default function SharpBrainNav(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <SiteNav
      cta={{
        label: lang === "hi" ? "नामांकन करें" : "Enrol now",
        href: primaryCheckoutHref("sharpBrain"),
        external: true,
        onClick: () => trackGaEvent("razorpay_checkout_click", { location: "sharp_brain_nav" }),
      }}
    />
  );
}
