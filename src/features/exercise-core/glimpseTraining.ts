// "Glimpse" drills — the four focus warm-ups that used to be watch-only
// (Rapid Visual Span, Peripheral Flash, Multi-Word Flash, Blink Recall) now
// end every glimpse with "What did you see? Pick 1 of 4", on the shared
// 10-level trainer. Level 1 shows things for 1.5 s (0.9 s for a single word)
// so a beginner always sees them; higher levels show more, further out, for
// less time. Each glimpse appears once — nothing flickers or repeats.

import { READING_PASSAGES, type PassageLang } from './readingPassages'

export type GlimpseMode = 'span' | 'peripheral' | 'phrase' | 'blink'

export type Rng = () => number

const pickIndex = (n: number, rng: Rng): number => Math.floor(rng() * n)

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values]
  for (let i = out.length - 1; i > 0; i--) {
    const j = pickIndex(i + 1, rng)
    const a = out[i] as T
    out[i] = out[j] as T
    out[j] = a
  }
  return out
}

const at = <T>(list: readonly T[], level: number): T => list[Math.min(10, Math.max(1, Math.round(level))) - 1] ?? list[0]!

// ---- Level tables (index 0 = level 1) ----
const SPAN_ITEMS = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
const SPAN_FLASH_MS = [1500, 1100, 1100, 800, 800, 600, 600, 450, 450, 350]
const SPAN_RADIUS = [0.22, 0.26, 0.26, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.42]
const PERIPHERAL_FLASH_MS = [1500, 1100, 900, 750, 600, 600, 500, 420, 350, 300]
const PERIPHERAL_DISTANCE = [0.3, 0.33, 0.36, 0.39, 0.42, 0.36, 0.39, 0.42, 0.44, 0.46]
const PHRASE_WORDS = [1, 2, 2, 3, 3, 4, 4, 5, 5, 5]
const PHRASE_FLASH_MS = [1500, 1500, 1100, 1100, 900, 900, 750, 700, 600, 500]
const BLINK_FLASH_MS = [900, 700, 550, 450, 350, 300, 250, 200, 170, 150]
const BLINK_MIN_LETTERS = [3, 4, 4, 5, 5, 6, 6, 7, 7, 8]

export function flashMs(mode: GlimpseMode, level: number): number {
  if (mode === 'span') return at(SPAN_FLASH_MS, level)
  if (mode === 'peripheral') return at(PERIPHERAL_FLASH_MS, level)
  if (mode === 'phrase') return at(PHRASE_FLASH_MS, level)
  return at(BLINK_FLASH_MS, level)
}

export const TRIALS_PER_ROUND = 5
export const PRACTICE_TRIALS = 3
export const ROUNDS_PER_SESSION = 3

// Language-free symbols: shape + colour, told apart at a glance.
export type GlimpseSymbol = { id: string; char: string; color: string }
export const SYMBOLS: readonly GlimpseSymbol[] = [
  { id: 'circle', char: '●', color: '#ef4444' },
  { id: 'triangle', char: '▲', color: '#3b82f6' },
  { id: 'square', char: '■', color: '#22c55e' },
  { id: 'star', char: '★', color: '#eab308' },
  { id: 'diamond', char: '◆', color: '#a855f7' },
  { id: 'heart', char: '♥', color: '#ec4899' },
  { id: 'moon', char: '☾', color: '#0ea5e9' },
  { id: 'plus', char: '✚', color: '#f97316' },
  { id: 'ring', char: '◯', color: '#14b8a6' },
  { id: 'spade', char: '♠', color: '#64748b' },
]

/** Something placed on the glimpse stage: x/y are fractions of the stage, 0.5 = centre. */
export type Placed = { label: string; symbol?: GlimpseSymbol; x: number; y: number }

export type GlimpseTrial = {
  mode: GlimpseMode
  shown: readonly Placed[]
  flashMs: number
  /** The question, as a key the UI translates (with an optional side). */
  question: 'whichSeen' | 'whichOnSide' | 'whichPhrase' | 'whichWord'
  side?: 'left' | 'right' | 'top' | 'bottom'
  options: readonly string[]
  /** For symbol modes, options are symbol ids. */
  optionSymbols?: readonly GlimpseSymbol[]
  correctIndex: number
}

function symbolOptions(correct: GlimpseSymbol, exclude: readonly GlimpseSymbol[], rng: Rng): GlimpseSymbol[] {
  const pool = SYMBOLS.filter((s) => s.id !== correct.id && !exclude.some((e) => e.id === s.id))
  return shuffled([correct, ...shuffled(pool, rng).slice(0, 3)], rng)
}

function buildSpan(level: number, rng: Rng): GlimpseTrial {
  const n = at(SPAN_ITEMS, level)
  const radius = at(SPAN_RADIUS, level)
  const symbols = shuffled(SYMBOLS, rng).slice(0, n)
  const start = rng() * Math.PI * 2
  const shown = symbols.map((symbol, i) => {
    const a = start + (i * Math.PI * 2) / n
    return { label: symbol.id, symbol, x: 0.5 + Math.cos(a) * radius, y: 0.5 + Math.sin(a) * radius }
  })
  const answer = symbols[pickIndex(n, rng)]!
  const opts = symbolOptions(answer, symbols, rng)
  return { mode: 'span', shown, flashMs: flashMs('span', level), question: 'whichSeen', options: opts.map((o) => o.id), optionSymbols: opts, correctIndex: opts.indexOf(answer) }
}

const SIDES = [
  { side: 'left', x: -1, y: 0 },
  { side: 'right', x: 1, y: 0 },
  { side: 'top', x: 0, y: -1 },
  { side: 'bottom', x: 0, y: 1 },
] as const

function buildPeripheral(level: number, rng: Rng): GlimpseTrial {
  const d = at(PERIPHERAL_DISTANCE, level)
  const two = level >= 6
  const first = SIDES[pickIndex(4, rng)]!
  const opposite = SIDES.find((s) => s.x === -first.x && s.y === -first.y)!
  const [s1, s2] = shuffled(SYMBOLS, rng)
  const shown: Placed[] = [{ label: s1!.id, symbol: s1!, x: 0.5 + first.x * d, y: 0.5 + first.y * d }]
  if (two) shown.push({ label: s2!.id, symbol: s2!, x: 0.5 + opposite.x * d, y: 0.5 + opposite.y * d })
  const opts = symbolOptions(s1!, two ? [s2!] : [], rng)
  // From level 6, the other glimpsed symbol is a tempting wrong option.
  if (two && !opts.some((o) => o.id === s2!.id)) opts[opts.findIndex((o) => o.id !== s1!.id)] = s2!
  return {
    mode: 'peripheral',
    shown,
    flashMs: flashMs('peripheral', level),
    question: two ? 'whichOnSide' : 'whichSeen',
    ...(two ? { side: first.side } : {}),
    options: opts.map((o) => o.id),
    optionSymbols: opts,
    correctIndex: opts.findIndex((o) => o.id === s1!.id),
  }
}

const clean = (w: string): string => w.replace(/[“”"'‘’(),.!?।:;—-]+/g, '')

const wordsCache = new Map<PassageLang, string[][]>()
function passageWords(lang: PassageLang): string[][] {
  let words = wordsCache.get(lang)
  if (words === undefined) {
    words = READING_PASSAGES[lang].map((p) => p.text.split(/\s+/).map(clean).filter((w) => w.length > 0))
    wordsCache.set(lang, words)
  }
  return words
}

const vocabularyCache = new Map<PassageLang, string[]>()
function vocabularyOf(lang: PassageLang): string[] {
  let v = vocabularyCache.get(lang)
  if (v === undefined) {
    v = [...new Set(passageWords(lang).flat())]
    vocabularyCache.set(lang, v)
  }
  return v
}

const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null
const graphemeCache = new Map<string, number>()
function graphemes(word: string): number {
  let n = graphemeCache.get(word)
  if (n === undefined) {
    n = segmenter ? [...segmenter.segment(word)].length : word.length
    graphemeCache.set(word, n)
  }
  return n
}

function buildPhrase(level: number, lang: PassageLang, rng: Rng): GlimpseTrial {
  const n = at(PHRASE_WORDS, level)
  const passages = passageWords(lang)
  const words = passages[pickIndex(passages.length, rng)]!
  const startAt = pickIndex(Math.max(1, words.length - n), rng)
  const phrase = words.slice(startAt, startAt + n)
  const vocabulary = vocabularyOf(lang).filter((w) => !phrase.includes(w))
  const variants = new Set<string>([phrase.join(' ')])
  let guard = 0
  while (variants.size < 4 && guard++ < 50) {
    const swapAt = pickIndex(phrase.length, rng)
    const target = phrase[swapAt]!
    // Prefer a replacement of similar length so the variant looks alike.
    const similar = vocabulary.filter((w) => Math.abs(graphemes(w) - graphemes(target)) <= 1)
    const pool = similar.length > 5 ? similar : vocabulary
    const replacement = pool[pickIndex(pool.length, rng)]!
    variants.add(phrase.map((w, i) => (i === swapAt ? replacement : w)).join(' '))
  }
  const correct = phrase.join(' ')
  const options = shuffled([...variants].slice(0, 4), rng)
  return { mode: 'phrase', shown: [{ label: correct, x: 0.5, y: 0.5 }], flashMs: flashMs('phrase', level), question: 'whichPhrase', options, correctIndex: options.indexOf(correct) }
}

function buildBlink(level: number, lang: PassageLang, rng: Rng): GlimpseTrial {
  const minLetters = at(BLINK_MIN_LETTERS, level) - (lang === 'hi' ? 2 : 0)
  const vocabulary = vocabularyOf(lang)
  const long = vocabulary.filter((w) => graphemes(w) >= minLetters)
  const pool = long.length >= 8 ? long : vocabulary
  const word = pool[pickIndex(pool.length, rng)]!
  // Look-alikes: same first letter or same length — real recognition, not guessing.
  const lookAlikes = shuffled(
    vocabulary.filter((w) => w !== word && (w[0] === word[0] || Math.abs(graphemes(w) - graphemes(word)) <= 1)),
    rng,
  )
  const options = shuffled([word, ...lookAlikes.slice(0, 3)], rng)
  return { mode: 'blink', shown: [{ label: word, x: 0.5, y: 0.5 }], flashMs: flashMs('blink', level), question: 'whichWord', options, correctIndex: options.indexOf(word) }
}

export function buildGlimpseTrial(mode: GlimpseMode, level: number, lang: PassageLang, rng: Rng = Math.random): GlimpseTrial {
  if (mode === 'span') return buildSpan(level, rng)
  if (mode === 'peripheral') return buildPeripheral(level, rng)
  if (mode === 'phrase') return buildPhrase(level, lang, rng)
  return buildBlink(level, lang, rng)
}

export function glimpsePoints(level: number, correct: boolean): number {
  return correct ? 10 + level * 2 : 0
}
