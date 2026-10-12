// Memory check (Day 1 and Day 30): the fixed material of the two forms.
// Form A is the starting check, form B the Day 30 check. Each form has 20
// words to remember and 20 unseen words of the same kinds for the recall
// grid (4 per category in each set), and 5 illustrated faces with names.
// The 80 words are everyday, picturable nouns of similar familiarity.
// EN and HI are used now; drafts for the other languages are in
// docs/translations/memory-check-words.csv, pending native review.

export type MemoryLang = 'en' | 'hi'
export type MemoryForm = 'A' | 'B'

export type MemoryWord = { id: string; en: string; hi: string }

type Category = readonly [MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord, MemoryWord]

const w = (id: string, en: string, hi: string): MemoryWord => ({ id, en, hi })

// Per category: [0–3] form A words, [4–7] form A unseen, [8–11] form B words, [12–15] form B unseen.
const CATEGORIES: readonly Category[] = [
  [
    w('dog', 'dog', 'कुत्ता'), w('parrot', 'parrot', 'तोता'), w('camel', 'camel', 'ऊँट'), w('frog', 'frog', 'मेंढक'),
    w('cat', 'cat', 'बिल्ली'), w('lion', 'lion', 'शेर'), w('goat', 'goat', 'बकरी'), w('deer', 'deer', 'हिरण'),
    w('cow', 'cow', 'गाय'), w('monkey', 'monkey', 'बंदर'), w('peacock', 'peacock', 'मोर'), w('rabbit', 'rabbit', 'खरगोश'),
    w('horse', 'horse', 'घोड़ा'), w('elephant', 'elephant', 'हाथी'), w('fish', 'fish', 'मछली'), w('tiger', 'tiger', 'बाघ'),
  ],
  [
    w('mango', 'mango', 'आम'), w('onion', 'onion', 'प्याज़'), w('honey', 'honey', 'शहद'), w('egg', 'egg', 'अंडा'),
    w('banana', 'banana', 'केला'), w('rice', 'rice', 'चावल'), w('lemon', 'lemon', 'नींबू'), w('salt', 'salt', 'नमक'),
    w('apple', 'apple', 'सेब'), w('milk', 'milk', 'दूध'), w('carrot', 'carrot', 'गाजर'), w('sugar', 'sugar', 'चीनी'),
    w('grapes', 'grapes', 'अंगूर'), w('potato', 'potato', 'आलू'), w('tea', 'tea', 'चाय'), w('bread', 'bread', 'रोटी'),
  ],
  [
    w('chair', 'chair', 'कुर्सी'), w('mirror', 'mirror', 'आईना'), w('bucket', 'bucket', 'बाल्टी'), w('key', 'key', 'चाबी'),
    w('table', 'table', 'मेज़'), w('spoon', 'spoon', 'चम्मच'), w('pillow', 'pillow', 'तकिया'), w('clock', 'clock', 'घड़ी'),
    w('door', 'door', 'दरवाज़ा'), w('bottle', 'bottle', 'बोतल'), w('broom', 'broom', 'झाड़ू'), w('plate', 'plate', 'थाली'),
    w('window', 'window', 'खिड़की'), w('cup', 'cup', 'कप'), w('bed', 'bed', 'पलंग'), w('lamp', 'lamp', 'दीपक'),
  ],
  [
    w('river', 'river', 'नदी'), w('star', 'star', 'तारा'), w('stone', 'stone', 'पत्थर'), w('grass', 'grass', 'घास'),
    w('tree', 'tree', 'पेड़'), w('cloud', 'cloud', 'बादल'), w('sand', 'sand', 'रेत'), w('fire', 'fire', 'आग'),
    w('moon', 'moon', 'चाँद'), w('flower', 'flower', 'फूल'), w('leaf', 'leaf', 'पत्ता'), w('forest', 'forest', 'जंगल'),
    w('mountain', 'mountain', 'पहाड़'), w('rain', 'rain', 'बारिश'), w('sea', 'sea', 'समुद्र'), w('sun', 'sun', 'सूरज'),
  ],
  [
    w('bus', 'bus', 'बस'), w('umbrella', 'umbrella', 'छाता'), w('drum', 'drum', 'ढोल'), w('ring', 'ring', 'अँगूठी'),
    w('boat', 'boat', 'नाव'), w('kite', 'kite', 'पतंग'), w('pen', 'pen', 'कलम'), w('shirt', 'shirt', 'कमीज़'),
    w('train', 'train', 'रेलगाड़ी'), w('shoe', 'shoe', 'जूता'), w('ball', 'ball', 'गेंद'), w('bag', 'bag', 'थैला'),
    w('bicycle', 'bicycle', 'साइकिल'), w('cap', 'cap', 'टोपी'), w('book', 'book', 'किताब'), w('ship', 'ship', 'जहाज़'),
  ],
]

const slice = (from: number): MemoryWord[] => CATEGORIES.flatMap((c) => c.slice(from, from + 4))

export const MEMORY_WORDS: Readonly<Record<MemoryForm, { targets: readonly MemoryWord[]; unseen: readonly MemoryWord[] }>> = {
  A: { targets: slice(0), unseen: slice(4) },
  B: { targets: slice(8), unseen: slice(12) },
}

export const ALL_MEMORY_WORDS: readonly MemoryWord[] = CATEGORIES.flat()

export function wordText(word: MemoryWord, lang: MemoryLang): string {
  return lang === 'hi' ? word.hi : word.en
}

// ── Faces ────────────────────────────────────────────────────────────────
// Illustrated, made-up people drawn by the app (never photos of real
// people). Both forms have the same mix: a child, an older person, two
// with glasses, a beard or moustache, and a range of skin tones.

export type Skin = 'light' | 'wheat' | 'medium' | 'brown' | 'deep'
export type Hair = 'short' | 'curly' | 'spiky' | 'plait' | 'bun' | 'shoulder' | 'grey-short' | 'grey-bun'
export type FaceSpec = {
  skin: Skin
  hair: Hair
  glasses: 'none' | 'round' | 'square'
  facialHair: 'none' | 'moustache' | 'beard' | 'grey-moustache'
  bindi: boolean
  earrings: boolean
  age: 'child' | 'adult' | 'older'
}

export type MemoryFace = { id: string; name: { en: string; hi: string }; face: FaceSpec }

const face = (id: string, en: string, hi: string, spec: FaceSpec): MemoryFace => ({ id, name: { en, hi }, face: spec })

export const MEMORY_FACES: Readonly<Record<MemoryForm, readonly MemoryFace[]>> = {
  A: [
    face('arjun', 'Arjun', 'अर्जुन', { skin: 'medium', hair: 'short', glasses: 'none', facialHair: 'moustache', bindi: false, earrings: false, age: 'adult' }),
    face('meera', 'Meera', 'मीरा', { skin: 'wheat', hair: 'plait', glasses: 'none', facialHair: 'none', bindi: true, earrings: true, age: 'adult' }),
    face('farhan', 'Farhan', 'फ़रहान', { skin: 'brown', hair: 'short', glasses: 'round', facialHair: 'beard', bindi: false, earrings: false, age: 'adult' }),
    face('lakshmi', 'Lakshmi', 'लक्ष्मी', { skin: 'medium', hair: 'grey-bun', glasses: 'square', facialHair: 'none', bindi: true, earrings: false, age: 'older' }),
    face('joseph', 'Joseph', 'जोसेफ़', { skin: 'deep', hair: 'curly', glasses: 'none', facialHair: 'none', bindi: false, earrings: false, age: 'child' }),
  ],
  B: [
    face('ravi', 'Ravi', 'रवि', { skin: 'brown', hair: 'grey-short', glasses: 'none', facialHair: 'grey-moustache', bindi: false, earrings: false, age: 'older' }),
    face('ayesha', 'Ayesha', 'आयशा', { skin: 'wheat', hair: 'shoulder', glasses: 'none', facialHair: 'none', bindi: false, earrings: true, age: 'adult' }),
    face('harpreet', 'Harpreet', 'हरप्रीत', { skin: 'light', hair: 'bun', glasses: 'round', facialHair: 'none', bindi: false, earrings: true, age: 'adult' }),
    face('kabir', 'Kabir', 'कबीर', { skin: 'medium', hair: 'spiky', glasses: 'none', facialHair: 'none', bindi: false, earrings: false, age: 'child' }),
    face('tenzin', 'Tenzin', 'तेनज़िन', { skin: 'light', hair: 'short', glasses: 'square', facialHair: 'beard', bindi: false, earrings: false, age: 'adult' }),
  ],
}

export function faceName(f: MemoryFace, lang: MemoryLang): string {
  return lang === 'hi' ? f.name.hi : f.name.en
}

/** The 10-digit number is new every time; its first digit is never 0. */
export const NUMBER_LENGTH = 10
