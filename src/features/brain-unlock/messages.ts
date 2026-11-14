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

/** The card numbers, as the report shows them (speed only "after" when it counted). */
function cardLines(f: Omit<ReportFacts, "firstName" | "child">): {
  speed: string;
  memory: string;
  focus: string;
} {
  const after = f.speed.counted ? f.speed.after : f.speed.before;
  return {
    speed: `${f.speed.before} → ${after} WPM`,
    memory: `${f.memory.before}/${MEMORY_TOTAL} → ${f.memory.forward}/${MEMORY_TOTAL}`,
    focus: `${f.focus.before}s → ${f.focus.after}s`,
  };
}

/**
 * "Get my report on WhatsApp": the visitor starts the chat with Dr. Kapil's
 * WhatsApp Business number, everything typed in (founder spec, 14 Nov 2026).
 */
export function reportChatText(
  f: ReportFacts,
  s: BuSettings,
  lang: BuLangCode,
): string {
  const hi = lang === "hi";
  const n = cardLines(f);
  const name = f.firstName.trim();
  const lines = [
    hi
      ? "Namaste Dr. Kapil 🙏 मैंने Brain Unlock challenge पूरा किया!"
      : "Namaste Dr. Kapil 🙏 I completed the Brain Unlock challenge!",
    `${name === "" ? "" : `${hi ? "नाम" : "Name"}: ${name} · `}Brain Type: ${typeName(s, f.brainType, lang)}`,
    `⚡ Speed: ${n.speed}`,
    `🧠 Memory: ${n.memory}`,
    `🎯 Focus: ${n.focus}`,
  ];
  if (f.child !== undefined) {
    const c = cardLines(f.child);
    lines.push(
      `${f.child.label}: ${typeName(s, f.child.brainType, lang)} · ⚡ ${c.speed} · 🧠 ${c.memory} · 🎯 ${c.focus}`,
    );
  }
  lines.push(
    hi ? "मुझे मेरा 30-day plan भेजिए।" : "Please send me my 30-day plan.",
  );
  return lines.join("\n");
}

/** wa.me link with the text typed in. `to`: digits with country code. */
export const waLink = (to: string, text: string): string =>
  `https://wa.me/${to}?text=${encodeURIComponent(text)}`;

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
  /** The lead's language: the message is written in it. */
  lang: BuLangCode;
  /** Absolute URLs (UTM kept). */
  links: { report: string; selfPaced: string; live: string; retake: string };
};

const yt = (id: string): string => `https://youtu.be/${id}`;

function batchLine(s: BuSettings, lang: BuLangCode): string | null {
  if (s.nextBatch.date === "") return null;
  const d = new Date(`${s.nextBatch.date}T00:00:00+05:30`).toLocaleDateString(
    lang === "hi" ? "hi-IN" : "en-IN",
    { day: "numeric", month: "long", timeZone: "Asia/Kolkata" },
  );
  const seats = s.nextBatch.seatsLeft;
  if (lang === "hi")
    return seats !== null
      ? `अगला live batch: ${d} (${seats} seats बाकी)`
      : `अगला live batch: ${d}`;
  return seats !== null
    ? `Next live batch: ${d} (${seats} seats left)`
    : `Next live batch: ${d}`;
}

/**
 * The five WhatsApp follow-ups Dr. Kapil sends himself from /admin/followups
 * (WhatsApp Business app, one tap each). In the lead's language: English with
 * warm Hindi words in Devanagari, or Hindi. Short, warm, real numbers only.
 * null = skip this step (e.g. no demo video set yet).
 */
export function followupText(
  step: FollowupStep,
  c: FollowupContext,
): string | null {
  const f = c.facts;
  const hi = c.lang === "hi";
  const first = f.firstName.trim();
  const name = first === "" ? "" : ` ${first}`;
  const hey = first === "" ? (hi ? "नमस्ते" : "Hi") : first;
  const type = typeName(c.settings, f.brainType, c.lang);
  const nums = numberLines(f, c.lang).join("\n");
  const g = c.settings.goals;
  switch (step) {
    case "instant": {
      const child =
        f.child === undefined
          ? ""
          : `\n\n${f.child.label}: ${typeName(c.settings, f.child.brainType, c.lang)} · ${f.child.score}/100\n${numberLines(f.child, c.lang).join("\n")}`;
      return (
        hi
          ? [
              `नमस्ते${name} 🙏 Brain Unlock पूरा करने के लिए दिल से धन्यवाद!`,
              ``,
              `आपका Brain Type: ${type} · Score ${f.score}/100`,
              nums + child,
              ``,
              `ये सिर्फ़ 4 मिनट थे, और बदलाव आपने खुद देखा। Sharp Brain में यही practice 30 दिन रोज़ होती है, Dr. Kapil के साथ।`,
              ``,
              `आपका 30-दिन का plan:`,
              `⚡ ${g.speed.hi}`,
              `🧠 ${g.memory.hi}`,
              `🎯 ${g.focus.hi}`,
              ``,
              `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
              `▶ Live batch ₹8,999: ${c.links.live}`,
              ``,
              `(ये messages नहीं चाहिए तो STOP लिख दीजिए।)`,
            ]
          : [
              `Namaste${name} 🙏 Brain Unlock पूरा करने के लिए धन्यवाद!`,
              ``,
              `Your Brain Type: ${type} · Score ${f.score}/100`,
              nums + child,
              ``,
              `ये सिर्फ़ 4 मिनट थे, and you saw the change yourself. In Sharp Brain, this practice happens every day for 30 days, with Dr. Kapil.`,
              ``,
              `Your 30-day plan:`,
              `⚡ ${g.speed.en}`,
              `🧠 ${g.memory.en}`,
              `🎯 ${g.focus.en}`,
              ``,
              `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
              `▶ Live batch ₹8,999: ${c.links.live}`,
              ``,
              `(Reply STOP if you’d rather not get these messages.)`,
            ]
      ).join("\n");
    }
    case "h1": {
      if (c.settings.demoVideoId === "") return null;
      return (
        hi
          ? [
              `${hey}, एक छोटी-सी झलक 👀`,
              `देखिए Sharp Brain का एक practice दिन कैसा होता है (2 मिनट):`,
              yt(c.settings.demoVideoId),
            ]
          : [
              `${hey}, एक छोटी-सी झलक 👀`,
              `See what a Sharp Brain practice day looks like (2 min):`,
              yt(c.settings.demoVideoId),
            ]
      ).join("\n");
    }
    case "d1": {
      const id = c.settings.reviewVideoIds.parent;
      if (id === "") return null;
      const memory = numberLines(f, c.lang)[1];
      if (hi)
        return [
          c.role === "parent"
            ? `Ruchi ji का बेटा घंटों पढ़ता था, पर याद नहीं रहता था। सुनिए अब क्या बदला ❤️`
            : `एक माँ, Ruchi ji, बता रही हैं कि उनके बेटे में क्या बदला: बेहतर focus, बेहतर memory, तेज़ reading ❤️`,
          yt(id),
          ``,
          `कल आपका अपना result: ${memory}`,
        ].join("\n");
      return [
        c.role === "parent"
          ? `Ruchi ji’s son studied for hours but couldn’t remember. सुनिए अब क्या बदला ❤️`
          : `A parent, Ruchi ji, on what changed for her son: better focus, better memory, faster reading ❤️`,
        yt(id),
        ``,
        `Your own result yesterday: ${memory}`,
      ].join("\n");
    }
    case "d2": {
      const batch = batchLine(c.settings, c.lang);
      return (
        hi
          ? [
              `${hey}, आपका ${type} दिमाग़ तैयार है 💪`,
              `Sharp Brain: 30 दिन, रोज़ कुछ मिनट, Dr. Kapil के साथ।`,
              ...(batch === null ? [] : [batch]),
              ``,
              `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
              `▶ Live batch ₹8,999 (recommended): ${c.links.live}`,
              ``,
              `कोई सवाल हो तो यहीं पूछिए 🙏`,
            ]
          : [
              `${hey}, आपका ${type} दिमाग़ तैयार है 💪`,
              `Sharp Brain: 30 days, a few minutes a day, with Dr. Kapil.`,
              ...(batch === null ? [] : [batch]),
              ``,
              `▶ Self-paced ₹2,999: ${c.links.selfPaced}`,
              `▶ Live batch ₹8,999 (recommended): ${c.links.live}`,
              ``,
              `Questions? Just reply here 🙏`,
            ]
      ).join("\n");
    }
    case "d30":
      return (
        hi
          ? [
              `${hey}, 30 दिन हो गए! 🌱`,
              `Brain Unlock फिर से कीजिए और देखिए आप कितना आगे आ गए:`,
              c.links.retake,
              ``,
              `पिछली बार: ${f.score}/100 · ${type}`,
            ]
          : [
              `${hey}, 30 दिन हो गए! 🌱`,
              `Take Brain Unlock again and see how far you’ve come:`,
              c.links.retake,
              ``,
              `Last time: ${f.score}/100 · ${type}`,
            ]
      ).join("\n");
  }
}
