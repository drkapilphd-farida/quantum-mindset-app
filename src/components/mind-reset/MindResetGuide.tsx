"use client";

import { useLanguage } from "@/context/LanguageContext";
import TrainerBio from "../TrainerBio";

export default function MindResetGuide(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.guide;

  return <TrainerBio variant="long" accent="rose" eyebrow={section.eyebrow} quote={section.quote} />;
}
