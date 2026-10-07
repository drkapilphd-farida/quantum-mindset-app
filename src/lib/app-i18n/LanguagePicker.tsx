"use client";

import { Check, Languages } from "lucide-react";
import { APP_LANGS, LANGUAGES, type AppLang } from "./languages";
import { useAppI18n } from "./client";

// Full language picker (welcome screen, settings): every language in its
// own script. New languages carry a small "being reviewed" note.
export function LanguagePicker({ className = "" }: { className?: string }): React.JSX.Element {
  const { lang, t, changeLanguage, changing } = useAppI18n();
  return (
    <div className={className} data-language-picker>
      <p className="text-sm font-medium text-foreground">{t("common.language.choose")}</p>
      <div role="radiogroup" aria-label={t("common.language.choose")} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {APP_LANGS.map((code) => {
          const on = code === lang;
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={on}
              lang={LANGUAGES[code].htmlLang}
              disabled={changing}
              onClick={() => changeLanguage(code)}
              className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60 ${
                on ? "border-primary bg-primary/10 font-semibold text-foreground" : "border-border text-foreground hover:border-primary/50"
              }`}
              data-lang-option={code}
            >
              <span>{LANGUAGES[code].nativeName}</span>
              {on && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {LANGUAGES[lang].review === "pending" && lang !== "hi" && (
        <p className="mt-2 text-xs text-muted-foreground">{t("common.language.reviewNote")}</p>
      )}
    </div>
  );
}

// Compact switcher for app headers: a native <select>, so it works the same
// on every phone. Options show each language in its own script.
// Short label for the compact switcher on phones, in the language's own script.
const SHORT_LABEL: Record<AppLang, string> = { en: "EN", hi: "हिं", kn: "ಕ", ta: "த", te: "తె", mr: "मर", gu: "ગુ", bn: "বা" };

// Compact switcher for app headers. On phones it shows only an icon and a
// short label (the header has no room for a full language name at 360px);
// the real <select> sits invisibly on top, so tapping it opens the native
// picker with every language written in its own script.
export function LanguageSwitcher({ className = "" }: { className?: string }): React.JSX.Element {
  const { lang, t, changeLanguage, changing } = useAppI18n();
  return (
    <label className={`relative inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-2 text-sm text-foreground ${className}`}>
      <span className="sr-only">{t("common.language.label")}</span>
      <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
      <span aria-hidden="true" className="sm:hidden" lang={LANGUAGES[lang].htmlLang}>
        {SHORT_LABEL[lang]}
      </span>
      <span aria-hidden="true" className="hidden sm:inline" lang={LANGUAGES[lang].htmlLang}>
        {LANGUAGES[lang].nativeName}
      </span>
      <select
        value={lang}
        disabled={changing}
        onChange={(event) => changeLanguage(event.target.value as AppLang)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        data-language-switcher
      >
        {APP_LANGS.map((code) => (
          <option key={code} value={code} lang={LANGUAGES[code].htmlLang}>
            {LANGUAGES[code].nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
