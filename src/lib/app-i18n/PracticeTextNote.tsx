"use client";

import { useAppI18n } from "./client";
import { LANGUAGES } from "./languages";
import { practiceTextIsFallback, type PracticeKind } from "./practiceContent";

// "Practice text in English — <language> practice text coming soon."
// Shown on reading screens whenever the practice text isn't in the
// learner's own language yet (see practiceContent.ts).
export function PracticeTextNote({ kind, className = "" }: { kind: PracticeKind; className?: string }): React.JSX.Element | null {
  const { lang, t } = useAppI18n();
  if (!practiceTextIsFallback(lang, kind)) return null;
  return (
    <p className={`rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground ${className}`} data-practice-text-note={lang}>
      {t("common.practiceNote", { language: LANGUAGES[lang].nativeName })}
    </p>
  );
}
