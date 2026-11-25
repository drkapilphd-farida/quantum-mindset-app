import en from "./script/en.json";
import hi from "./script/hi.json";
import type { BuLangCode } from "./types";

// Every Brain Unlock voice line (script/<lang>.json, the text each recording
// was voiced from). Go-live voice (founder, 14 Nov 2026): Sarvam "shubh", one
// clean recording per line at /audio/brain-unlock/<lang>/<id>.mp3. Dr. Kapil's
// voice-clone recordings are kept in /audio/brain-unlock/clone/; v2 copies
// the good ones into the main folder (see each line's `voice`). Sources for a line: his own upload / regenerate from the admin page
// → the bundled shubh file → a timed caption (muted, blocked or missing audio
// never stops the flow).

/**
 * voice = who speaks the bundled file (Brain Test v2): "dr-kapil" (his own
 * recording), "clone" (his Sarvam clone), "shubh" (Sarvam stock voice, to be
 * replaced) or "none" (no bundled file yet: voice it from the admin page).
 */
export type VoiceLine = { id: string; text: string; voice?: string };

/** Lines still without Dr. Kapil's voice in the bundle (the admin "voice all" list). */
export const needsDrKapilVoice = (l: VoiceLine): boolean =>
  l.voice !== "dr-kapil" && l.voice !== "clone";

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

export const lineUrl = (lang: BuLangCode, id: string): string =>
  `/audio/brain-unlock/${lang}/${id}.mp3`;

/** The files to try for a line, in order. */
export function voiceSources(
  lang: BuLangCode,
  id: string,
  overrides: Readonly<Record<string, string>>,
): string[] {
  const own = overrides[id];
  return [...(own !== undefined && own !== "" ? [own] : []), lineUrl(lang, id)];
}
