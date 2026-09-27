"use client";

import { useLanguage } from "@/context/LanguageContext";
import { HABIT_BUILDER_SIGNUP_HREF } from "@/config/habitBuilderSignupLink";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SiteNav from "../site/SiteNav";

// Site-wide header (SiteNav) with this page's own primary action as the
// header button (site-rebuild Phase 4).
export default function HabitBuilderNav(): React.JSX.Element {
  const { t } = useLanguage();

  return (
    <SiteNav
      cta={{
        label: t.habitBuilderLanding.hero.navCta,
        href: HABIT_BUILDER_SIGNUP_HREF,
        onClick: () => trackGaEvent("signup_cta_click", { location: "habit_builder_nav" }),
      }}
    />
  );
}
