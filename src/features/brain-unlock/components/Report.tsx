"use client";

import { useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { SITE_CONFIG_WHATSAPP_NUMBER } from "@/config/site.config";
import { readUtmParams } from "@/lib/analytics/utm";
import {
  finishWhatsAppHandoff,
  openPendingWhatsAppTab,
} from "@/lib/whatsapp/handoff";
import { shareOrDownload } from "@/features/reading-speed-test/shareCard";
import { saveBrainUnlockLead, type LeadFailReason, type SavedLead } from "../actions";
import { leadPhoneDigits } from "../leadPhone";
import type { BuCopy } from "../copy";
import {
  factsFrom,
  reportChatText,
  shareText,
  waLink,
  type ReportFacts,
} from "../messages";
import type { BuRole } from "../passages";
import {
  focusSeconds,
  MEMORY_TOTAL,
  scoreBand,
  teamScore,
  type PlayerReport,
} from "../scoring";
import type { BuSettings } from "../settings";
import { drawBrainUnlockCard } from "../shareImage";
import { deviceId } from "../deviceMemory";
import { trackBu, sessionId, type TrackContext } from "../tracking";
import { currentDevice } from "../device";
import type { ClassBand, RawRun } from "../types";
import { secondaryBtn, SKILL } from "./ui";

// The reveal: three Before → After cards per player, then straight away the
// WhatsApp ask (founder, 15 Nov 2026: on the first report screen, with a new
// reason — Dr. Kapil's 30-day plan + your biggest gap + a free Day-30 re-test;
// number required, name optional, friendly checks in the page's language),
// then the Brain Unlock Score and Brain Type (always free and visible), the
// main + role line. "Get my plan on WhatsApp" saves the lead and opens
// wa.me to Dr. Kapil's WhatsApp Business number with the report typed in, so
// the visitor starts the chat (founder, 14 Nov 2026: no WhatsApp API) — and
// sharing / the report image. Duo Mode: both side by side and a Team Score.

const TEST_PATH = "/reading-memory-test";

function Card({
  colour,
  label,
  before,
  after,
  unit,
  note,
}: {
  colour: string;
  label: string;
  before: string;
  after: string;
  unit: string;
  note: string;
}): React.JSX.Element {
  return (
    <div className="rounded-2xl px-4 py-3 text-white" style={{ background: colour }}>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      <p className="font-heading text-[1.5rem] leading-tight tabular-nums">
        {before} → {after}
        {unit !== "" && <span className="ml-1 text-base">{unit}</span>}
      </p>
      <p className="mt-1 text-xs opacity-90">{note}</p>
    </div>
  );
}

/** The three big Before → After cards for one player. */
function MetricCards({
  c,
  lang,
  r,
  s,
  heading,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  r: PlayerReport;
  s: BuSettings;
  heading?: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2.5" data-bu-metrics>
      {heading !== undefined && (
        <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          {heading}
        </p>
      )}
      <Card
        colour={SKILL.speed}
        label={`⚡ ${c.report.speed}`}
        before={String(r.speedBefore.wpm)}
        after={
          r.speedCounted ? String(r.speedAfter.wpm) : String(r.speedBefore.wpm)
        }
        unit={c.report.wpm}
        note={s.goals.speed[lang]}
      />
      <Card
        colour={SKILL.memory}
        label={`🧠 ${c.report.memory}`}
        before={`${r.memoryBefore}/${MEMORY_TOTAL}`}
        after={`${r.memoryForward}/${MEMORY_TOTAL}`}
        unit=""
        note={s.goals.memory[lang]}
      />
      <Card
        colour={SKILL.focus}
        label={`🎯 ${c.report.focus}`}
        before={`${focusSeconds(r.focusBefore)}s`}
        after={`${focusSeconds(r.focusAfter)}s`}
        unit=""
        note={s.goals.focus[lang]}
      />
    </div>
  );
}

/** The Brain Unlock Score and Brain Type for one player (free, always shown). */
function ScoreTypeCards({
  c,
  lang,
  r,
  s,
  heading,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  r: PlayerReport;
  s: BuSettings;
  heading?: string;
}): React.JSX.Element {
  const t = s.brainTypes[r.brainType];
  return (
    <div
      className="flex flex-col gap-3"
      data-bu-player-report={r.brainType}
      data-bu-score={r.score.total}
    >
      {heading !== undefined && (
        <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          {heading}
        </p>
      )}
      <div className="play-card flex flex-col gap-1 p-4">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {c.report.score}
        </p>
        <p
          className="font-heading text-[2.4rem] leading-none text-foreground tabular-nums"
          data-bu-total
        >
          {r.score.total}
          <span className="text-lg text-muted-foreground">/100</span>
          <span className="ml-2 align-middle text-base font-semibold text-primary">
            {scoreBand(r.score.total, s.scoring)[lang]}
          </span>
        </p>
      </div>
      <div
        className="play-card flex flex-col gap-1 p-4"
        data-bu-type={r.brainType}
      >
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {c.report.yourType}
        </p>
        <p className="font-heading text-2xl text-foreground">
          {t.emoji} {t[lang].name}
        </p>
        <p className="text-base text-foreground">{t[lang].line}</p>
      </div>
    </div>
  );
}

export function Report({
  c,
  lang,
  role,
  classBand,
  childClassBand,
  duo,
  reports,
  runs,
  settings,
  track,
  onSaved,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  role: BuRole;
  classBand: ClassBand | null;
  childClassBand: ClassBand | null;
  duo: boolean;
  reports: PlayerReport[];
  runs: RawRun[];
  settings: BuSettings;
  track: TrackContext;
  onSaved: (facts: ReportFacts) => void;
}): React.JSX.Element {
  const main = reports[0]!;
  const child = duo ? reports[1] : undefined;
  const lead = (
    <LeadForm
      c={c}
      lang={lang}
      role={role}
      classBand={classBand}
      childClassBand={childClassBand}
      duo={duo}
      runs={runs}
      settings={settings}
      track={track}
      onSaved={onSaved}
      preview={{ ...factsFrom("", main), ...(child !== undefined ? { child: { ...factsFrom("", child), label: c.report.child } } : {}) }}
    />
  );
  return (
    <section className="flex flex-col gap-5" data-bu-report>
      <h2 className="text-[1.6rem] leading-tight text-foreground">
        {c.report.title}
      </h2>
      {child === undefined ? (
        <>
          <MetricCards c={c} lang={lang} r={main} s={settings} />
          {lead}
          <ScoreTypeCards c={c} lang={lang} r={main} s={settings} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <MetricCards
              c={c}
              lang={lang}
              r={main}
              s={settings}
              heading={c.report.you}
            />
            <MetricCards
              c={c}
              lang={lang}
              r={child}
              s={settings}
              heading={c.report.child}
            />
          </div>
          {child.memoryForward > child.memoryBefore && (
            <p className="text-lg font-bold text-foreground">
              {c.report.duoLine(child.memoryBefore, child.memoryForward)}
            </p>
          )}
          {lead}
          <div
            className="play-card p-4 text-center"
            data-bu-team={teamScore(main.score, child.score)}
          >
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {c.report.team}
            </p>
            <p className="font-heading text-[2.4rem] leading-none text-foreground tabular-nums">
              {teamScore(main.score, child.score)}
              <span className="text-lg text-muted-foreground">/100</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ScoreTypeCards
              c={c}
              lang={lang}
              r={main}
              s={settings}
              heading={c.report.you}
            />
            <ScoreTypeCards
              c={c}
              lang={lang}
              r={child}
              s={settings}
              heading={c.report.child}
            />
          </div>
        </>
      )}
      <p className="text-xs text-muted-foreground">{c.report.disclaimer}</p>
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #6d28d9, #2563eb)" }}
      >
        <p className="font-heading text-xl leading-snug">{c.report.main}</p>
        <p className="mt-2 text-base opacity-95">{c.report.roleLine[role]}</p>
      </div>
      <ShareBlock
        c={c}
        lang={lang}
        r={main}
        settings={settings}
        track={track}
      />
    </section>
  );
}

function LeadForm({
  c,
  lang,
  role,
  classBand,
  childClassBand,
  duo,
  runs,
  settings,
  track,
  onSaved,
  preview,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  role: BuRole;
  classBand: ClassBand | null;
  childClassBand: ClassBand | null;
  duo: boolean;
  runs: RawRun[];
  settings: BuSettings;
  track: TrackContext;
  onSaved: (facts: ReportFacts) => void;
  /** This browser's own numbers: the WhatsApp message if the save failed. */
  preview: ReportFacts;
}): React.JSX.Element {
  // Founder (17 Nov 2026): the main button opens WhatsApp at once, no number
  // needed — the lead is saved first (scores, Brain Type, UTM, session, no
  // phone) and the message carries its Ref so Dr. Kapil can match the chat.
  // "Or get it on your number" stays as a small option below.
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "chat" | "number">("idle");
  const [error, setError] = useState<string | null>(null);
  const [badField, setBadField] = useState<"phone" | "email" | null>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  /** A server reason → a friendly line in the page's language. */
  const messageFor = (reason: LeadFailReason): string =>
    reason === "phone"
      ? c.lead.errors.phoneInvalid
      : reason === "email"
        ? c.lead.errors.email
        : reason === "rate"
          ? c.lead.errors.tooMany
          : c.error;

  const save = (withNumber: boolean): Promise<SavedLead> =>
    saveBrainUnlockLead({
      sessionId: sessionId(),
      firstName: withNumber ? name : "",
      phone: withNumber ? phone : "",
      email: withNumber ? email : "",
      lang,
      role,
      classBand,
      childClassBand,
      duo,
      runs,
      utm: readUtmParams(),
      deviceId: deviceId(),
      device: currentDevice(),
      pageUrl: window.location.href,
    }).catch((): SavedLead => ({ ok: false, error: c.error, reason: "network" }));

  /** The main button: save (no number), then open WhatsApp with the report typed in. */
  async function openWhatsApp(): Promise<void> {
    if (state === "saving") return; // a second tap while saving does nothing
    // Phones only allow a new tab during the tap: open it now, point it at wa.me once saved.
    const tab = openPendingWhatsAppTab();
    setState("saving");
    setError(null);
    trackBu("whatsapp_opened", track, { via: "chat" });
    const res = await save(false);
    if (res.ok) {
      trackBu("whatsapp_submitted", track, { via: "chat", score: res.facts.score, type: res.facts.brainType });
      onSaved(res.facts);
    } else trackBu("lead_save_failed", track, { reason: res.reason, via: "chat" });
    // WhatsApp opens either way: the visitor is never stuck (without a Ref if the save failed).
    const url = waLink(
      SITE_CONFIG_WHATSAPP_NUMBER,
      res.ok
        ? reportChatText(res.facts, settings, lang, res.ref)
        : reportChatText(preview, settings, lang),
    );
    setWaUrl(url);
    setState("chat");
    finishWhatsAppHandoff(tab, url);
  }

  function fail(field: "phone" | "email" | null, text: string, reason: string): void {
    setError(text);
    setBadField(field);
    trackBu("lead_save_failed", track, { reason, where: "browser", via: "number" });
    (field === "email" ? emailRef : phoneRef).current?.focus();
  }

  /** "Or get it on your number": friendly checks, save with the number, no WhatsApp opened. */
  async function saveNumber(): Promise<void> {
    if (state === "saving") return;
    trackBu("lead_submit_tried", track, { email: email.trim() !== "", via: "number" });
    if (phone.trim() === "") return fail("phone", c.lead.errors.phoneMissing, "phone_missing");
    if (leadPhoneDigits(phone) === null) return fail("phone", c.lead.errors.phoneInvalid, "phone");
    if (email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return fail("email", c.lead.errors.email, "email");
    setState("saving");
    setError(null);
    setBadField(null);
    const res = await save(true);
    if (!res.ok) {
      trackBu("lead_save_failed", track, { reason: res.reason, via: "number" });
      setState("idle");
      setError(messageFor(res.reason));
      setBadField(res.reason === "phone" ? "phone" : res.reason === "email" ? "email" : null);
      return;
    }
    trackBu("whatsapp_submitted", track, { via: "number", score: res.facts.score, type: res.facts.brainType });
    onSaved(res.facts);
    setState("number");
  }

  const field = (bad: boolean): string =>
    `min-h-12 rounded-xl border-2 bg-background px-4 text-base text-foreground ${bad ? "border-[var(--play-warn)]" : "border-border"}`;

  return (
    <section className="play-card flex flex-col gap-3 p-5" data-bu-lead={state}>
      <h3 className="text-xl leading-snug text-foreground">{c.lead.title}</h3>
      <p className="text-sm font-semibold text-foreground" data-bu-retest>
        {c.lead.retest}
      </p>
      {state === "chat" ? (
        <div className="flex flex-col gap-2" data-bu-lead-saved="chat">
          <p className="text-lg font-bold text-foreground">{c.lead.sent}</p>
          <p className="text-base text-muted-foreground">{c.lead.sentSub}</p>
          {waUrl !== null && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-[#0b7a3e] px-5 text-base font-bold text-[#0b7a3e]"
              data-bu-wa-link
            >
              {c.lead.again}
            </a>
          )}
        </div>
      ) : state === "number" ? (
        <p className="text-lg font-bold text-foreground" data-bu-lead-saved="number">
          {c.lead.numberSaved}
        </p>
      ) : (
        <>
          {/* Always bright: one tap opens WhatsApp with the report typed in. */}
          <button
            type="button"
            onClick={() => void openWhatsApp()}
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#0b7a3e] px-5 text-lg font-bold text-white shadow-[0_4px_0_#065f2e] active:translate-y-0.5"
            aria-busy={state === "saving"}
            data-bu-lead-submit
          >
            {state === "saving" ? c.lead.saving : c.lead.submit}
          </button>
          <p className="text-xs text-muted-foreground">{c.lead.chatHint}</p>
          <details className="rounded-xl border border-border px-3 py-2" data-bu-number-option>
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              {c.lead.orNumber}
            </summary>
            <form
              className="mt-2 flex flex-col gap-2"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void saveNumber();
              }}
            >
              <label className="sr-only" htmlFor="bu-phone">
                {c.lead.phone}
              </label>
              <input
                id="bu-phone"
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={c.lead.phone}
                aria-invalid={badField === "phone"}
                aria-describedby={error !== null ? "bu-lead-error" : undefined}
                className={field(badField === "phone")}
              />
              <label className="sr-only" htmlFor="bu-name">
                {c.lead.name}
              </label>
              <input
                id="bu-name"
                type="text"
                autoComplete="given-name"
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.lead.name}
                className={field(false)}
              />
              <label className="sr-only" htmlFor="bu-email">
                {c.lead.email}
              </label>
              <input
                id="bu-email"
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.lead.email}
                aria-invalid={badField === "email"}
                className={field(badField === "email")}
              />
              {error !== null && (
                <p
                  id="bu-lead-error"
                  role="alert"
                  className="rounded-xl bg-[var(--play-warn-bg)] px-3 py-2 text-sm font-semibold text-[var(--play-warn)]"
                  data-bu-lead-error
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-[#0b7a3e] px-5 text-base font-bold text-[#0b7a3e]"
                data-bu-number-submit
              >
                {state === "saving" ? c.lead.savingNumber : c.lead.sendToNumber}
              </button>
              <p className="text-xs text-muted-foreground">{c.lead.privacy}</p>
            </form>
          </details>
        </>
      )}
    </section>
  );
}

function ShareBlock({
  c,
  lang,
  r,
  settings,
  track,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  r: PlayerReport;
  settings: BuSettings;
  track: TrackContext;
}): React.JSX.Element {
  const url = (): string =>
    `${window.location.origin}${TEST_PATH}?utm_source=share&utm_medium=brain_unlock&utm_campaign=bu_share_${lang}`;
  const facts = (): ReportFacts => factsFrom("", r);
  const card = (): Promise<Blob> => {
    const t = settings.brainTypes[r.brainType];
    return drawBrainUnlockCard({
      title: "Brain Unlock",
      typeEmoji: t.emoji,
      typeName: t[lang].name,
      typeLine: t[lang].line,
      scoreLabel: c.report.score,
      score: r.score.total,
      cards: [
        {
          colour: SKILL.speed,
          label: `⚡ ${c.report.speed}`,
          value: r.speedCounted
            ? `${r.speedBefore.wpm} → ${r.speedAfter.wpm} WPM`
            : `${r.speedBefore.wpm} WPM`,
        },
        {
          colour: SKILL.memory,
          label: `🧠 ${c.report.memory}`,
          value: `${r.memoryBefore}/5 → ${r.memoryForward}/5`,
        },
        {
          colour: SKILL.focus,
          label: `🎯 ${c.report.focus}`,
          value: `${focusSeconds(r.focusBefore)}s → ${focusSeconds(r.focusAfter)}s`,
        },
      ],
      footer: "Mind Ur Mind · Dr. Kapil Dev Sharma",
      url: url()
        .replace(/^https?:\/\//, "")
        .split("?")[0]!,
    });
  };
  async function downloadImage(): Promise<void> {
    const blob = await card();
    trackBu("share_clicked", track, { method: "download" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "brain-unlock-report.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 10_000);
  }
  async function shareImage(): Promise<void> {
    const blob = await card();
    trackBu("share_clicked", track, { method: "image" });
    await shareOrDownload(
      blob,
      shareText(facts(), settings, lang, url()),
    ).catch(() => undefined);
  }
  return (
    <section className="flex flex-col gap-2" data-bu-share>
      <h3 className="text-lg text-foreground">{c.share.title}</h3>
      <button
        type="button"
        className={secondaryBtn}
        onClick={() => void downloadImage()}
        data-bu-download-image
      >
        <Download className="size-4" aria-hidden="true" />
        {c.share.download}
      </button>
      <button
        type="button"
        className={secondaryBtn}
        onClick={() => void shareImage()}
        data-bu-share-image
      >
        <Share2 className="size-4" aria-hidden="true" />
        {c.share.image}
      </button>
      <button
        type="button"
        className={secondaryBtn}
        onClick={() => {
          trackBu("share_clicked", track, { method: "whatsapp" });
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText(facts(), settings, lang, url()))}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
        data-bu-share-whatsapp
      >
        {c.share.whatsapp}
      </button>
    </section>
  );
}
