"use client";

import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "../TrainerBio";

export default function MentoringGuide(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mentoringLanding.guide;

  return <TrainerBio variant="long" accent="rose" eyebrow={section.eyebrow} quote={section.quote} />;
}
