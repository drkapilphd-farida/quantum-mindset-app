// Memory Studio (Release 2): the fixed material of the Story and Peg methods.
// Pictures are Twemoji (CC BY 4.0, credited on the About page), bundled in
// /public/memory-studio/icons. None of these items is a memory-check word or a
// Memory Palace object, so practising here never makes those checks easier.
// EN and HI names are shown now; the other languages show English names with
// a "native version coming" note until reviewers check them.

export type StudioLang = 'en' | 'hi'

export type StudioItem = { id: string; en: string; hi: string }

const item = (id: string, en: string, hi: string): StudioItem => ({ id, en, hi })

/** Picture items for the Story method (and lists in the Peg method). */
export const STORY_ITEMS: readonly StudioItem[] = [
  item('rocket', 'rocket', 'रॉकेट'), item('guitar', 'guitar', 'गिटार'), item('tomato', 'tomato', 'टमाटर'), item('crown', 'crown', 'मुकुट'),
  item('robot', 'robot', 'रोबोट'), item('lollipop', 'lollipop', 'लॉलीपॉप'), item('penguin', 'penguin', 'पेंगुइन'), item('tent', 'tent', 'तंबू'),
  item('magnet', 'magnet', 'चुंबक'), item('pumpkin', 'pumpkin', 'कद्दू'), item('octopus', 'octopus', 'ऑक्टोपस'), item('scissors', 'scissors', 'कैंची'),
  item('helicopter', 'helicopter', 'हेलिकॉप्टर'), item('cake', 'cake', 'केक'), item('owl', 'owl', 'उल्लू'), item('feather', 'feather', 'पंख'),
  item('tractor', 'tractor', 'ट्रैक्टर'), item('watermelon', 'watermelon', 'तरबूज़'), item('snake', 'snake', 'साँप'), item('hammer', 'hammer', 'हथौड़ा'),
  item('ladder', 'ladder', 'सीढ़ी'), item('dolphin', 'dolphin', 'डॉल्फ़िन'), item('pineapple', 'pineapple', 'अनानास'), item('lock', 'lock', 'ताला'),
  item('crab', 'crab', 'केकड़ा'), item('trumpet', 'trumpet', 'तुरही'), item('coconut', 'coconut', 'नारियल'), item('butterfly', 'butterfly', 'तितली'),
  item('tortoise', 'tortoise', 'कछुआ'), item('sock', 'sock', 'मोज़ा'), item('rose', 'rose', 'गुलाब'), item('bear', 'bear', 'भालू'),
  item('cheese', 'cheese', 'चीज़'), item('violin', 'violin', 'वायलिन'), item('sandwich', 'sandwich', 'सैंडविच'), item('ant', 'ant', 'चींटी'),
  item('telescope', 'telescope', 'दूरबीन'), item('chilli', 'chilli', 'मिर्च'), item('anchor', 'anchor', 'लंगर'), item('zebra', 'zebra', 'ज़ेबरा'),
  item('giraffe', 'giraffe', 'जिराफ़'), item('strawberry', 'strawberry', 'स्ट्रॉबेरी'), item('tooth', 'tooth', 'दाँत'), item('axe', 'axe', 'कुल्हाड़ी'),
  item('mushroom', 'mushroom', 'कुकुरमुत्ता'), item('gift', 'gift', 'तोहफ़ा'), item('corn', 'corn', 'भुट्टा'), item('dinosaur', 'dinosaur', 'डायनासोर'),
  item('ambulance', 'ambulance', 'एम्बुलेंस'), item('parachute', 'parachute', 'पैराशूट'),
]

export function itemIcon(id: string): string {
  return `/memory-studio/icons/${id}.svg`
}

export function itemName(i: StudioItem, lang: StudioLang): string {
  return lang === 'hi' ? i.hi : i.en
}

// ── Pegs ────────────────────────────────────────────────────────────────
// English learners get rhyme pegs (one–bun, two–kangaroo…); everyone else gets
// shape pegs (1 looks like a candle, 2 like a swan…), which work in any
// language. Pegs 11–20 are pegs 1–10 "made of ice".

export type PegSet = 'rhyme' | 'shape'
export type Peg = { n: number; id: string; en: string; hi: string; /** Why it fits: "rhymes with one", "looks like 1". */ hintEn: string; hintHi: string }

const peg = (n: number, id: string, en: string, hi: string, hintEn: string, hintHi: string): Peg => ({ n, id, en, hi, hintEn, hintHi })

export const RHYME_PEGS: readonly Peg[] = [
  peg(1, 'peg-bun', 'bun', 'बन', 'one – bun', 'वन – बन'),
  peg(2, 'peg-kangaroo', 'kangaroo', 'कंगारू', 'two – kangaroo', 'टू – कंगारू'),
  peg(3, 'peg-bee', 'bee', 'मधुमक्खी', 'three – bee', 'थ्री – बी'),
  peg(4, 'peg-boar', 'boar', 'जंगली सूअर', 'four – boar', 'फ़ोर – बोर'),
  peg(5, 'peg-dive', 'diving mask', 'गोताखोर मास्क', 'five – dive', 'फ़ाइव – डाइव'),
  peg(6, 'peg-sticks', 'sticks', 'तीलियाँ', 'six – sticks', 'सिक्स – स्टिक्स'),
  peg(7, 'peg-raven', 'raven', 'कौआ', 'seven – raven', 'सेवन – रेवन'),
  peg(8, 'peg-skate', 'skate', 'स्केट', 'eight – skate', 'एट – स्केट'),
  peg(9, 'peg-sign', 'sign', 'तख़्ती', 'nine – sign', 'नाइन – साइन'),
  peg(10, 'peg-hen', 'hen', 'मुर्गी', 'ten – hen', 'टेन – हेन'),
]

export const SHAPE_PEGS: readonly Peg[] = [
  peg(1, 'shape-candle', 'candle', 'मोमबत्ती', '1 is tall and thin, like a candle', '1 मोमबत्ती जैसा लंबा और पतला है'),
  peg(2, 'shape-swan', 'swan', 'हंस', '2 curves like a swan’s neck', '2 हंस की गर्दन जैसा मुड़ा है'),
  peg(3, 'shape-ear', 'ear', 'कान', '3 looks like an ear', '3 कान जैसा दिखता है'),
  peg(4, 'shape-flag', 'flag', 'झंडा', '4 looks like a flag on a pole', '4 डंडे पर झंडे जैसा दिखता है'),
  peg(5, 'shape-hook', 'hook', 'हुक', '5 has a hook at the bottom', '5 के नीचे हुक जैसा मोड़ है'),
  peg(6, 'shape-snail', 'snail', 'घोंघा', '6 curls like a snail’s shell', '6 घोंघे के खोल जैसा घूमा है'),
  peg(7, 'shape-boomerang', 'boomerang', 'बूमरैंग', '7 is bent like a boomerang', '7 बूमरैंग जैसा मुड़ा है'),
  peg(8, 'shape-snowman', 'snowman', 'स्नोमैन', '8 is two balls, like a snowman', '8 स्नोमैन की तरह दो गोले है'),
  peg(9, 'shape-balloon', 'balloon', 'गुब्बारा', '9 is a balloon on a string', '9 धागे पर गुब्बारा है'),
  peg(10, 'shape-cricket', 'bat and ball', 'बल्ला और गेंद', '10 is a bat (1) and a ball (0)', '10 एक बल्ला (1) और गेंद (0) है'),
]

export const ICE_ICON = '/memory-studio/icons/ice.svg'

/** The peg set a learner uses: rhyme pegs only when the app is in English. */
export function pegSetFor(appLang: string): PegSet {
  return appLang === 'en' ? 'rhyme' : 'shape'
}

/** Peg n (1–20). 11–20 are pegs 1–10 made of ice. */
export function pegFor(set: PegSet, n: number): { base: Peg; ice: boolean } {
  const pegs = set === 'rhyme' ? RHYME_PEGS : SHAPE_PEGS
  const base = pegs[(n - 1) % 10]!
  return { base, ice: n > 10 }
}

export function pegName(p: Peg, lang: StudioLang): string {
  return lang === 'hi' ? p.hi : p.en
}
