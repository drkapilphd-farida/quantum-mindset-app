import en from "./script/en.json";
import hi from "./script/hi.json";
import type { BuLangCode } from "./types";

// Every Brain Unlock voice line (script/<lang>.json, the text each recording
// was voiced from). Active audio: Dr. Kapil's own cloned voice (Sarvam Instant
// Voice Cloning, 14 Nov 2026) at /audio/brain-unlock/<lang>/<id>.mp3. Order of
// sources for a line: his own upload / regenerate from the admin page → the
// bundled clone file → the older Sarvam "shubh" file (fallback) → a timed
// caption (muted, blocked or missing audio never stops the flow).

export type VoiceLine = { id: string; text: string };

export const VOICE_LINES: Readonly<Record<BuLangCode, readonly VoiceLine[]>> = {
  en: en.lines,
  hi: hi.lines,
};

/** The script text for a line (also the caption when there is no copy for it). */
export function voiceText(lang: BuLangCode, id: string): string {
  return (
    VOICE_LINES[lang]
      .find((l) => l.id === id)
      ?.text.replace(/\s*\.\.\.\s*/g, " ") ?? ""
  );
}

export const cloneUrl = (lang: BuLangCode, id: string): string =>
  `/audio/brain-unlock/${lang}/${id}.mp3`;
export const shubhUrl = (lang: BuLangCode, id: string): string =>
  `/audio/brain-unlock/shubh/${lang}/${id}.mp3`;

/** The files to try for a line, in order. */
export function voiceSources(
  lang: BuLangCode,
  id: string,
  overrides: Readonly<Record<string, string>>,
): string[] {
  const own = overrides[id];
  return [
    ...(own !== undefined && own !== "" ? [own] : []),
    cloneUrl(lang, id),
    shubhUrl(lang, id),
  ];
}
