"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from "@/config/overthinkingCoursePaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function MindResetNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.mindResetLanding.hero.ctaPrimary,
        href: CLASSPLUS_OVERTHINKING_COURSE_LINK,
        external: true,
        onClick: () => trackGaEvent("classplus_click", { location: "mind_reset_nav" }),
      }}
    />
  );
}
