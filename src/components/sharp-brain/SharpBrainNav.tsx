"use client";

import { useLanguage } from "@/context/LanguageContext";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";
import type { NavLink } from "@/config/navigation";

// Site-wide header; the header button leads to the batch picker (#enrol).
// On the program page the button is a same-page hash (keeps ?lang=hi) and
// the page passes its own English / हिंदी link.
export default function SharpBrainNav({ enrolHref = "/programs/sharp-brain#enrol", languageLink }: { enrolHref?: string; languageLink?: NavLink } = {}): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <SiteNav
      {...(languageLink !== undefined ? { languageLink } : {})}
      cta={{
        label: lang === "hi" ? "नामांकन करें" : "Enrol now",
        href: enrolHref,
        external: false,
        onClick: () => trackGaEvent("sharp_brain_enrol_click", { location: "sharp_brain_nav" }),
      }}
    />
  );
}
