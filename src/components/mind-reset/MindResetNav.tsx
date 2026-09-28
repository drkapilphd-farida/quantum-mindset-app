"use client";

import { primaryCheckoutHref } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Paid button link — read from the programs registry (site.config.ts).
const OVERTHINKING_CHECKOUT_HREF = primaryCheckoutHref('overthinkingReset');

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function MindResetNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.mindResetLanding.hero.ctaPrimary,
        href: OVERTHINKING_CHECKOUT_HREF,
        external: true,
        onClick: () => trackGaEvent("classplus_click", { location: "mind_reset_nav" }),
      }}
    />
  );
}
