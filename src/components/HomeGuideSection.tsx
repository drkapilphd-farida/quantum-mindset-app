"use client";

import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "./TrainerBio";

// Meet the trainer — bio, stats and photo come from site.config via
// TrainerBio; only the eyebrow/heading framing, quote and the CTA to the
// full /about page are specific to this placement.
export default function HomeGuideSection(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.homeGuide;

  return (
    <TrainerBio
      variant="long"
      accent="gold"
      eyebrow={section.eyebrow}
      heading={section.title}
      quote={t.aboutPage.guide.quote}
      ctaLabel={section.cta}
      ctaHref="/about"
    />
  );
}
