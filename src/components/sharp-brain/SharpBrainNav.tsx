"use client";

import { useLanguage } from "@/context/LanguageContext";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header; the header button leads to the batch picker (#enrol).
export default function SharpBrainNav(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <SiteNav
      cta={{
        label: lang === "hi" ? "नामांकन करें" : "Enrol now",
        href: "/programs/sharp-brain#enrol",
        external: false,
        onClick: () => trackGaEvent("sharp_brain_enrol_click", { location: "sharp_brain_nav" }),
      }}
    />
  );
}
