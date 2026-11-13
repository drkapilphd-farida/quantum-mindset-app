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
  CHECK_WORDS,
  STORY_LINES,
  STORY_WORDS,
} from "./words";

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

describe("Brain Unlock words never overlap the app’s memory words", () => {
  const app = new Set<string>([
    ...ALL_MEMORY_WORDS.flatMap((x) => [x.en, x.hi]),
    ...[...STORY_ITEMS, ...RHYME_PEGS, ...SHAPE_PEGS].flatMap((x) => [
      x.en,
      x.hi,
    ]),
    ...NUMBER_PICTURES.en.flatMap((p) => p.word.toLowerCase().split(/[\s-]+/)),
    ...NUMBER_PICTURES.hi.flatMap((p) => p.word.split(/[\s-]+/)),
    ...[...KEYWORD_CARDS.en, ...KEYWORD_CARDS.hi].flatMap((c) => [
      c.word.toLowerCase(),
      c.keyword.toLowerCase(),
    ]),
  ]);

  it("no Memory Check, Memory Studio, number-picture or keyword word", () => {
    const clashes = ALL_BRAIN_UNLOCK_WORDS.flatMap((x) => [
      x.en.toLowerCase(),
      x.hi,
    ]).filter(
      (t) => t.split(/\s+/).some((part) => app.has(part)) || app.has(t),
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

  it("the spec’s original words (memory-check / palace words) are not used", () => {
    const ids = new Set(ALL_BRAIN_UNLOCK_WORDS.map((x) => x.id));
    for (const old of [
      "ring",
      "train",
      "lion",
      "soap",
      "elephant",
      "umbrella",
      "milk",
      "kite",
      "phone",
      "chair",
      "river",
      "key",
      "bus",
      "mango",
      "camel",
      "flower",
      "shoe",
      "monkey",
    ])
      expect(ids.has(old), old).toBe(false);
  });
});

describe('"after" content is always different from "before"', () => {
  it("the story words share nothing with the Brain Check words, in both sets and both languages", () => {
    for (const s of ["A", "B"] as const) {
      const before = new Set(
        [...CHECK_WORDS[s].targets, ...CHECK_WORDS[s].others].flatMap((x) => [
          x.id,
          x.en,
          x.hi,
        ]),
      );
      const after = STORY_WORDS[s].targets.flatMap((x) => [x.id, x.en, x.hi]);
      expect(after.filter((t) => before.has(t))).toEqual([]);
    }
  });
  it("Duo Mode: the child’s set (B) shares no word with the parent’s set (A)", () => {
    const a = new Set(
      [
        ...CHECK_WORDS.A.targets,
        ...CHECK_WORDS.A.others,
        ...STORY_WORDS.A.targets,
        ...STORY_WORDS.A.others,
      ].map((x) => x.id),
    );
    const b = [
      ...CHECK_WORDS.B.targets,
      ...CHECK_WORDS.B.others,
      ...STORY_WORDS.B.targets,
      ...STORY_WORDS.B.others,
    ].map((x) => x.id);
    expect(b.filter((id) => a.has(id))).toEqual([]);
  });
  it("each set has 5 targets + 5 others, all different; Hindi is Devanagari", () => {
    for (const list of [
      CHECK_WORDS.A,
      CHECK_WORDS.B,
      STORY_WORDS.A,
      STORY_WORDS.B,
    ]) {
      expect(list.targets).toHaveLength(5);
      expect(list.others).toHaveLength(5);
      const all = [...list.targets, ...list.others];
      expect(new Set(all.map((x) => x.hi)).size).toBe(10);
      for (const x of all) expect(x.hi).toMatch(/[ऀ-ॿ]/);
    }
  });
  it("each story line contains its word, in order, in both languages", () => {
    for (const s of ["A", "B"] as const)
      for (const lang of ["en", "hi"] as const)
        STORY_WORDS[s].targets.forEach((x, i) => {
          const line = STORY_LINES[s][lang][i]!.toLowerCase();
          expect(
            line.includes(x[lang].toLowerCase()) || line.includes(x.id),
            `${s} ${lang} ${x.id}`,
          ).toBe(true);
        });
  });
});
