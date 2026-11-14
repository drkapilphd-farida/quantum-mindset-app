"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cloneUrl, VOICE_LINES } from "../voiceLines";
import {
  applyUploadedVoice,
  regenerateVoiceLine,
  resetVoiceLine,
  voiceUploadTarget,
} from "./voiceActions";

// Every Brain Unlock voice line, one row each: the text, ▶ play (what visitors
// hear now), "Replace with my own recording" (MP3), "Regenerate" (his cloned
// voice again) and "Use standard" (back to the bundled clone file).

const MAX_BYTES = 2 * 1024 * 1024; // the guided-audio bucket's limit
const btn =
  "rounded border border-border px-2.5 py-1 text-xs font-semibold disabled:opacity-50";

function Row({
  lang,
  id,
  text,
  override,
  onChanged,
}: {
  lang: "en" | "hi";
  id: string;
  text: string;
  override: string | undefined;
  onChanged: (url: string | null) => void;
}): React.JSX.Element {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const src = override ?? cloneUrl(lang, id);

  async function upload(f: File): Promise<void> {
    if (!/\.mp3$/i.test(f.name) && f.type !== "audio/mpeg")
      return setMsg({ ok: false, text: "Please choose an MP3 file." });
    if (f.size > MAX_BYTES)
      return setMsg({ ok: false, text: "The file is over 2 MB." });
    setBusy("upload");
    setMsg(null);
    const target = await voiceUploadTarget({ lang, id });
    if (!target.ok) {
      setBusy(null);
      return setMsg({ ok: false, text: target.error });
    }
    const { error } = await createClient()
      .storage.from("guided-audio")
      .uploadToSignedUrl(target.path, target.token, f, {
        contentType: "audio/mpeg",
      });
    if (error) {
      setBusy(null);
      return setMsg({ ok: false, text: "Upload failed. Please try again." });
    }
    const res = await applyUploadedVoice({ lang, id, path: target.path });
    setBusy(null);
    setMsg(
      res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error },
    );
    if (res.ok) onChanged(res.url);
  }

  async function run(
    kind: "regen" | "reset",
    action: typeof regenerateVoiceLine,
  ): Promise<void> {
    setBusy(kind);
    setMsg(null);
    const res = await action({ lang, id });
    setBusy(null);
    setMsg(
      res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error },
    );
    if (res.ok) onChanged(res.url);
  }

  return (
    <li
      className="flex flex-col gap-1.5 border-b border-border py-2.5"
      data-voice-line={`${lang}-${id}`}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <code className="text-xs text-muted-foreground">{id}</code>
        <span
          className={`rounded px-1.5 text-[11px] font-semibold ${override !== undefined ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}
        >
          {override !== undefined
            ? "Your upload / new take"
            : "Dr. Kapil clone (standard)"}
        </span>
      </div>
      <p className="text-sm" lang={lang}>
        {text.replace(/\s*\.\.\.\s*/g, " … ")}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => {
            audio.current?.pause();
            audio.current = new Audio(src);
            void audio.current.play().catch(() => undefined);
          }}
          data-voice-play
        >
          ▶ Play
        </button>
        <button
          type="button"
          className={btn}
          disabled={busy !== null}
          onClick={() => file.current?.click()}
        >
          {busy === "upload" ? "Uploading…" : "Replace with my own recording"}
        </button>
        <input
          ref={file}
          type="file"
          accept="audio/mpeg,.mp3"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f !== undefined) void upload(f);
          }}
        />
        <button
          type="button"
          className={btn}
          disabled={busy !== null}
          onClick={() => void run("regen", regenerateVoiceLine)}
        >
          {busy === "regen" ? "Regenerating… (up to a minute)" : "Regenerate"}
        </button>
        {override !== undefined && (
          <button
            type="button"
            className={btn}
            disabled={busy !== null}
            onClick={() => void run("reset", resetVoiceLine)}
          >
            Use standard
          </button>
        )}
      </div>
      {msg !== null && (
        <p
          className={`text-xs ${msg.ok ? "text-foreground" : "font-semibold text-destructive"}`}
        >
          {msg.text}
        </p>
      )}
    </li>
  );
}

export function VoiceLinesPanel({
  initial,
}: {
  initial: { en: Record<string, string>; hi: Record<string, string> };
}): React.JSX.Element {
  const [lang, setLang] = useState<"en" | "hi">("hi");
  const [overrides, setOverrides] = useState(initial);
  return (
    <section className="space-y-3" data-voice-panel>
      <h2 className="text-lg font-semibold">Voice lines (Dr. Kapil’s voice)</h2>
      <p className="text-xs text-muted-foreground">
        Every line visitors hear, in your Sarvam voice clone. Changes go live at
        once. Your own recording: MP3, up to 2 MB. If a file ever fails to load,
        the page falls back to the older Sarvam “shubh” voice, then to on-screen
        text.
      </p>
      <div className="flex gap-2">
        {(["hi", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded px-3 py-1 text-sm font-semibold ${lang === l ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            {l === "hi" ? "Hindi" : "English"} ({VOICE_LINES[l].length})
          </button>
        ))}
      </div>
      <ol>
        {VOICE_LINES[lang].map((line) => (
          <Row
            key={`${lang}-${line.id}`}
            lang={lang}
            id={line.id}
            text={line.text}
            override={overrides[lang][line.id]}
            onChanged={(url) => {
              const next = { ...overrides[lang] };
              if (url === null) delete next[line.id];
              else next[line.id] = url;
              setOverrides({ ...overrides, [lang]: next });
            }}
          />
        ))}
      </ol>
    </section>
  );
}
