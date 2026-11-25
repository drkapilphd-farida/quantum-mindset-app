// Server only. The admin "Regenerate" button: voices one Brain Unlock line
// again with the Sarvam Bulbul v3 "shubh" voice (the go-live voice, founder
// 14 Nov 2026), in ONE request — no splitting or joining. The bundled files
// were made with scripts/guided-audio/generate-sarvam-shubh.mjs (same voice
// and pace, plus silence trim and even loudness). Each take is transcribed
// (Sarvam speech-to-text) and voiced again (up to 3 takes) until it says
// exactly the script. SARVAM_API_KEY stays on the server, never logged.
import { logger } from "@/lib/logger";

/** Memory story and focus lines a little slower and calmer; the rest natural. */
export const linePace = (id: string): number =>
  /^(s\d-\d|memory-teach|memory-replay|focus-)/.test(id) ? 0.88 : 1.0;

/** "..." is the caption's pause mark: removed before voicing (punctuation gives the pauses). */
export const ttsText = (text: string): string =>
  text
    .replace(/\s*\.\.\.\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const isSarvamConfigured = (): boolean =>
  (process.env.SARVAM_API_KEY ?? "") !== "";

const tokens = (t: string): string[] =>
  t
    .toLowerCase()
    .replace(/[।,.!?:;"“”‘’()…]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** Does the transcript say the script (nothing added, missing or repeated)? Pure (tested). */
export function sameWords(want: string, got: string): boolean {
  const w = tokens(want);
  const g = tokens(got);
  // An English word in a Hindi line may come back as two; hyphenated words split.
  const extra =
    w.filter((t) => /[a-z]/.test(t) && /[ऀ-ॿ]/.test(want)).length +
    w.reduce((n, t) => n + (t.match(/-/g) ?? []).length, 0);
  if (
    g.length > w.length + extra ||
    g.length < w.length - Math.max(1, Math.ceil(w.length * 0.15))
  )
    return false;
  for (let i = 1; i < g.length; i++)
    if (
      g[i] === g[i - 1] &&
      !want.toLowerCase().includes(`${g[i]} ${g[i]}`) &&
      !want.includes(`${g[i]}-${g[i]}`)
    )
      return false;
  if (g.length >= 4 && g.at(-1) === g.at(-3) && g.at(-2) === g.at(-4))
    return false;
  return true;
}

const code = (lang: "en" | "hi"): string => (lang === "hi" ? "hi-IN" : "en-IN");

async function voiceOnce(
  lang: "en" | "hi",
  id: string,
  text: string,
  key: string,
  take: number,
): Promise<Buffer | null> {
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "api-subscription-key": key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_language_code: code(lang),
      model: "bulbul:v3",
      speaker: "shubh",
      pace: linePace(id),
      temperature: take === 1 ? 0.5 : 0.35,
      speech_sample_rate: 24000,
      output_audio_codec: "mp3",
    }),
  });
  if (!res.ok) {
    logger.warn("brain-unlock voice: tts failed", { status: res.status });
    return null;
  }
  const body = (await res.json()) as { audios?: string[] };
  return body.audios === undefined
    ? null
    : Buffer.from(body.audios.join(""), "base64");
}

async function heard(
  lang: "en" | "hi",
  mp3: Buffer,
  key: string,
): Promise<string | null> {
  const form = new FormData();
  form.set(
    "file",
    new Blob([new Uint8Array(mp3)], { type: "audio/mpeg" }),
    "line.mp3",
  );
  form.set("model", "saarika:v2.5");
  form.set("language_code", code(lang));
  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: { "api-subscription-key": key },
    body: form,
  });
  if (!res.ok) return null;
  return ((await res.json()) as { transcript?: string }).transcript ?? null;
}

/** The whole line as one MP3 in the shubh voice, checked against the script; or null. */
export async function shubhVoiceMp3(
  lang: "en" | "hi",
  id: string,
  scriptText: string,
): Promise<Buffer | null> {
  const key = process.env.SARVAM_API_KEY ?? "";
  if (key === "") return null;
  const text = ttsText(scriptText);
  let best: Buffer | null = null;
  for (let take = 1; take <= 3; take++) {
    const mp3 = await voiceOnce(lang, id, text, key, take);
    if (mp3 === null) return best;
    best = mp3;
    const got = await heard(lang, mp3, key);
    // Speech-to-text unavailable → keep the take rather than fail.
    if (got === null || sameWords(text, got)) break;
  }
  return best;
}

/**
 * Dr. Kapil's own Sarvam voice clones ("Dr Kapil english" / "Dr Kapil Hindi",
 * Instant Voice Cloning). The ids are not secrets (GET /voices lists them).
 * Brain Test v2 (founder, 25 Nov 2026): every line he did not record himself
 * is voiced with these clones, from the admin page.
 */
export const CLONE_VOICES = {
  en: "svc-0457f3df-1b84-4269-894c-39bb8bcd4a91",
  hi: "svc-26aff049-8578-4114-b5cf-560109fe6b74",
} as const;

async function cloneOnce(
  lang: "en" | "hi",
  id: string,
  text: string,
  key: string,
): Promise<Buffer | null> {
  const form = new FormData();
  form.set("voice_id", CLONE_VOICES[lang]);
  form.set("text", text);
  form.set("language_code", code(lang));
  form.set("pace", String(linePace(id)));
  form.set("output_audio_codec", "mp3");
  form.set("speech_sample_rate", "24000");
  form.set("enable_qc", "true");
  const res = await fetch("https://api.sarvam.ai/voices/clone", {
    method: "POST",
    headers: { "api-subscription-key": key },
    body: form,
  });
  if (!res.ok) {
    logger.warn("brain-unlock voice: clone tts failed", { status: res.status });
    return null;
  }
  const body = (await res.json()) as { audio_b64?: string; audio?: string };
  const b64 = body.audio_b64 ?? body.audio;
  return b64 === undefined ? null : Buffer.from(b64, "base64");
}

/** The whole line as one MP3 in Dr. Kapil's clone voice, checked against the script (up to 4 takes); or null. */
export async function cloneVoiceMp3(
  lang: "en" | "hi",
  id: string,
  scriptText: string,
): Promise<{ mp3: Buffer; checked: boolean } | null> {
  const key = process.env.SARVAM_API_KEY ?? "";
  if (key === "") return null;
  const text = ttsText(scriptText);
  let best: Buffer | null = null;
  for (let take = 1; take <= 4; take++) {
    const mp3 = await cloneOnce(lang, id, text, key);
    if (mp3 === null) break;
    best = mp3;
    const got = await heard(lang, mp3, key);
    if (got === null || sameWords(text, got)) return { mp3, checked: got !== null };
  }
  return best === null ? null : { mp3: best, checked: false };
}
