// Picture Memory Sprint (route: pictorial-essence-sprint) — remember a set of
// vivid, everyday pictures, then pick from 4.
//
//   L1  3 pictures, 6 s to look         → "Which one did you see?"
//   L2–3 4 pictures, a little less time
//   L4–5 4–5 pictures                    → "Which one was NOT shown?"
//   L6  3 pictures one after another     → tap them in the order you saw them
//   L7  6 pictures                       → "NOT shown"
//   L8  4 in order, faster
//   L9  7 pictures                       → "NOT shown"
//   L10 5 in order, fastest
//
// Every trial uses one theme (all animals, all fruits…), so the wrong options
// are from the same family and the learner has to remember, not guess the
// category. Pictures are standard emoji, chosen from Emoji 12 or older so they
// show on every phone in use today.

export type PictureTheme = 'animals' | 'fruits' | 'vehicles' | 'places' | 'instruments' | 'everyday'

export type PictureItem = { id: string; emoji: string; theme: PictureTheme }

const T = (theme: PictureTheme, pairs: readonly (readonly [string, string])[]): PictureItem[] => pairs.map(([id, emoji]) => ({ id, emoji, theme }))

export const PICTURES: readonly PictureItem[] = [
  ...T('animals', [
    ['elephant', '🐘'], ['tiger', '🐯'], ['giraffe', '🦒'], ['camel', '🐫'], ['peacock', '🦚'], ['monkey', '🐒'],
    ['rabbit', '🐇'], ['turtle', '🐢'], ['owl', '🦉'], ['cow', '🐄'], ['horse', '🐎'], ['penguin', '🐧'],
  ]),
  ...T('fruits', [
    ['mango', '🥭'], ['banana', '🍌'], ['apple', '🍎'], ['grapes', '🍇'], ['watermelon', '🍉'], ['pineapple', '🍍'],
    ['strawberry', '🍓'], ['cherries', '🍒'], ['lemon', '🍋'], ['coconut', '🥥'], ['pear', '🍐'], ['kiwi', '🥝'],
  ]),
  ...T('vehicles', [
    ['autoRickshaw', '🛺'], ['bus', '🚌'], ['train', '🚆'], ['aeroplane', '✈️'], ['bicycle', '🚲'], ['ship', '🚢'],
    ['tractor', '🚜'], ['helicopter', '🚁'], ['scooter', '🛵'], ['rocket', '🚀'], ['ambulance', '🚑'], ['sailboat', '⛵'],
  ]),
  ...T('places', [
    ['mountain', '⛰️'], ['beach', '🏖️'], ['temple', '🛕'], ['castle', '🏰'], ['desert', '🏜️'], ['island', '🏝️'],
    ['tent', '⛺'], ['factory', '🏭'], ['stadium', '🏟️'], ['bridge', '🌉'], ['volcano', '🌋'], ['house', '🏠'],
  ]),
  ...T('instruments', [
    ['guitar', '🎸'], ['drum', '🥁'], ['violin', '🎻'], ['trumpet', '🎺'], ['piano', '🎹'], ['saxophone', '🎷'],
    ['bell', '🔔'], ['microphone', '🎤'], ['banjo', '🪕'], ['headphones', '🎧'],
  ]),
  ...T('everyday', [
    ['umbrella', '☂️'], ['key', '🔑'], ['scissors', '✂️'], ['clock', '⏰'], ['bulb', '💡'], ['book', '📖'],
    ['glasses', '👓'], ['phone', '📱'], ['pencil', '✏️'], ['cup', '☕'], ['schoolBag', '🎒'], ['shoe', '👟'],
  ]),
]

export const THEMES: readonly PictureTheme[] = ['animals', 'fruits', 'vehicles', 'places', 'instruments', 'everyday']

export type PictureMode = 'seen' | 'notSeen' | 'order'

export type PictureLevel = { mode: PictureMode; items: number; studyMs: number; options: number }

export const PICTURE_LEVELS: Readonly<Record<number, PictureLevel>> = {
  1: { mode: 'seen', items: 3, studyMs: 6000, options: 4 },
  2: { mode: 'seen', items: 4, studyMs: 7000, options: 4 },
  3: { mode: 'seen', items: 4, studyMs: 5000, options: 4 },
  4: { mode: 'notSeen', items: 4, studyMs: 6000, options: 4 },
  5: { mode: 'notSeen', items: 5, studyMs: 6000, options: 4 },
  // In order: studyMs is per picture, shown one after another.
  6: { mode: 'order', items: 3, studyMs: 1500, options: 5 },
  7: { mode: 'notSeen', items: 6, studyMs: 6000, options: 4 },
  8: { mode: 'order', items: 4, studyMs: 1200, options: 6 },
  9: { mode: 'notSeen', items: 7, studyMs: 6000, options: 4 },
  10: { mode: 'order', items: 5, studyMs: 1000, options: 7 },
}

export function pictureLevel(level: number): PictureLevel {
  return PICTURE_LEVELS[Math.min(10, Math.max(1, Math.round(level)))] ?? PICTURE_LEVELS[1]!
}

export const TRIALS_PER_ROUND = 3
export const PRACTICE_TRIALS = 2
export const ROUNDS_PER_SESSION = 3

export type PictureTrial = {
  mode: PictureMode
  theme: PictureTheme
  /** What the learner studies (in order, for 'order'). */
  shown: readonly PictureItem[]
  /** What the learner chooses from. */
  options: readonly PictureItem[]
  /** seen / notSeen: index of the one right option. order: unused (-1). */
  correctIndex: number
  studyMs: number
}

export type Rng = () => number

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const a = out[i] as T
    out[i] = out[j] as T
    out[j] = a
  }
  return out
}

/** Builds one trial; `avoidTheme` keeps two trials in a row from sharing a theme. */
export function buildPictureTrial(level: number, rng: Rng = Math.random, avoidTheme?: PictureTheme): PictureTrial {
  const config = pictureLevel(level)
  const themes = THEMES.filter((th) => th !== avoidTheme)
  const theme = themes[Math.floor(rng() * themes.length)] ?? 'animals'
  const pool = shuffled(
    PICTURES.filter((p) => p.theme === theme),
    rng,
  )
  const shown = pool.slice(0, config.items)
  const unseen = pool.slice(config.items)
  if (config.mode === 'seen') {
    const answer = shown[Math.floor(rng() * shown.length)]!
    const options = shuffled([answer, ...unseen.slice(0, config.options - 1)], rng)
    return { mode: 'seen', theme, shown, options, correctIndex: options.indexOf(answer), studyMs: config.studyMs }
  }
  if (config.mode === 'notSeen') {
    const answer = unseen[0]!
    const options = shuffled([answer, ...shuffled(shown, rng).slice(0, config.options - 1)], rng)
    return { mode: 'notSeen', theme, shown, options, correctIndex: options.indexOf(answer), studyMs: config.studyMs }
  }
  const options = shuffled([...shown, ...unseen.slice(0, config.options - config.items)], rng)
  return { mode: 'order', theme, shown, options, correctIndex: -1, studyMs: config.studyMs }
}

/** How many positions of a tapped order match what was shown. */
export function orderMatches(shown: readonly PictureItem[], tapped: readonly PictureItem[]): number {
  return shown.reduce((n, item, i) => (tapped[i]?.id === item.id ? n + 1 : n), 0)
}

/** Total study time for a trial (all pictures together, or one after another). */
export function studyDurationMs(trial: PictureTrial): number {
  return trial.mode === 'order' ? trial.studyMs * trial.shown.length : trial.studyMs
}

export function picturePoints(level: number, correctUnits: number): number {
  return correctUnits * (10 + level * 2)
}
