import type { PlayerReport } from "./scoring";
import { focusSeconds, MEMORY_TOTAL } from "./scoring";
import type { BrainTypeId, BuSettings } from "./settings";
import type { BuLangCode } from "./types";

// Every text that leaves the page with the user's numbers: the WhatsApp chat
// pre-fill, the share line, the report email and the five WhatsApp
// follow-ups. Real numbers only; "you saw it yourself", never "guaranteed".
// Messages: English with warm Hindi words in Devanagari (founder spec).

export type ReportFacts = {
  firstName: string;
  brainType: BrainTypeId;
  score: number;
  speed: { before: number; after: number; counted: boolean };
  memory: { before: number; forward: number; backward: number };
  focus: { before: number; after: number };
  /** Duo Mode: the child's facts. */
  child?: Omit<ReportFacts, "firstName" | "child"> & { label: string };
};

export function factsFrom(
  firstName: string,
  r: PlayerReport,
): Omit<ReportFacts, "child"> {
  return {
    firstName,
    brainType: r.brainType,
    score: r.score.total,
    speed: {
      before: r.speedBefore.wpm,
      after: r.speedAfterWpm,
      counted: r.speedCounted,
    },
    memory: {
      before: r.memoryBefore,
      forward: r.memoryForward,
      backward: r.memoryBackward,
    },
    focus: {
      before: focusSeconds(r.focusBefore),
      after: focusSeconds(r.focusAfter),
    },
  };
}

const typeName = (s: BuSettings, id: BrainTypeId, lang: BuLangCode): string =>
  `${s.brainTypes[id].emoji} ${s.brainTypes[id][lang].name}`;

/** The three before → after lines, in the user's language. */
export function numberLines(
  f: Omit<ReportFacts, "firstName" | "child">,
  lang: BuLangCode,
): string[] {
  const speed = f.speed.counted
    ? `⚡ ${f.speed.before} → ${f.speed.after} WPM`
    : `⚡ ${f.speed.before} WPM`;
  const memory = `🧠 ${f.memory.before}/${MEMORY_TOTAL} → ${f.memory.forward}/${MEMORY_TOTAL}${f.memory.backward === MEMORY_TOTAL ? (lang === "hi" ? " (उल्टा भी!)" : " (backwards too!)") : ""}`;
  const focus = `🎯 ${f.focus.before}s → ${f.focus.after}s`;
  return [speed, memory, focus];
}

export function whatsappChatText(
  f: ReportFacts,
  s: BuSettings,
  lang: BuLangCode,
): string {
  const head =
    lang === "hi"
      ? `नमस्ते Dr. Kapil, मैंने अभी Brain Unlock किया। मेरा Brain Type: ${typeName(s, f.brainType, lang)} (Score ${f.score}/100).`
      : `Hi Dr. Kapil, I just did Brain Unlock. My Brain Type: ${typeName(s, f.brainType, lang)} (Score ${f.score}/100).`;
  const child =
    f.child === undefined
      ? []
      : [
          `${f.child.label}: ${typeName(s, f.child.brainType, lang)} (${f.child.score}/100)`,
          ...numberLines(f.child, lang),
        ];
  const ask =
    lang === "hi"
      ? "मुझे Sharp Brain के बारे में जानना है।"
      : "I want to know about Sharp Brain.";
  return [head, ...numberLines(f, lang), ...child, ask].join("\n");
}

export function shareText(
  f: ReportFacts,
  s: BuSettings,
  lang: BuLangCode,
  url: string,
): string {
  const t = s.brainTypes[f.brainType];
  const speed = f.speed.counted && f.speed.after > f.speed.before;
  if (lang === "hi") {
    const line = speed
      ? `4 मिनट में मेरी reading speed ${f.speed.before} → ${f.speed.after} हो गई।`
      : `4 मिनट में मेरी memory ${f.memory.before}/5 → ${f.memory.forward}/5 हो गई।`;
    return `मैं ${t.emoji} ${t.hi.name} हूँ! ${line} आपका Brain Type क्या है? ${url}`;
  }
  const line = speed
    ? `My reading speed went ${f.speed.before} → ${f.speed.after} in 4 minutes.`
    : `My memory went ${f.memory.before}/5 → ${f.memory.forward}/5 in 4 minutes.`;
  return `I’m a ${t.emoji} ${t.en.name}! ${line} What’s your Brain Type? ${url}`;
}

export type FollowupStep = "instant" | "h1" | "d1" | "d2" | "d30";
export const FOLLOWUP_DELAYS_MS: Readonly<Record<FollowupStep, number>> = {
  instant: 0,
  h1: 60 * 60_000,
  d1: 24 * 60 * 60_000,
  d2: 2 * 24 * 60 * 60_000,
  d30: 30 * 24 * 60 * 60_000,
};

export type FollowupContext = {
  facts: ReportFacts;
  role: "parent" | "student" | "professional";
  settings: BuSettings;
  /** Absolute URLs (UTM kept). */
  links: { report: string; selfPaced: string; live: string; retake: string };
};

const yt = (id: string): string => `https://youtu.be/${id}`;

function batchLine(s: BuSettings): string | null {
  if (s.nextBatch.date === "") return null;
  const d = new Date(`${s.nextBatch.date}T00:00:00+05:30`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", timeZone: "Asia/Kolkata" },
  );
  return s.nextBatch.seatsLeft !== null
    ? `Next live batch: ${d} (${s.nextBatch.seatsLeft} seats left)`
    : `Next live batch: ${d}`;
}

/**
 * The WhatsApp follow-ups, in order. null = skip this step (e.g. no demo video
 * set yet). Short, warm, real numbers, and STOP always works.
 */
export function followupText(
  step: FollowupStep,
  c: FollowupContext,
): string | null {
  const f = c.facts;
  const name = f.firstName.trim() === "" ? "" : ` ${f.firstName.trim()}`;
  const type = typeName(c.settings, f.brainType, "en");
  const stop = "Reply STOP to stop these messages.";
  const nums = numberLines(f, "en").join("\n");
  switch (step) {
    case "instant": {
      const child =
        f.child === undefined
          ? ""
          : `\n\n${f.child.label}: ${typeName(c.settings, f.child.brainType, "en")} · ${f.child.score}/100\n${numberLines(f.child, "en").join("\n")}`;
      return [
        `Namaste${name} 🙏 आपकी Brain Unlock Report तैयार है!`,
        ``,
        `Brain Type: ${type}`,
        `Brain Unlock Score: ${f.score}/100`,
        nums + child,
        ``,
        `ये सिर्फ़ 4 मिनट थे. You saw the change yourself. In Sharp Brain, this practice happens every day for 30 days, with Dr. Kapil.`,
        ``,
        `Your 30-day plan:`,
        `⚡ ${c.settings.goals.speed.en}`,
        `🧠 ${c.settings.goals.memory.en}`,
        `🎯 ${c.settings.goals.focus.en}`,
        ``,
        `Plans, reviews & FAQ: ${c.links.report}`,
        `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
        `▶ Live batch ₹8,999: ${c.links.live}`,
        ``,
        stop,
      ].join("\n");
    }
    case "h1": {
      if (c.settings.demoVideoId === "") return null;
      return [
        `${f.firstName.trim() || "Hi"}, एक छोटी-सी झलक 👀`,
        `See what a Sharp Brain practice day looks like (2 min):`,
        yt(c.settings.demoVideoId),
        ``,
        stop,
      ].join("\n");
    }
    case "d1": {
      const id = c.settings.reviewVideoIds.parent;
      if (id === "") return null;
      const lead =
        c.role === "parent"
          ? `Ruchi ji’s son studied for hours but couldn’t remember. सुनिए अब क्या बदला ❤️`
          : `A parent, Ruchi ji, on what changed for her son: better focus, better memory, faster reading ❤️`;
      return [
        lead,
        yt(id),
        ``,
        `Your own result yesterday: ${numberLines(f, "en")[1]}`,
        ``,
        stop,
      ].join("\n");
    }
    case "d2": {
      const batch = batchLine(c.settings);
      return [
        `${f.firstName.trim() || "Hi"}, आपका ${type} दिमाग़ तैयार है 💪`,
        `Sharp Brain: 30 days, a few minutes a day, with Dr. Kapil.`,
        ...(batch === null ? [] : [batch]),
        ``,
        `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
        `▶ Live batch ₹8,999 (recommended): ${c.links.live}`,
        ``,
        `Questions? Just reply here.`,
        stop,
      ].join("\n");
    }
    case "d30":
      return [
        `${f.firstName.trim() || "Hi"}, 30 दिन हो गए! 🌱`,
        `Take Brain Unlock again and see how far you’ve come:`,
        c.links.retake,
        ``,
        `Last time: ${f.score}/100 · ${type}`,
        ``,
        stop,
      ].join("\n");
  }
}
