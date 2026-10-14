// Pictures for the Reading & Memory Test: colourful everyday objects and
// animals (the app's own drawings in public/memory-studio/numbers/), named in
// English and Hindi. No weapons, no people, nothing scary.
export type TestPicture = { id: string; en: string; hi: string }

export const pictureSrc = (id: string): string => `/memory-studio/numbers/${id}.svg`

/** The main challenge draws 8 to remember and 8 look-alike distractors from here. */
export const MAIN_PICTURES: readonly TestPicture[] = [
  { id: '1f986', en: 'duck', hi: 'बत्तख' },
  { id: '1f4fa', en: 'TV', hi: 'टीवी' },
  { id: '1f6b0', en: 'tap', hi: 'नल' },
  { id: '1f9f8', en: 'teddy bear', hi: 'टेडी बियर' },
  { id: '1f3b2', en: 'dice', hi: 'पासा' },
  { id: '1f6de', en: 'tyre', hi: 'टायर' },
  { id: '1fa86', en: 'doll', hi: 'गुड़िया' },
  { id: '1f4ba', en: 'seat', hi: 'सीट' },
  { id: '1f6cb', en: 'sofa', hi: 'सोफ़ा' },
  { id: '1f9fc', en: 'soap', hi: 'साबुन' },
  { id: '1f42d', en: 'mouse', hi: 'चूहा' },
  { id: '1f528', en: 'hammer', hi: 'हथौड़ा' },
  { id: '1f3a4', en: 'microphone', hi: 'माइक' },
  { id: '1f5fa', en: 'map', hi: 'नक्शा' },
  { id: '1f98f', en: 'rhino', hi: 'गैंडा' },
  { id: '1f4a1', en: 'bulb', hi: 'बल्ब' },
  { id: '1f411', en: 'sheep', hi: 'भेड़' },
  { id: '1f69a', en: 'lorry', hi: 'ट्रक' },
  { id: '1f36d', en: 'lollipop', hi: 'लॉलीपॉप' },
  { id: 'lychee', en: 'lychee', hi: 'लीची' },
  { id: '1fab5', en: 'log', hi: 'लकड़ी' },
  { id: '2708', en: 'aeroplane', hi: 'हवाई जहाज़' },
  { id: '1f48e', en: 'gem', hi: 'हीरा' },
  { id: '1fad9', en: 'jar', hi: 'जार' },
  { id: '1f41a', en: 'shell', hi: 'सीप' },
  { id: '1f424', en: 'chick', hi: 'चूज़ा' },
  { id: '1f699', en: 'jeep', hi: 'जीप' },
  { id: '1f9e5', en: 'coat', hi: 'कोट' },
  { id: '1fa99', en: 'coin', hi: 'सिक्का' },
  { id: '1f697', en: 'car', hi: 'कार' },
  { id: '1f428', en: 'koala', hi: 'कोआला' },
  { id: '1f6f6', en: 'boat', hi: 'नाव' },
  { id: 'guava', en: 'guava', hi: 'अमरूद' },
  { id: '1f3fa', en: 'pot', hi: 'मटका' },
  { id: '1faad', en: 'fan', hi: 'पंखा' },
  { id: '1f355', en: 'pizza', hi: 'पिज़्ज़ा' },
  { id: '1f350', en: 'pear', hi: 'नाशपाती' },
  { id: '1f437', en: 'pig', hi: 'सूअर' },
  { id: '1f952', en: 'cucumber', hi: 'खीरा' },
  { id: '1f54a', en: 'dove', hi: 'कबूतर' },
  { id: 'lota', en: 'lota', hi: 'लोटा' },
  { id: '1f6c1', en: 'bathtub', hi: 'टब' },
]

/**
 * The bonus Story-method demo: always these 8, in this order, matching the
 * recorded story (one line per picture). Never used in the main challenge.
 */
export const STORY_PICTURES: readonly TestPicture[] = [
  { id: '1f40b', en: 'whale', hi: 'व्हेल' },
  { id: '1f3a1', en: 'giant wheel', hi: 'बड़ा झूला' },
  { id: '1f366', en: 'ice cream', hi: 'आइसक्रीम' },
  { id: '1f4f7', en: 'camera', hi: 'कैमरा' },
  { id: '26f2', en: 'fountain', hi: 'फ़व्वारा' },
  { id: '2709', en: 'envelope', hi: 'लिफ़ाफ़ा' },
  { id: '1f413', en: 'rooster', hi: 'मुर्गा' },
  { id: '1fab4', en: 'flower pot', hi: 'गमला' },
]

/** 8 for the bonus recall grid that are not in the story. */
export const STORY_DISTRACTORS: readonly TestPicture[] = [
  { id: '1f985', en: 'eagle', hi: 'बाज' },
  { id: '1f3f8', en: 'badminton', hi: 'बैडमिंटन' },
  { id: '1f9e3', en: 'scarf', hi: 'मफ़लर' },
  { id: '1f4f0', en: 'newspaper', hi: 'अख़बार' },
  { id: '1f577', en: 'spider', hi: 'मकड़ी' },
  { id: 'rakhi', en: 'rakhi', hi: 'राखी' },
  { id: '1f3b5', en: 'music', hi: 'संगीत' },
  { id: '1f98a', en: 'fox', hi: 'लोमड़ी' },
]

export const SHOW_COUNT = 8
export const SHOW_SECONDS = 20

function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** 8 pictures to remember and a 16-picture grid (those 8 + 8 others), shuffled. */
export function memoryRound(rand: () => number = Math.random): { shown: TestPicture[]; grid: TestPicture[] } {
  const pool = shuffle(MAIN_PICTURES, rand)
  const shown = pool.slice(0, SHOW_COUNT)
  const others = pool.slice(SHOW_COUNT, SHOW_COUNT * 2)
  return { shown, grid: shuffle([...shown, ...others], rand) }
}

export function storyRecallGrid(rand: () => number = Math.random): TestPicture[] {
  return shuffle([...STORY_PICTURES, ...STORY_DISTRACTORS], rand)
}

/** Right picks among the chosen ones (wrong picks don't subtract; at most 8 can be chosen). */
export function scoreRecall(chosen: readonly string[], target: readonly TestPicture[]): number {
  const want = new Set(target.map((p) => p.id))
  return chosen.filter((id) => want.has(id)).length
}
