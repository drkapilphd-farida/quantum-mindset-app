import { clampLevel } from '@/features/exercise-core/levelEngine'
import { STORY_ITEMS, type StudioItem } from './content'

// Story / Link method (Release 2): remember a list in order by linking each
// item to the next in one funny, moving story. Pure logic only.

export const STORY_EXERCISE_ID = 'story-method'
export const STORY_OWN_EXERCISE_ID = 'story-method-own'

export type StoryLevelConfig = { count: number; pictures: boolean; unseen: number }

const LEVELS: readonly StoryLevelConfig[] = [
  { count: 5, pictures: true, unseen: 0 },
  { count: 6, pictures: true, unseen: 0 },
  { count: 7, pictures: true, unseen: 2 },
  { count: 8, pictures: true, unseen: 2 },
  { count: 9, pictures: true, unseen: 3 },
  { count: 10, pictures: false, unseen: 3 },
  { count: 12, pictures: false, unseen: 4 },
  { count: 14, pictures: false, unseen: 4 },
  { count: 17, pictures: false, unseen: 4 },
  { count: 20, pictures: false, unseen: 4 },
]

export function storyLevel(level: number): StoryLevelConfig {
  return LEVELS[clampLevel(level) - 1]!
}

export type Rng = (maxExclusive: number) => number

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = rng(i + 1)
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/** A round's list (in order) and the extra unseen items mixed into the recall choices. Avoids the last round's items where it can. */
export function pickStoryRound(level: number, avoid: readonly string[], rng: Rng): { list: StudioItem[]; unseen: StudioItem[] } {
  const config = storyLevel(level)
  const fresh = STORY_ITEMS.filter((i) => !avoid.includes(i.id))
  const pool = shuffle(fresh.length >= config.count + config.unseen ? fresh : STORY_ITEMS, rng)
  return { list: pool.slice(0, config.count), unseen: pool.slice(config.count, config.count + config.unseen) }
}

/** Items in the right place, counted along the list. */
export function orderScore(list: readonly string[], answer: readonly string[]): number {
  return list.reduce((n, id, i) => (answer[i] === id ? n + 1 : n), 0)
}
