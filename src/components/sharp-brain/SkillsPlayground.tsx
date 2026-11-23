"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, Eye, RefreshCw, Smartphone, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// "Five skills, trained every day" (owner, 23 Nov 2026: less theory, more
// doing). Five coloured tabs; each opens a 10-second mini-exercise and three
// short lines — the problem, what we train, the result.

type Lang = "en" | "hi";
type Bi = { en: string; hi: string };
type SkillId = "focus" | "reading" | "memory" | "retention" | "phone";

const SKILLS: { id: SkillId; icon: LucideIcon; color: string; soft: string; name: Bi; problem: Bi; train: Bi; result: Bi }[] = [
  { id: "focus", icon: Eye, color: "#2b57e8", soft: "#e8eeff", name: { en: "Focus", hi: "फ़ोकस" }, problem: { en: "Attention jumps every few minutes", hi: "ध्यान हर कुछ मिनट में भटकता है" }, train: { en: "Short daily attention drills", hi: "रोज़ छोटे अटेंशन ड्रिल" }, result: { en: "You stay with one task longer", hi: "एक काम पर देर तक टिकते हैं" } },
  { id: "reading", icon: BookOpen, color: "#0b9488", soft: "#e2f6f3", name: { en: "Smart Reading", hi: "स्मार्ट रीडिंग" }, problem: { en: "Word-by-word reading, re-reading lines", hi: "शब्द-शब्द पढ़ना, लाइन दोबारा पढ़ना" }, train: { en: "RSVP speed reading, inner-voice control", hi: "RSVP स्पीड रीडिंग, अंदर की आवाज़ पर कंट्रोल" }, result: { en: "Faster — and you still understand", hi: "तेज़ — और समझ भी पूरी" } },
  { id: "memory", icon: Brain, color: "#7c3aed", soft: "#f1eafe", name: { en: "Memory", hi: "याददाश्त" }, problem: { en: "You read it, but it doesn’t stay", hi: "पढ़ा, पर याद नहीं रहा" }, train: { en: "Pictures, stories, memory palace", hi: "चित्र, कहानी, मेमोरी पैलेस" }, result: { en: "What you study stays", hi: "जो पढ़ते हैं, याद रहता है" } },
  { id: "retention", icon: RefreshCw, color: "#ea7a12", soft: "#fff1e3", name: { en: "Retention", hi: "रिटेंशन" }, problem: { en: "Forgotten in a few days", hi: "कुछ दिन में भूल जाते हैं" }, train: { en: "Active recall + spaced revision", hi: "एक्टिव रिकॉल + सही समय पर रिवीज़न" }, result: { en: "You remember it in the exam", hi: "परीक्षा में याद रहता है" } },
  { id: "phone", icon: Smartphone, color: "#16a34a", soft: "#e5f7eb", name: { en: "Phone Discipline", hi: "फ़ोन डिसिप्लिन" }, problem: { en: "Notifications break your study", hi: "नोटिफ़िकेशन पढ़ाई तोड़ देते हैं" }, train: { en: "Focus sessions, phone-away habit", hi: "फ़ोकस सेशन, फ़ोन दूर रखने की आदत" }, result: { en: "Longer, calmer study blocks", hi: "लंबी, शांत पढ़ाई" } },
];

const T = {
  eyebrow: { en: "Five skills · try them now", hi: "पाँच skills · अभी आज़माइए" },
  title: { en: "Five skills, trained every day", hi: "पाँच skills, रोज़ का अभ्यास" },
  sub: { en: "Tap a skill and try it for 10 seconds — this is how the app trains you.", hi: "किसी skill पर टैप कीजिए और 10 सेकंड आज़माइए — ऐप ऐसे ही अभ्यास कराता है।" },
  problem: { en: "The problem", hi: "दिक्कत" },
  train: { en: "We train", hi: "हम सिखाते हैं" },
  result: { en: "Result", hi: "नतीजा" },
  again: { en: "Try again", hi: "फिर से" },
} satisfies Record<string, Bi>;

const say = (b: Bi, lang: Lang): string => b[lang];

// ── Focus: tap the colour of the ink, not the word (Stroop) ──
const COLORS = [
  { id: "red", hex: "#e11d48", name: { en: "RED", hi: "लाल" } },
  { id: "blue", hex: "#2563eb", name: { en: "BLUE", hi: "नीला" } },
  { id: "green", hex: "#16a34a", name: { en: "GREEN", hi: "हरा" } },
  { id: "yellow", hex: "#d97706", name: { en: "YELLOW", hi: "पीला" } },
];
function pickStroop(seed: number): { word: number; ink: number } {
  const word = seed % 4;
  const ink = (word + 1 + (seed % 3)) % 4;
  return { word, ink };
}
function FocusGame({ lang }: { lang: Lang }): React.JSX.Element {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const total = 5;
  const { word, ink } = pickStroop(round * 7 + 3);
  const done = round >= total;
  function answer(i: number): void {
    const ok = i === ink;
    setFlash(ok ? "ok" : "no");
    if (ok) setScore((s) => s + 1);
    window.setTimeout(() => setFlash(null), 250);
    setRound((r) => r + 1);
  }
  if (done) {
    return (
      <GameDone lang={lang} onAgain={() => { setRound(0); setScore(0); }}>
        {lang === "hi" ? `${total} में से ${score} सही! यही ध्यान रोज़ 2 मिनट ट्रेन होता है।` : `${score} of ${total} right! This is the attention we train, 2 minutes a day.`}
      </GameDone>
    );
  }
  const w = COLORS[word] ?? COLORS[0]!;
  const k = COLORS[ink] ?? COLORS[1]!;
  return (
    <div className="text-center">
      <p className="text-[14px] font-semibold text-ink-dim">{lang === "hi" ? "शब्द नहीं — उसका रंग चुनिए" : "Tap the colour of the ink — not the word"}</p>
      <p className={`my-5 text-[44px] font-black tracking-wide transition-transform sm:text-[56px] ${flash === "ok" ? "scale-110" : flash === "no" ? "-rotate-2" : ""}`} style={{ color: k.hex }} aria-live="polite">
        {say(w.name, lang)}
      </p>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2.5">
        {COLORS.map((c, i) => (
          <button key={c.id} type="button" onClick={() => answer(i)} className="min-h-12 rounded-lg text-[15px] font-bold text-white shadow-sm transition-transform active:scale-95" style={{ background: c.hex }}>
            {say(c.name, lang)}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[12.5px] text-ink-faint">{round + 1} / {total}</p>
    </div>
  );
}

// ── Smart Reading: RSVP speed reader (owner: "ekdam playable") ──
// One word at a time at the speed you choose, the focus letter in colour,
// then one question to check you understood.
const PASSAGE: Bi = {
  en: "Your brain can read much faster than your eyes usually move. When words come one by one to the same spot, your eyes stop jumping and the inner voice gets quieter. Students who practise for a few minutes a day often double their speed in thirty days, and they still understand what they read.",
  hi: "आपका दिमाग़ आँखों की आम रफ़्तार से कहीं तेज़ पढ़ सकता है। जब शब्द एक-एक करके एक ही जगह आते हैं, तो आँखें इधर-उधर कूदना बंद कर देती हैं और अंदर की आवाज़ धीमी हो जाती है। जो विद्यार्थी रोज़ कुछ मिनट अभ्यास करते हैं, वे अक्सर तीस दिन में अपनी रफ़्तार दोगुनी कर लेते हैं, और समझ भी बनी रहती है।",
};
const QUESTION: { q: Bi; options: Bi[]; answer: number } = {
  q: { en: "In how many days can practice often double your speed?", hi: "अभ्यास से कितने दिन में रफ़्तार अक्सर दोगुनी हो जाती है?" },
  options: [{ en: "7 days", hi: "7 दिन" }, { en: "30 days", hi: "30 दिन" }, { en: "1 year", hi: "1 साल" }],
  answer: 1,
};
const SPEEDS = [150, 250, 350, 450, 600];

/** The "optimal recognition point": the letter the eye should rest on. */
function orpIndex(word: string): number {
  const n = [...word].length;
  if (n <= 1) return 0;
  if (n <= 5) return 1;
  if (n <= 9) return 2;
  return 3;
}

function RsvpWord({ word, color }: { word: string; color: string }): React.JSX.Element {
  const chars = [...word];
  const i = orpIndex(word);
  return (
    <span className="grid w-full grid-cols-[1fr_auto_1fr] items-baseline font-extrabold text-ink">
      <span className="text-right">{chars.slice(0, i).join("")}</span>
      <span style={{ color }}>{chars[i] ?? ""}</span>
      <span className="text-left">{chars.slice(i + 1).join("")}</span>
    </span>
  );
}

function ReadingGame({ lang }: { lang: Lang }): React.JSX.Element {
  const words = useMemo(() => say(PASSAGE, lang).split(/\s+/), [lang]);
  const [wpm, setWpm] = useState(250);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"ready" | "reading" | "paused" | "question" | "done">("ready");
  const [chosen, setChosen] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (phase !== "reading") return;
    if (i >= words.length) {
      setElapsedMs((e) => e + (Date.now() - startedAt));
      setPhase("question");
      return;
    }
    const w = words[i] ?? "";
    // A little longer on long words and at the end of a sentence.
    const base = 60000 / wpm;
    const extra = (/[.,।]$/.test(w) ? 1.6 : 1) * ([...w].length > 8 ? 1.2 : 1);
    const t = window.setTimeout(() => setI((x) => x + 1), base * extra);
    return () => window.clearTimeout(t);
  }, [phase, i, wpm, words, startedAt]);

  function play(): void {
    if (phase === "ready" || phase === "done") { setI(0); setElapsedMs(0); setChosen(null); }
    setStartedAt(Date.now());
    setPhase("reading");
  }
  function pause(): void {
    setElapsedMs((e) => e + (Date.now() - startedAt));
    setPhase("paused");
  }
  function answer(n: number): void {
    setChosen(n);
    window.setTimeout(() => setPhase("done"), 700);
  }

  const progress = Math.min(100, Math.round((i / words.length) * 100));
  const realWpm = elapsedMs > 0 ? Math.round(words.length / (elapsedMs / 60000)) : wpm;
  const correct = chosen === QUESTION.answer;

  if (phase === "done") {
    return (
      <GameDone lang={lang} onAgain={() => { setPhase("ready"); setI(0); setChosen(null); setWpm((w) => Math.min(600, w + 100)); }}>
        {lang === "hi"
          ? `आपने ${realWpm} शब्द प्रति मिनट पर पढ़ा${correct ? " — और सवाल भी सही! 🎯" : ", पर सवाल ग़लत हुआ। थोड़ी धीमी रफ़्तार पर फिर आज़माइए।"} आम पाठक ~200 पर पढ़ते हैं। “फिर से” दबाइए — अगली बार रफ़्तार थोड़ी बढ़ेगी।`
          : `You read at ${realWpm} words per minute${correct ? " — and got the question right! 🎯" : ", but missed the question. Try a little slower."} Most people read at ~200. Tap “Try again” — the next round is a little faster.`}
      </GameDone>
    );
  }

  if (phase === "question") {
    return (
      <div className="text-center">
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-teal">{lang === "hi" ? "समझ की जाँच" : "Quick check"}</p>
        <p className="mt-2 text-[18px] font-extrabold text-ink">{say(QUESTION.q, lang)}</p>
        <div className="mx-auto mt-4 grid max-w-sm gap-2.5">
          {QUESTION.options.map((o, n) => (
            <button
              key={o.en}
              type="button"
              disabled={chosen !== null}
              onClick={() => answer(n)}
              className={`min-h-12 rounded-lg border-2 px-4 text-[15.5px] font-bold transition-colors ${chosen === null ? "border-teal/40 bg-white text-ink hover:border-teal" : n === QUESTION.answer ? "border-[#16a34a] bg-[#dcfce7] text-[#14532d]" : n === chosen ? "border-[#e11d48] bg-[#ffe4e6] text-[#881337]" : "border-line bg-white text-ink-faint"}`}
            >
              {say(o, lang)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl bg-white px-4 pb-3 pt-6 shadow-inner ring-1 ring-teal/25">
        {/* Focus guides above and below the focus letter. */}
        <span className="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 bg-teal/60" aria-hidden="true" />
        <span className="absolute bottom-6 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-teal/60" aria-hidden="true" />
        <div className="flex h-20 items-center text-[34px] sm:text-[40px]" aria-live="off">
          {phase === "ready" ? (
            <span className="w-full text-[17px] font-semibold text-ink-dim">{lang === "hi" ? "गति चुनिए और ▶ दबाइए — आँखें बीच के रंगीन अक्षर पर रखिए" : "Pick a speed and press ▶ — keep your eyes on the coloured letter"}</span>
          ) : (
            <RsvpWord word={words[Math.min(i, words.length - 1)] ?? ""} color="#e11d48" />
          )}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-teal/15">
          <div className="h-full rounded-full bg-gradient-to-r from-[#2b57e8] to-[#11a197] transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-1.5" role="radiogroup" aria-label={lang === "hi" ? "पढ़ने की गति" : "Reading speed"}>
        {SPEEDS.map((sp) => (
          <button
            key={sp}
            type="button"
            role="radio"
            aria-checked={wpm === sp}
            onClick={() => setWpm(sp)}
            className={`min-h-10 rounded-full px-3 text-[13.5px] font-bold transition-colors ${wpm === sp ? "bg-teal text-white" : "bg-white text-ink ring-1 ring-teal/30 hover:ring-teal"}`}
          >
            {sp}
          </button>
        ))}
        <span className="ml-1 text-[12px] font-semibold text-ink-faint">{lang === "hi" ? "शब्द/मिनट" : "wpm"}</span>
      </div>

      <div className="mt-4 flex justify-center gap-2.5">
        {phase === "reading" ? (
          <button type="button" onClick={pause} className="min-h-12 rounded-lg bg-ink px-6 text-[15px] font-bold text-white">❚❚ {lang === "hi" ? "रोकें" : "Pause"}</button>
        ) : (
          <button type="button" onClick={play} className="min-h-12 rounded-lg bg-teal px-7 text-[15px] font-bold text-white shadow-[0_10px_22px_-12px_rgba(11,148,136,0.9)]">
            ▶ {phase === "paused" ? (lang === "hi" ? "जारी रखें" : "Resume") : (lang === "hi" ? "पढ़ना शुरू करें" : "Start reading")}
          </button>
        )}
        {phase !== "ready" && (
          <button type="button" onClick={() => { setPhase("ready"); setI(0); setElapsedMs(0); }} className="min-h-12 rounded-lg border-2 border-ink/15 bg-white px-4 text-[15px] font-bold text-ink">↺</button>
        )}
      </div>
    </div>
  );
}

// ── Memory: look for 4 seconds, then pick what you saw ──
const ITEMS = ["🐘", "🚲", "🍌", "⏰", "📕", "🎸", "🌵", "🚀"];
const SHOWN = ["🐘", "🚲", "🍌", "⏰"];
function MemoryGame({ lang }: { lang: Lang }): React.JSX.Element {
  const [phase, setPhase] = useState<"ready" | "look" | "pick" | "done">("ready");
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => {
    if (phase !== "look") return;
    const t = window.setTimeout(() => setPhase("pick"), 4000);
    return () => window.clearTimeout(t);
  }, [phase]);
  const toggle = useCallback((e: string) => {
    setPicked((p) => {
      const next = p.includes(e) ? p.filter((x) => x !== e) : [...p, e];
      if (next.length === 4) window.setTimeout(() => setPhase("done"), 300);
      return next;
    });
  }, []);
  const right = picked.filter((p) => SHOWN.includes(p)).length;
  if (phase === "done") {
    return (
      <GameDone lang={lang} onAgain={() => { setPicked([]); setPhase("ready"); }}>
        {lang === "hi" ? `4 में से ${right} सही। ट्रिक: “हाथी साइकिल पर केला खाते हुए घड़ी देख रहा है” — कहानी बनाइए, सब याद रहेगा।` : `${right} of 4 right. The trick: “an elephant on a bicycle, eating a banana, checks the clock” — make a story and it all stays.`}
      </GameDone>
    );
  }
  return (
    <div className="text-center">
      <p className="text-[14px] font-semibold text-ink-dim">
        {phase === "ready" ? (lang === "hi" ? "4 चीज़ें 4 सेकंड के लिए दिखेंगी" : "4 things will show for 4 seconds") : phase === "look" ? (lang === "hi" ? "ध्यान से देखिए…" : "Look carefully…") : (lang === "hi" ? "कौन-सी 4 थीं? चुनिए" : "Which 4 were there? Pick them")}
      </p>
      {phase === "ready" && (
        <button type="button" onClick={() => setPhase("look")} className="mt-6 min-h-12 rounded-lg bg-[#7c3aed] px-6 text-[15px] font-bold text-white">{lang === "hi" ? "शुरू करें" : "Start"}</button>
      )}
      {phase === "look" && <p className="my-6 text-[54px] tracking-[0.2em]">{SHOWN.join("")}</p>}
      {phase === "pick" && (
        <div className="mx-auto mt-5 grid max-w-xs grid-cols-4 gap-2.5">
          {ITEMS.map((e) => (
            <button key={e} type="button" onClick={() => toggle(e)} className={`aspect-square rounded-lg border-2 text-[30px] transition-transform active:scale-95 ${picked.includes(e) ? "border-[#7c3aed] bg-[#f1eafe]" : "border-line-strong bg-white"}`} aria-pressed={picked.includes(e)}>
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Retention: the forgetting curve, with and without revision ──
function RetentionVisual({ lang }: { lang: Lang }): React.JSX.Element {
  const [revise, setRevise] = useState(false);
  const without = [100, 58, 44, 33, 25, 21];
  const withRev = [100, 92, 88, 90, 87, 89];
  const data = revise ? withRev : without;
  const days = lang === "hi" ? ["आज", "1 दिन", "2", "7", "15", "30"] : ["Today", "Day 1", "2", "7", "15", "30"];
  return (
    <div className="text-center">
      <div className="mx-auto flex h-36 max-w-md items-end justify-between gap-2 rounded-xl bg-white px-4 pb-2 pt-4">
        {data.map((v, i) => (
          <div key={days[i]} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[11.5px] font-bold text-ink">{v}%</span>
            <div className="w-full rounded-t-md transition-all duration-700" style={{ height: `${v * 0.95}px`, background: revise ? "#16a34a" : "#ea7a12" }} />
            <span className="text-[10.5px] text-ink-faint">{days[i]}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setRevise((r) => !r)} className="mt-4 min-h-11 rounded-lg px-5 text-[14.5px] font-bold text-white" style={{ background: revise ? "#ea7a12" : "#16a34a" }}>
        {revise ? (lang === "hi" ? "बिना रिवीज़न देखें" : "Show without revision") : (lang === "hi" ? "सही रिवीज़न के साथ देखें ✨" : "Show with smart revision ✨")}
      </button>
      <p className="mt-2 text-[12px] text-ink-faint">{lang === "hi" ? "सांकेतिक चित्र — सीखने के बाद याद कितना रहता है" : "Illustration — how much stays after learning"}</p>
    </div>
  );
}

// ── Phone discipline: a 25-minute focus block ──
function PhoneVisual({ lang }: { lang: Lang }): React.JSX.Element {
  const [on, setOn] = useState(false);
  return (
    <div className="text-center">
      <div className="mx-auto flex max-w-md items-center justify-center gap-6">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={on ? 0 : 100} style={{ transition: "stroke-dashoffset 3s ease-out" }} />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[26px] font-black text-ink">25</span>
            <span className="text-[11px] text-ink-dim">{lang === "hi" ? "मिनट" : "min"}</span>
          </span>
        </div>
        <div className={`flex h-32 w-20 items-center justify-center rounded-2xl border-4 text-[28px] transition-all duration-700 ${on ? "border-ink/20 bg-ink/80 opacity-60" : "border-ink bg-white"}`} aria-hidden="true">
          {on ? "🔕" : "🔔"}
        </div>
      </div>
      <button type="button" onClick={() => setOn((o) => !o)} className="mt-4 min-h-11 rounded-lg bg-[#16a34a] px-5 text-[14.5px] font-bold text-white">
        {on ? (lang === "hi" ? "फिर से" : "Reset") : (lang === "hi" ? "फ़ोकस सेशन शुरू करें" : "Start a focus session")}
      </button>
      {on && <p className="mt-2 text-[13px] font-semibold text-[#15803d]">{lang === "hi" ? "फ़ोन दूर, ध्यान पूरा — फिर 5 मिनट ब्रेक।" : "Phone away, full attention — then a 5-minute break."}</p>}
    </div>
  );
}

function GameDone({ lang, onAgain, children }: { lang: Lang; onAgain: () => void; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <span className="text-[44px]" aria-hidden="true">🎉</span>
      <p className="max-w-md text-[16.5px] font-semibold leading-relaxed text-ink">{children}</p>
      <button type="button" onClick={onAgain} className="min-h-11 rounded-lg border-2 border-ink/15 bg-white px-5 text-[14.5px] font-bold text-ink">{say(T.again, lang)}</button>
    </div>
  );
}

export function SkillsPlayground(): React.JSX.Element {
  const { lang } = useLanguage();
  const [active, setActive] = useState<SkillId>("focus");
  const skill = SKILLS.find((s) => s.id === active) ?? SKILLS[0]!;
  return (
    <section id="skills" className="border-b border-line bg-gradient-to-b from-[#eef3ff] to-[#e9f8f4] px-4 py-16 sm:px-8 sm:py-20" data-skills-playground>
      <div className="mx-auto max-w-content">
        <p className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#2b57e8]">{say(T.eyebrow, lang)}</p>
        <h2 className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[38px]">{say(T.title, lang)}</h2>
        <p className="mt-2 text-[16.5px] text-ink-dim">{say(T.sub, lang)}</p>

        <div className="mt-8 flex gap-2.5 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible" role="tablist">
          {SKILLS.map((s) => {
            const Icon = s.icon;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(s.id)}
                className={`flex min-w-[132px] flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all ${on ? "-translate-y-1 text-white shadow-lg" : "bg-white text-ink hover:-translate-y-0.5"}`}
                style={on ? { background: s.color, borderColor: s.color, boxShadow: `0 12px 28px -12px ${s.color}` } : { borderColor: `${s.color}33` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: on ? "rgba(255,255,255,0.2)" : s.soft, color: on ? "#fff" : s.color }}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span className="text-[15px] font-extrabold leading-tight">{say(s.name, lang)}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 rounded-3xl border-2 bg-white/80 p-5 shadow-[0_24px_50px_-28px_rgba(19,32,59,0.35)] backdrop-blur sm:p-8 lg:grid-cols-[1.2fr_0.8fr]" style={{ borderColor: `${skill.color}40` }} role="tabpanel">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: skill.soft }}>
            {active === "focus" && <FocusGame key="focus" lang={lang} />}
            {active === "reading" && <ReadingGame key="reading" lang={lang} />}
            {active === "memory" && <MemoryGame key="memory" lang={lang} />}
            {active === "retention" && <RetentionVisual key="retention" lang={lang} />}
            {active === "phone" && <PhoneVisual key="phone" lang={lang} />}
          </div>
          <ul className="flex flex-col justify-center gap-4">
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#fde8ec] text-[17px]" aria-hidden="true">✗</span>
              <span><span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[#be123c]">{say(T.problem, lang)}</span><span className="text-[17px] font-semibold text-ink">{say(skill.problem, lang)}</span></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[17px]" style={{ background: skill.soft }} aria-hidden="true">⚡</span>
              <span><span className="block text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: skill.color }}>{say(T.train, lang)}</span><span className="text-[17px] font-semibold text-ink">{say(skill.train, lang)}</span></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#dcfce7] text-[17px]" aria-hidden="true">✓</span>
              <span><span className="block text-[12px] font-bold uppercase tracking-[0.06em] text-[#15803d]">{say(T.result, lang)}</span><span className="text-[18px] font-extrabold text-ink">{say(skill.result, lang)}</span></span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
