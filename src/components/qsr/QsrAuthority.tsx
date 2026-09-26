"use client";

import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "../TrainerBio";

// Trainer authority section on the QSR page. The credentials that used to
// be hand-written here ("India's First QSR Pioneer", "English Professor
// (15+ Years)", "not a licensed instructor…") were removed in
// site-rebuild Phase 2 — the honest bio, stats and photo now come from
// site.config via TrainerBio.
export default function QsrAuthority(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.authority;

  return (
    <div id="authority">
      <TrainerBio variant="long" accent="gold" eyebrow={section.eyebrow} heading={section.title} />
    </div>
  );
}
