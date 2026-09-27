"use client";

import { useLanguage } from "@/context/LanguageContext";
import { WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function QsrMumbaiNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.qsrMumbaiLanding.hero.ctaPrimary,
        href: WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK,
        external: true,
        onClick: () => trackGaEvent("whatsapp_click", { location: "qsr_mumbai_nav" }),
      }}
    />
  );
}
