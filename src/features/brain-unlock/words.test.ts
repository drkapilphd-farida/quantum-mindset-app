import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_MEMORY_WORDS } from "@/features/memory-check/content";
import {
  RHYME_PEGS,
  SHAPE_PEGS,
  STORY_ITEMS,
} from "@/features/memory-studio/content";
import { NUMBER_PICTURES } from "@/features/memory-studio/numberCode";
import { KEYWORD_CARDS } from "@/features/memory-studio/keyword";
import {
  ALL_BRAIN_UNLOCK_WORDS,
  CHECK_POOL,
  CHECK_SET_IDS,
  CHECK_SETS,
  pickOthers,
  STORY_LINES,
  STORY_POOL,
  STORY_SET_IDS,
  STORY_SETS,
} from "./words";

// Dr. Kapil's demo video words (founder, 14 Nov 2026): never used by Brain Unlock.
const DEMO_VIDEO_WORDS = [
  "कुर्सी",
  "बादल",
  "घड़ी",
  "नदी",
  "किताब",
  "बिल्ली",
  "चाबी",
  "पहाड़",
  "जूता",
  "दीया",
  "कप",
  "पेड़",
  "बस",
  "फूल",
  "तकिया",
  "जंगल",
  "शादी",
  "आम",
  "कैंची",
  "सोने का सिक्का",
  "गला",
  "डॉक्टर",
  "ऊँट",
  "अख़बार",
  "राजा",
  "बंदर",
  "लड़की",
  "पुलिस",
  "टॉर्च",
  "धमाका",
];

type ScriptLine = { id: string; text: string };
const palaceObjectText = (lang: "en" | "hi"): string =>
  (
    JSON.parse(
      fs.readFileSync(`src/features/memory-palace/script/${lang}.json`, "utf8"),
    ) as { lines: ScriptLine[] }
  ).lines
    .filter((l) => l.id.startsWith("object-"))
    .map((l) => l.text.toLowerCase())
    .join(" | ");

const forms = (x: { en: string; hi: string }): string[] => [
  x.en.toLowerCase(),
  x.hi,
];

describe("Brain Unlock words never overlap the app’s memory words or the demo video", () => {
  const app = new Set<string>([
    ...ALL_MEMORY_WORDS.flatMap(forms),
    ...[...STORY_ITEMS, ...RHYME_PEGS, ...SHAPE_PEGS].flatMap(forms),
    ...NUMBER_PICTURES.en.flatMap((p) => p.word.toLowerCase().split(/[\s-]+/)),
    ...NUMBER_PICTURES.hi.flatMap((p) => p.word.split(/[\s-]+/)),
    ...[...KEYWORD_CARDS.en, ...KEYWORD_CARDS.hi].flatMap((c) => [
      c.word.toLowerCase(),
      c.keyword.toLowerCase(),
    ]),
  ]);

  it("no Memory Check, Memory Studio, number-picture or keyword word", () => {
    const clashes = ALL_BRAIN_UNLOCK_WORDS.flatMap(forms).filter(
      (t) => app.has(t) || t.split(/\s+/).some((part) => app.has(part)),
    );
    expect(clashes).toEqual([]);
  });

  it("no Memory Palace object (checked against the palace script itself)", () => {
    const en = palaceObjectText("en");
    const hi = palaceObjectText("hi");
    const clashes = ALL_BRAIN_UNLOCK_WORDS.filter(
      (x) =>
        new RegExp(`\\b${x.en.toLowerCase()}s?\\b`).test(en) ||
        hi.includes(x.hi),
    );
    expect(clashes.map((x) => x.id)).toEqual([]);
  });

  it("none of Dr. Kapil's demo video words", () => {
    const demo = new Set(DEMO_VIDEO_WORDS);
    expect(
      ALL_BRAIN_UNLOCK_WORDS.filter((x) => demo.has(x.hi)).map((x) => x.id),
    ).toEqual([]);
    // English forms of the demo words too.
    for (const en of [
      "chair",
      "cloud",
      "clock",
      "river",
      "book",
      "cat",
      "key",
      "mountain",
      "shoe",
      "lamp",
      "cup",
      "tree",
      "bus",
      "flower",
      "pillow",
      "jungle",
      "wedding",
      "mango",
      "scissors",
      "coin",
      "throat",
      "doctor",
      "camel",
      "newspaper",
      "king",
      "monkey",
      "girl",
      "police",
      "torch",
      "blast",
    ])
      expect(
        ALL_BRAIN_UNLOCK_WORDS.some((x) => x.en.toLowerCase() === en),
        en,
      ).toBe(false);
  });
});

describe("6 + 6 sets, equally easy, never mixed up", () => {
  it("6 Brain Check sets and 6 story sets of 5 words; 15-word pools for the others", () => {
    expect(CHECK_SET_IDS).toHaveLength(6);
    expect(STORY_SET_IDS).toHaveLength(6);
    for (const id of CHECK_SET_IDS) expect(CHECK_SETS[id]).toHaveLength(5);
    for (const id of STORY_SET_IDS) expect(STORY_SETS[id]).toHaveLength(5);
    expect(CHECK_POOL).toHaveLength(15);
    expect(STORY_POOL).toHaveLength(15);
  });
  it("every word appears once only (no set shares a word with another set or a pool)", () => {
    const ids = ALL_BRAIN_UNLOCK_WORDS.map((x) => x.id);
    const hi = ALL_BRAIN_UNLOCK_WORDS.map((x) => x.hi);
    const en = ALL_BRAIN_UNLOCK_WORDS.map((x) => x.en.toLowerCase());
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hi).size).toBe(hi.length);
    expect(new Set(en).size).toBe(en.length);
  });
  it("short, everyday words: at most 2 English words and 12 letters, Hindi in Devanagari", () => {
    for (const x of ALL_BRAIN_UNLOCK_WORDS) {
      expect(x.en.split(" ").length, x.id).toBeLessThanOrEqual(2);
      expect(x.en.replace(/\s/g, "").length, x.id).toBeLessThanOrEqual(12);
      expect(x.hi, x.id).toMatch(/^[ऀ-ॿ\s-]+$/);
    }
  });
  it("every story word has a picture; the pick-screen others are drawn from the pool", () => {
    for (const id of STORY_SET_IDS)
      for (const x of STORY_SETS[id]) expect(x.emoji, x.id).not.toBe("");
    const others = pickOthers(CHECK_POOL, 5, () => 0.3);
    expect(others).toHaveLength(5);
    expect(others.every((x) => CHECK_POOL.includes(x))).toBe(true);
  });
  it("each story has 5 lines, each containing its word, in order, in both languages", () => {
    for (const id of STORY_SET_IDS)
      for (const lang of ["en", "hi"] as const) {
        expect(STORY_LINES[id][lang]).toHaveLength(5);
        STORY_SETS[id].forEach((x, i) => {
          const line = STORY_LINES[id][lang][i]!.toLowerCase();
          expect(
            line.includes(x[lang].toLowerCase()),
            `${id} ${lang} ${x.id}`,
          ).toBe(true);
        });
      }
  });
});
