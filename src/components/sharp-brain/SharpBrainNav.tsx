"use client";

import { useLanguage } from "@/context/LanguageContext";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { readUtmParams } from "@/lib/analytics/utm";
import SiteNav from "../site/SiteNav";

// Site-wide header; the header button leads to the checkout (#enrol).
export default function SharpBrainNav(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <SiteNav
      cta={{
        label: lang === "hi" ? "सीट बुक करें" : "Book a seat",
        href: "/programs/sharp-brain#enrol",
        external: false,
        onClick: () => trackGaEvent("sharp_brain_enrol_click", { location: "sharp_brain_nav", utm_source: readUtmParams().utm_source ?? "(none)" }),
      }}
    />
  );
}
