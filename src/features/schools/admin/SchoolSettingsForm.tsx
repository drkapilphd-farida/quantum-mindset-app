"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SCHOOLS_COPY } from "../copy";
import { METRIC_IDS, type MetricValues, type SchoolSettings } from "../settings";
import { saveSchoolSettings, schoolMediaUploadTarget } from "./actions";

// /admin/school-page: everything on /schools that changes without a deploy.
// Empty = hidden on the page (the hero shows a neutral illustration).
// Files upload straight to the public school-media bucket (signed URL);
// nothing changes on the page until "Save settings".

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const box = "flex flex-col gap-4 rounded-lg border p-4 sm:p-5";
const METRIC_LABEL: Record<(typeof METRIC_IDS)[number], string> = {
  focus: "Focus (/100)",
  memory: "Memory (/100)",
  reading: "Reading speed (WPM)",
  retention: "Retention (%)",
};

const emptyMetrics = (): MetricValues => ({
  focus: { day1: null, day30: null },
  memory: { day1: null, day30: null },
  reading: { day1: null, day30: null },
  retention: { day1: null, day30: null },
});

const toNum = (v: string): number | null => (v.trim() === "" || !Number.isFinite(Number(v)) ? null : Number(v));

function MetricsGrid({ value, onChange, prefix }: { value: MetricValues; onChange: (v: MetricValues) => void; prefix: string }): React.JSX.Element {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-sm">
      <span />
      <span className="w-24 text-center text-muted-foreground">Day 1</span>
      <span className="w-24 text-center text-muted-foreground">Day 30</span>
      {METRIC_IDS.map((id) => (
        <div key={id} className="contents">
          <span>{METRIC_LABEL[id]}</span>
          {(["day1", "day30"] as const).map((d) => (
            <input
              key={d}
              aria-label={`${METRIC_LABEL[id]} ${d === "day1" ? "Day 1" : "Day 30"}`}
              name={`${prefix}-${id}-${d}`}
              type="number"
              inputMode="decimal"
              min={0}
              className={`${field} w-24`}
              value={value[id][d] ?? ""}
              onChange={(e) => onChange({ ...value, [id]: { ...value[id], [d]: toNum(e.target.value) } })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Upload({
  slot,
  accept,
  onDone,
  label,
}: {
  slot: "hero" | "poster" | "sample";
  accept: string;
  onDone: (url: string, kind: "image" | "video") => void;
  label: string;
}): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function pick(f: File): Promise<void> {
    setBusy(true);
    setErr(null);
    const target = await schoolMediaUploadTarget({ slot, contentType: f.type, size: f.size });
    if (!target.ok) {
      setBusy(false);
      return setErr(target.error);
    }
    const { error } = await createClient().storage.from("school-media").uploadToSignedUrl(target.path, target.token, f, { contentType: f.type });
    setBusy(false);
    if (error) return setErr("Upload failed. Please try again.");
    onDone(target.publicUrl, f.type.startsWith("video/") ? "video" : "image");
  }
  return (
    <span className="flex flex-col gap-1">
      <label className="inline-flex w-fit cursor-pointer items-center rounded-md border px-3 py-1.5 text-sm font-medium">
        {busy ? "Uploading…" : label}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          data-school-upload={slot}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f !== undefined) void pick(f);
          }}
        />
      </label>
      {err !== null && <span className="text-sm text-destructive">{err}</span>}
    </span>
  );
}

export function SchoolSettingsForm({ initial }: { initial: SchoolSettings }): React.JSX.Element {
  const [s, setS] = useState<SchoolSettings>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof SchoolSettings>(k: K, v: SchoolSettings[K]): void => setS((cur) => ({ ...cur, [k]: v }));
  const faq = s.faq.length > 0 ? s.faq : SCHOOLS_COPY.en.faq.items.map((x, i) => ({ en: x, hi: SCHOOLS_COPY.hi.faq.items[i] ?? x }));
  const faqCustom = s.faq.length > 0;

  async function save(): Promise<void> {
    setBusy(true);
    setMsg(null);
    const res = await saveSchoolSettings(s);
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
  }

  return (
    <form
      className="flex max-w-3xl flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      data-school-settings
    >
      <section className={box}>
        <h2 className="text-lg font-semibold">Hero photo or video</h2>
        <p className="text-sm text-muted-foreground">A student wearing the EEG headband. Empty: a neutral illustration is shown.</p>
        <div className="flex flex-wrap items-center gap-3">
          <select className={`${field} w-auto`} value={s.hero.kind} onChange={(e) => set("hero", { ...s.hero, kind: e.target.value as SchoolSettings["hero"]["kind"] })}>
            <option value="none">Illustration (nothing uploaded)</option>
            <option value="image">Photo</option>
            <option value="video">Video (MP4)</option>
          </select>
          <Upload slot="hero" accept="image/jpeg,image/png,image/webp,video/mp4" label="Upload photo or video" onDone={(url, kind) => set("hero", { ...s.hero, url, kind })} />
        </div>
        {s.hero.url !== "" && (
          <p className="break-all text-xs text-muted-foreground">
            Current file: {s.hero.url}{" "}
            <button type="button" className="underline" onClick={() => set("hero", { kind: "none", url: "", poster: "" })}>
              Remove
            </button>
          </p>
        )}
        {s.hero.kind === "video" && (
          <div className="flex flex-col gap-2">
            <span className="text-sm">Still image shown before the video plays (optional)</span>
            <Upload slot="poster" accept="image/jpeg,image/png,image/webp" label="Upload still image" onDone={(url) => set("hero", { ...s.hero, poster: url })} />
            {s.hero.poster !== "" && <p className="break-all text-xs text-muted-foreground">Current: {s.hero.poster}</p>}
          </div>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-semibold">Sample Brain Passport images</h2>
        <p className="text-sm text-muted-foreground">Up to 6. Use a sample/fictional name only, never a real child&rsquo;s name without written consent.</p>
        {s.sampleReports.map((r, i) => (
          <div key={r.url} className="flex flex-col gap-2 rounded-md border p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file */}
            <img src={r.url} alt="" className="h-32 w-fit rounded border object-contain" />
            <input className={field} placeholder="Caption (English, optional)" value={r.caption.en} onChange={(e) => set("sampleReports", s.sampleReports.map((x, j) => (j === i ? { ...x, caption: { ...x.caption, en: e.target.value } } : x)))} />
            <input className={field} placeholder="Caption (Hindi, optional)" value={r.caption.hi} onChange={(e) => set("sampleReports", s.sampleReports.map((x, j) => (j === i ? { ...x, caption: { ...x.caption, hi: e.target.value } } : x)))} />
            <button type="button" className="w-fit text-sm text-destructive underline" onClick={() => set("sampleReports", s.sampleReports.filter((_, j) => j !== i))}>
              Remove image
            </button>
          </div>
        ))}
        {s.sampleReports.length < 6 && (
          <Upload slot="sample" accept="image/jpeg,image/png,image/webp" label="Add sample report image" onDone={(url) => set("sampleReports", [...s.sampleReports, { url, caption: { en: "", hi: "" } }])} />
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-semibold">Day 1 vs Day 30 example</h2>
        <p className="text-sm text-muted-foreground">Shown under the sample report, labelled &ldquo;Example&rdquo;. A row shows only when both values are filled; all empty hides the graphic.</p>
        <MetricsGrid prefix="example" value={s.example} onChange={(v) => set("example", v)} />
      </section>

      <section className={box}>
        <h2 className="text-lg font-semibold">Package prices</h2>
        <p className="text-sm text-muted-foreground">Empty shows &ldquo;Free&rdquo; for the Pilot and &ldquo;On request&rdquo; for the others. Example: &ldquo;₹499 per student&rdquo;.</p>
        {(["pilot", "camp", "program"] as const).map((id) => (
          <div key={id} className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr_1fr] sm:items-center">
            <span className="text-sm font-medium">{SCHOOLS_COPY.en.packages.items.find((p) => p.id === id)?.name}</span>
            <input className={field} name={`price-${id}-en`} placeholder="English" value={s.prices[id].en} onChange={(e) => set("prices", { ...s.prices, [id]: { ...s.prices[id], en: e.target.value } })} />
            <input className={field} name={`price-${id}-hi`} placeholder="Hindi (optional)" value={s.prices[id].hi} onChange={(e) => set("prices", { ...s.prices, [id]: { ...s.prices[id], hi: e.target.value } })} />
          </div>
        ))}
      </section>

      <section className={box}>
        <h2 className="text-lg font-semibold">Results so far (real school results only)</h2>
        <p className="text-sm text-muted-foreground">Class averages, Day 1 vs Day 30. The section is hidden until at least one result has a Day 1 and Day 30 value. Don&rsquo;t name a school without its permission.</p>
        {s.results.map((r, i) => {
          const upd = (patch: Partial<SchoolSettings["results"][number]>): void => set("results", s.results.map((x, j) => (j === i ? { ...x, ...patch } : x)));
          return (
            <div key={i} className="flex flex-col gap-2 rounded-md border p-3" data-school-result={i}>
              <input className={field} name={`result-${i}-label-en`} placeholder="Label, e.g. Class 8, a CBSE school in Vadodara" value={r.label.en} onChange={(e) => upd({ label: { ...r.label, en: e.target.value } })} />
              <input className={field} name={`result-${i}-label-hi`} placeholder="Label in Hindi (optional)" value={r.label.hi} onChange={(e) => upd({ label: { ...r.label, hi: e.target.value } })} />
              <input className={`${field} w-40`} name={`result-${i}-students`} type="number" min={1} placeholder="Students" value={r.students ?? ""} onChange={(e) => upd({ students: toNum(e.target.value) })} />
              <MetricsGrid prefix={`result-${i}`} value={r.metrics} onChange={(metrics) => upd({ metrics })} />
              <button type="button" className="w-fit text-sm text-destructive underline" onClick={() => set("results", s.results.filter((_, j) => j !== i))}>
                Remove result
              </button>
            </div>
          );
        })}
        {s.results.length < 12 && (
          <button type="button" className="w-fit rounded-md border px-3 py-1.5 text-sm font-medium" onClick={() => set("results", [...s.results, { label: { en: "", hi: "" }, students: null, metrics: emptyMetrics() }])}>
            Add a school result
          </button>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-semibold">FAQ for principals</h2>
        <p className="text-sm text-muted-foreground">{faqCustom ? "Your edited FAQ is shown." : "The standard FAQ is shown. Edit any answer to save your own version."}</p>
        {faq.map((item, i) => {
          const upd = (lang: "en" | "hi", k: "q" | "a", v: string): void => set("faq", faq.map((x, j) => (j === i ? { ...x, [lang]: { ...x[lang], [k]: v } } : x)));
          return (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-2">
              <input className={field} aria-label={`Question ${i + 1} (English)`} value={item.en.q} onChange={(e) => upd("en", "q", e.target.value)} />
              <input className={field} aria-label={`Question ${i + 1} (Hindi)`} value={item.hi.q} onChange={(e) => upd("hi", "q", e.target.value)} />
              <textarea className={`${field} min-h-24`} aria-label={`Answer ${i + 1} (English)`} value={item.en.a} onChange={(e) => upd("en", "a", e.target.value)} />
              <textarea className={`${field} min-h-24`} aria-label={`Answer ${i + 1} (Hindi)`} value={item.hi.a} onChange={(e) => upd("hi", "a", e.target.value)} />
              <button type="button" className="w-fit text-sm text-destructive underline" onClick={() => set("faq", faq.filter((_, j) => j !== i))}>
                Remove question
              </button>
            </div>
          );
        })}
        <div className="flex flex-wrap gap-3">
          {faq.length < 15 && (
            <button type="button" className="w-fit rounded-md border px-3 py-1.5 text-sm font-medium" onClick={() => set("faq", [...faq, { en: { q: "", a: "" }, hi: { q: "", a: "" } }])}>
              Add a question
            </button>
          )}
          {faqCustom && (
            <button type="button" className="w-fit rounded-md border px-3 py-1.5 text-sm font-medium" onClick={() => set("faq", [])}>
              Go back to the standard FAQ
            </button>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 flex items-center gap-3 border-t bg-background py-3">
        <button type="submit" disabled={busy} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50" data-school-settings-save>
          {busy ? "Saving…" : "Save settings"}
        </button>
        {msg !== null && (
          <span role="status" className={`text-sm ${msg.ok ? "text-success" : "text-destructive"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}
