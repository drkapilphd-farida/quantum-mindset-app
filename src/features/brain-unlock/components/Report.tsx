"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { readUtmParams } from "@/lib/analytics/utm";
import { shareOrDownload } from "@/features/reading-speed-test/shareCard";
import { saveBrainUnlockLead } from "../actions";
import type { BuCopy } from "../copy";
import { factsFrom, shareText, type ReportFacts } from "../messages";
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
import { trackBu, sessionId, type TrackContext } from "../tracking";
import type { ClassBand, RawRun } from "../types";
import { secondaryBtn, SKILL } from "./ui";

// The reveal: three Before → After cards per player, the Brain Unlock Score,
// the Brain Type (with its "fun, not a test" line), the main + role line,
// then the WhatsApp report form and sharing. Duo Mode: both side by side and
// a Team Score.

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
    <div className="rounded-2xl p-4 text-white" style={{ background: colour }}>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      <p className="font-heading text-[1.6rem] leading-tight tabular-nums">
        {before} → {after}
        {unit !== "" && <span className="ml-1 text-base">{unit}</span>}
      </p>
      <p className="mt-1 text-xs opacity-90">{note}</p>
    </div>
  );
}

function PlayerCards({
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
  return (
    <section className="flex flex-col gap-5" data-bu-report>
      <h2 className="text-[1.9rem] leading-tight text-foreground">
        {c.report.title}
      </h2>
      {child === undefined ? (
        <PlayerCards c={c} lang={lang} r={main} s={settings} />
      ) : (
        <>
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
            <PlayerCards
              c={c}
              lang={lang}
              r={main}
              s={settings}
              heading={c.report.you}
            />
            <PlayerCards
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
      <LeadForm
        c={c}
        lang={lang}
        role={role}
        classBand={classBand}
        childClassBand={childClassBand}
        duo={duo}
        runs={runs}
        track={track}
        onSaved={onSaved}
      />
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
  track,
  onSaved,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  role: BuRole;
  classBand: ClassBand | null;
  childClassBand: ClassBand | null;
  duo: boolean;
  runs: RawRun[];
  track: TrackContext;
  onSaved: (facts: ReportFacts) => void;
}): React.JSX.Element {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(): Promise<void> {
    setState("saving");
    setError(null);
    const res = await saveBrainUnlockLead({
      sessionId: sessionId(),
      firstName: name,
      phone,
      email,
      lang,
      role,
      classBand,
      childClassBand,
      duo,
      runs,
      utm: readUtmParams(),
      pageUrl: window.location.href,
    });
    if (!res.ok) {
      setState("idle");
      setError(res.error);
      return;
    }
    setState("saved");
    trackBu("whatsapp_submitted", track, {
      score: res.facts.score,
      type: res.facts.brainType,
    });
    onSaved(res.facts);
  }

  return (
    <section className="play-card flex flex-col gap-3 p-5" data-bu-lead={state}>
      <h3 className="text-xl leading-snug text-foreground">{c.lead.title}</h3>
      {state === "saved" ? (
        <div className="flex flex-col gap-1" data-bu-lead-saved>
          <p className="text-lg font-bold text-foreground">{c.lead.sent}</p>
          <p className="text-base text-muted-foreground">{c.lead.sentSub}</p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
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
            className="min-h-12 rounded-xl border-2 border-border bg-background px-4 text-base text-foreground"
          />
          <label className="sr-only" htmlFor="bu-phone">
            {c.lead.phone}
          </label>
          <input
            id="bu-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={c.lead.phone}
            className="min-h-12 rounded-xl border-2 border-border bg-background px-4 text-base text-foreground"
          />
          <label className="sr-only" htmlFor="bu-email">
            {c.lead.email}
          </label>
          <input
            id="bu-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.lead.email}
            className="min-h-12 rounded-xl border-2 border-border bg-background px-4 text-base text-foreground"
          />
          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#0b7a3e] px-5 text-lg font-bold text-white disabled:opacity-50"
            disabled={
              name.trim() === "" ||
              phone.trim().length < 10 ||
              state === "saving"
            }
            data-bu-lead-submit
          >
            {state === "saving" ? c.lead.saving : c.lead.submit}
          </button>
          <p className="text-xs text-muted-foreground">{c.lead.privacy}</p>
          {error !== null && (
            <p role="alert" className="text-sm font-semibold text-foreground">
              {error}
            </p>
          )}
        </form>
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
  async function shareImage(): Promise<void> {
    const t = settings.brainTypes[r.brainType];
    const blob = await drawBrainUnlockCard({
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
