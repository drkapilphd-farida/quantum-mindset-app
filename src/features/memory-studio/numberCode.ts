import { clampLevel } from '@/features/exercise-core/levelEngine'
import type { StudioLang } from './content'
import { shuffle, type Rng } from './storyMethod'

// Number pictures (Group A): every pair of digits 00–99 has a ready picture,
// built from sounds (the "Major system"): each digit is a sound, and the first
// two sounds of a word give its number (vowels, w, h and y don't count).
// English and Hindi each have their own list, built on their own sounds; the
// other languages use the English list with English words (native lists after
// review). None of the 200 words is a memory-check word or a Memory Palace
// object. Pictures: Twemoji (CC BY 4.0, credited on the About page) and 9 drawn
// by the app in the same style. Pure logic only.

export const NUMBER_EXERCISE_ID = 'number-code'
export const NUMBER_LEARN_EXERCISE_ID = 'number-code-learn'
export const NUMBER_DATES_EXERCISE_ID = 'number-code-dates'
export const NUMBER_OWN_EXERCISE_ID = 'number-code-own'

export type NumberList = 'en' | 'hi'
export type NumberPicture = { n: string; word: string; icon: string }

const p = (n: string, en: string, enIcon: string, hi: string, hiIcon: string): { n: string; en: NumberPicture; hi: NumberPicture } => ({ n, en: { n, word: en, icon: enIcon }, hi: { n, word: hi, icon: hiIcon } })

const PICTURES = [
  p('00', 'seesaw', 'seesaw', 'सी-सॉ', 'seesaw'),
  p('01', 'seat', '1f4ba', 'सीट', '1f4ba'),
  p('02', 'snow', '2744', 'सोना', '1f634'),
  p('03', 'sumo', '1f93c', 'सूमो', '1f93c'),
  p('04', 'sari', '1f97b', 'साड़ी', '1f97b'),
  p('05', 'seal', '1f9ad', 'सेल', '1f50b'),
  p('06', 'sushi', '1f363', 'सोच', '1f914'),
  p('07', 'ski', '1f3bf', 'सिक्का', '1fa99'),
  p('08', 'sofa', '1f6cb', 'सोफ़ा', '1f6cb'),
  p('09', 'soap', '1f9fc', 'सूप', '1f372'),
  p('10', 'dice', '1f3b2', 'टेस्ट', '1f4dd'),
  p('11', 'teddy', '1f9f8', 'दादा', '1f474'),
  p('12', 'tin', '1f96b', 'टीन', '1f96b'),
  p('13', 'thumb', '1f44d', 'दाम', '1f3f7'),
  p('14', 'tyre', '1f6de', 'टायर', '1f6de'),
  p('15', 'doll', '1fa86', 'तेल', '1f6e2'),
  p('16', 'tissue', '1f9fb', 'ताश', '1f0cf'),
  p('17', 'duck', '1f986', 'डाक', '1f4ee'),
  p('18', 'TV', '1f4fa', 'टीवी', '1f4fa'),
  p('19', 'tap', '1f6b0', 'टब', '1f6c1'),
  p('20', 'nose', '1f443', 'न्यूज़', '1f4f0'),
  p('21', 'net', '1f945', 'नट', '1f529'),
  p('22', 'nani', '1f475', 'नानी', '1f475'),
  p('23', 'name tag', '1f4db', 'नाम', '1f4db'),
  p('24', 'winner', '1f947', 'नर्स', '1f9d1-200d-2695-fe0f'),
  p('25', 'nail', '1f485', 'नल', '1f6b0'),
  p('26', 'nacho', 'nacho', 'नाच', '1f483'),
  p('27', 'necklace', '1f4ff', 'नाक', '1f443'),
  p('28', 'knife', '1f52a', 'नवाब', '1f934'),
  p('29', 'nap', '1f634', 'नेपाल', '1f1f3-1f1f5'),
  p('30', 'mouse', '1f42d', 'मास्क', '1f637'),
  p('31', 'mouth', '1f444', 'मटका', '1f3fa'),
  p('32', 'money', '1f4b0', 'मनका', '1f4ff'),
  p('33', 'memo', '1f4dd', 'मेमना', '1f411'),
  p('34', 'hammer', '1f528', 'मुर्गा', '1f413'),
  p('35', 'mail', '1f4ee', 'मेला', '1f3a1'),
  p('36', 'magic', '1fa84', 'मूँछ', '1f978'),
  p('37', 'mic', '1f3a4', 'मकड़ी', '1f577'),
  p('38', 'movie', '1f3ac', 'मफ़लर', '1f9e3'),
  p('39', 'map', '1f5fa', 'मैप', '1f5fa'),
  p('40', 'arrows', '1f3f9', 'रस्सी', '1faa2'),
  p('41', 'rat', '1f400', 'रडार', '1f4e1'),
  p('42', 'rhino', '1f98f', 'रानी', '1f478'),
  p('43', 'ram', '1f40f', 'रुमाल', 'rumal'),
  p('44', 'rower', '1f6a3', 'रेहड़ी', '1f6d2'),
  p('45', 'rail', '1f6e4', 'रील', '1f39e'),
  p('46', 'roach', '1fab3', 'रेशम', '1f9f5'),
  p('47', 'raccoon', '1f99d', 'राखी', 'rakhi'),
  p('48', 'reef', '1fab8', 'रफ़्तार', '1f3ce'),
  p('49', 'rope', '1faa2', 'रिबन', '1f380'),
  p('50', 'lazy', '1f9a5', 'लिस्ट', '1f4cb'),
  p('51', 'light', '1f4a1', 'लोटा', 'lota'),
  p('52', 'alien', '1f47d', 'लेन', '1f6e3'),
  p('53', 'lamb', '1f411', 'लोमड़ी', '1f98a'),
  p('54', 'lorry', '1f69a', 'लॉरी', '1f69a'),
  p('55', 'lolly', '1f36d', 'लाली', '1f484'),
  p('56', 'lychee', 'lychee', 'लीची', 'lychee'),
  p('57', 'log', '1fab5', 'लकड़ी', '1fab5'),
  p('58', 'love', '2764', 'लिफ़ाफ़ा', '2709'),
  p('59', 'lab', '1f9ea', 'लैब', '1f9ea'),
  p('60', 'juice', '1f9c3', 'जासूस', '1f575'),
  p('61', 'jet', '2708', 'शटल', '1f3f8'),
  p('62', 'chain', '26d3', 'जीन्स', '1f456'),
  p('63', 'gem', '1f48e', 'चमगादड़', '1f987'),
  p('64', 'jar', '1fad9', 'चिड़िया', '1f426'),
  p('65', 'shell', '1f41a', 'जाल', '1f945'),
  p('66', 'judge', '1f9d1-200d-2696-fe0f', 'जज', '1f9d1-200d-2696-fe0f'),
  p('67', 'chick', '1f424', 'जोकर', '1f921'),
  p('68', 'chef', '1f9d1-200d-1f373', 'शेफ़', '1f9d1-200d-1f373'),
  p('69', 'jeep', '1f699', 'जीप', '1f699'),
  p('70', 'goose', '1fabf', 'गुस्सा', '1f620'),
  p('71', 'coat', '1f9e5', 'कोट', '1f9e5'),
  p('72', 'coin', '1fa99', 'गाना', '1f3b5'),
  p('73', 'comb', '1faae', 'गमला', '1fab4'),
  p('74', 'car', '1f697', 'कार', '1f697'),
  p('75', 'koala', '1f428', 'कुल्फ़ी', '1f366'),
  p('76', 'cage', 'cage', 'कचरा', '1f5d1'),
  p('77', 'kayak', '1f6f6', 'ककड़ी', '1f952'),
  p('78', 'guava', 'guava', 'कवच', '1f6e1'),
  p('79', 'cab', '1f695', 'कबूतर', '1f54a'),
  p('80', 'vase', '1f3fa', 'फुसफुस', '1f92b'),
  p('81', 'feet', '1f9b6', 'फ़ोटो', '1f4f7'),
  p('82', 'fan', '1faad', 'फ़ैन', '1faad'),
  p('83', 'foam', '1fae7', 'विमान', '2708'),
  p('84', 'fairy', '1f9da', 'फ़रिश्ता', '1f47c'),
  p('85', 'fly', '1fab0', 'व्हेल', '1f40b'),
  p('86', 'veggie', '1f966', 'फ़ौजी', '1f482'),
  p('87', 'fig', 'fig', 'फ़ैक्ट्री', '1f3ed'),
  p('88', 'Wi-Fi', '1f4f6', 'फ़व्वारा', '26f2'),
  p('89', 'VIP', '1f39f', 'वैंपायर', '1f9db'),
  p('90', 'pizza', '1f355', 'पिज़्ज़ा', '1f355'),
  p('91', 'bat', '1f987', 'बत्तख', '1f986'),
  p('92', 'bone', '1f9b4', 'पानी', '1f4a7'),
  p('93', 'poem', '1f4dc', 'बीमार', '1f912'),
  p('94', 'pear', '1f350', 'परी', '1f9da'),
  p('95', 'pill', '1f48a', 'पुल', '1f309'),
  p('96', 'peach', '1f351', 'बाज', '1f985'),
  p('97', 'pig', '1f437', 'बिगुल', '1f4ef'),
  p('98', 'puff', '1f4a8', 'पवन', '1f32c'),
  p('99', 'baby', '1f476', 'बेबी', '1f476'),
]

export const NUMBER_PICTURES: Readonly<Record<NumberList, readonly NumberPicture[]>> = {
  en: PICTURES.map((x) => x.en),
  hi: PICTURES.map((x) => x.hi),
}

/** Hindi learners get the Hindi list; everyone else the English list. */
export function numberListFor(appLang: string): NumberList {
  return appLang === 'hi' ? 'hi' : 'en'
}

export function numberPicture(list: NumberList, pair: string): NumberPicture {
  return NUMBER_PICTURES[list][Number(pair)]!
}

export function numberIcon(icon: string): string {
  return `/memory-studio/numbers/${icon}.svg`
}

/** The sound(s) of each digit, shown on the cards and in the lesson. */
export const DIGIT_SOUNDS: Readonly<Record<NumberList, readonly string[]>> = {
  en: ['s, z', 't, d, th', 'n', 'm', 'r', 'l', 'j, ch, sh', 'k, g', 'f, v', 'p, b'],
  hi: ['स, ज़', 'त, थ, द, ध, ट, ठ, ड, ढ', 'न, ण', 'म', 'र, ड़, ढ़', 'ल', 'च, छ, ज, झ, श, ष', 'क, ख, ग, घ', 'फ, फ़, व', 'प, ब, भ'],
}

/** "47" → "r + k". */
export function pairSounds(list: NumberList, pair: string): string {
  return pair
    .split('')
    .map((d) => DIGIT_SOUNDS[list][Number(d)]!.split(', ')[0]!)
    .join(' + ')
}

/** Learning happens 10 pictures at a time: set 0 = 00–09 … set 9 = 90–99. */
export const NUMBER_SETS = 10
export function setPictures(list: NumberList, set: number): NumberPicture[] {
  return NUMBER_PICTURES[list].slice(set * 10, set * 10 + 10)
}

export type NumberLevelConfig = { digits: number; pictures: boolean }

const LEVELS: readonly NumberLevelConfig[] = [
  { digits: 4, pictures: true },
  { digits: 4, pictures: false },
  { digits: 6, pictures: true },
  { digits: 6, pictures: false },
  { digits: 8, pictures: true },
  { digits: 8, pictures: false },
  { digits: 10, pictures: false },
  { digits: 10, pictures: false },
  { digits: 12, pictures: false },
  { digits: 12, pictures: false },
]

export function numberLevel(level: number): NumberLevelConfig {
  return LEVELS[clampLevel(level) - 1]!
}

/** A random number of `digits` digits (the first digit is never 0). */
export function randomNumber(digits: number, rng: Rng): string {
  let s = String(1 + rng(9))
  while (s.length < digits) s += String(rng(10))
  return s
}

/** "471903" → ["47", "19", "03"]. */
export function pairsOf(number: string): string[] {
  return number.match(/\d{1,2}/g) ?? []
}

/** Digits in the right place. */
export function digitScore(target: string, answer: string): number {
  let n = 0
  for (let i = 0; i < target.length; i++) if (answer[i] === target[i]) n++
  return n
}

// ── Dates: an event + its year, as one scene ──────────────────────────────
// Well-established years only. Event names are English and Hindi; the other
// languages show the English name until native review.

export type HistoryDate = { id: string; year: string; en: string; hi: string }
const d = (id: string, year: string, en: string, hi: string): HistoryDate => ({ id, year, en, hi })

export const HISTORY_DATES: readonly HistoryDate[] = [
  d('independence', '1947', 'India becomes independent', 'भारत आज़ाद हुआ'),
  d('constitution', '1950', 'The Constitution of India comes into force', 'भारत का संविधान लागू हुआ'),
  d('moon-landing', '1969', 'The first people walk on the Moon', 'पहली बार इंसान चाँद पर चले'),
  d('chandrayaan3', '2023', 'Chandrayaan-3 lands on the Moon', 'चंद्रयान-3 चाँद पर उतरा'),
  d('dandi', '1930', 'Gandhiji’s Dandi March', 'गांधीजी का दांडी मार्च'),
  d('panipat1', '1526', 'The First Battle of Panipat', 'पानीपत की पहली लड़ाई'),
  d('revolt', '1857', 'The Revolt of 1857', '1857 की क्रांति'),
  d('quit-india', '1942', 'The Quit India Movement', 'भारत छोड़ो आंदोलन'),
  d('tagore-nobel', '1913', 'Rabindranath Tagore wins the Nobel Prize', 'रवींद्रनाथ टैगोर को नोबेल पुरस्कार मिला'),
  d('world-cup', '1983', 'India wins its first Cricket World Cup', 'भारत ने पहला क्रिकेट वर्ल्ड कप जीता'),
  d('aryabhata', '1975', 'India’s first satellite, Aryabhata, is launched', 'भारत का पहला उपग्रह आर्यभट छोड़ा गया'),
  d('columbus', '1492', 'Columbus reaches the Americas', 'कोलंबस अमेरिका पहुँचा'),
  d('french-revolution', '1789', 'The French Revolution begins', 'फ़्रांसीसी क्रांति शुरू हुई'),
  d('ww1', '1914', 'The First World War begins', 'पहला विश्व युद्ध शुरू हुआ'),
  d('ww2-end', '1945', 'The Second World War ends', 'दूसरा विश्व युद्ध ख़त्म हुआ'),
  d('first-flight', '1903', 'The Wright brothers’ first flight', 'राइट बंधुओं की पहली उड़ान'),
  d('plassey', '1757', 'The Battle of Plassey', 'प्लासी की लड़ाई'),
  d('akbar', '1556', 'Akbar becomes emperor', 'अकबर बादशाह बना'),
  d('mangalyaan', '2014', 'Mangalyaan reaches Mars', 'मंगलयान मंगल ग्रह तक पहुँचा'),
  d('vivekananda', '1893', 'Swami Vivekananda’s speech in Chicago', 'शिकागो में स्वामी विवेकानंद का भाषण'),
]

export function dateEvent(date: HistoryDate, lang: StudioLang): string {
  return lang === 'hi' ? date.hi : date.en
}

export const DATES_PER_ROUND = 3

/** A round of dates, avoiding the last round's where it can. */
export function pickDates(avoid: readonly string[], rng: Rng): HistoryDate[] {
  const fresh = HISTORY_DATES.filter((x) => !avoid.includes(x.id))
  return shuffle(fresh.length >= DATES_PER_ROUND ? fresh : HISTORY_DATES, rng).slice(0, DATES_PER_ROUND)
}
