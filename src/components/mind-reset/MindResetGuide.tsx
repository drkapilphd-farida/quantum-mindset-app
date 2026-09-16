"use client";

import { useLanguage } from "@/context/LanguageContext";
import GuideProfileCard from "../GuideProfileCard";

// SECTION 9 — About the Founder. Thin translated wrapper around the
// shared GuideProfileCard, same pattern CourseGuide.tsx already uses for
// this exact founder/course. Judgment call: the master prompt's own
// placeholder photo path (/images/dr-kapil-dev-sharma.jpg) doesn't exist
// in this repo — GuideProfileCard's real default (/founder-warm.jpg,
// already approved and used for this same founder elsewhere) is used
// instead of a broken placeholder path, and bio/stats/quote reuse the
// same real, already-approved facts as courseLanding.guide rather than
// inventing new ones, per the master prompt's own "do not invent
// qualifications" instruction.
export default function MindResetGuide(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.guide;

  return <GuideProfileCard {...section} accent="rose" />;
}
