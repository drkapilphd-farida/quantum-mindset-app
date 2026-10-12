import { clampLevel } from '@/features/exercise-core/levelEngine'
import { STORY_ITEMS, type StudioItem } from './content'
import { shuffle, type Rng } from './storyMethod'

// Peg method (Release 2): hang each item of a numbered list on a fixed
// picture for its number, then answer "what was on 7?". Pure logic only.

export const PEG_EXERCISE_ID = 'peg-method'
export const PEG_LEARN_EXERCISE_ID = 'peg-method-learn'
export const PEG_OWN_EXERCISE_ID = 'peg-method-own'

export type PegLevelConfig = { count: number; mixedOrder: boolean; showPeg: boolean; choices: number }

const LEVELS: readonly PegLevelConfig[] = [
  { count: 5, mixedOrder: false, showPeg: true, choices: 4 },
  { count: 6, mixedOrder: false, showPeg: true, choices: 4 },
  { count: 7, mixedOrder: true, showPeg: true, choices: 4 },
  { count: 8, mixedOrder: true, showPeg: true, choices: 4 },
  { count: 10, mixedOrder: true, showPeg: true, choices: 6 },
  { count: 10, mixedOrder: true, showPeg: false, choices: 6 },
  { count: 12, mixedOrder: true, showPeg: false, choices: 6 },
  { count: 14, mixedOrder: true, showPeg: false, choices: 6 },
  { count: 17, mixedOrder: true, showPeg: false, choices: 6 },
  { count: 20, mixedOrder: true, showPeg: false, choices: 6 },
]

export function pegLevel(level: number): PegLevelConfig {
  return LEVELS[clampLevel(level) - 1]!
}

export type PegQuestion = { n: number; answer: string; options: string[] }

/** A round: items on pegs 1..count, and the questions (in order, or mixed). Options come from the same list. */
export function pickPegRound(level: number, avoid: readonly string[], rng: Rng): { list: StudioItem[]; questions: PegQuestion[] } {
  const config = pegLevel(level)
  const fresh = STORY_ITEMS.filter((i) => !avoid.includes(i.id))
  const list = shuffle(fresh.length >= config.count ? fresh : STORY_ITEMS, rng).slice(0, config.count)
  const numbers = Array.from({ length: config.count }, (_, i) => i + 1)
  const order = config.mixedOrder ? shuffle(numbers, rng) : numbers
  const questions = order.map((n) => {
    const answer = list[n - 1]!.id
    const others = shuffle(
      list.filter((i) => i.id !== answer).map((i) => i.id),
      rng,
    ).slice(0, config.choices - 1)
    return { n, answer, options: shuffle([answer, ...others], rng) }
  })
  return { list, questions }
}
