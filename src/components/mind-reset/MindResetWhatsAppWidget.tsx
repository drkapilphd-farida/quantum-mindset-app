"use client";

import { useLanguage } from "@/context/LanguageContext";
import WhatsAppWidget from "../WhatsAppWidget";
import { WHATSAPP_COURSE_INQUIRY_LINK } from "@/config/whatsappSupportLink";

// Thin translated wrapper — same pattern as CourseWhatsAppWidget.tsx.
// Pre-purchase questions only — the Classplus link (nav, sticky bar,
// both pricing CTAs, final CTA) is the real conversion path.
export default function MindResetWhatsAppWidget(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.whatsapp;

  return (
    <WhatsAppWidget
      href={WHATSAPP_COURSE_INQUIRY_LINK}
      bubble={section.bubble}
      buttonLabel={section.button}
      ariaLabel={section.ariaLabel}
      bottomClassName="bottom-24 sm:bottom-24"
      analyticsLocation="mind_reset_widget"
      revealAfterElementId="top"
    />
  );
}
